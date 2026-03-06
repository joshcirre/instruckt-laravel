import type { Annotation, InstrucktConfig, PendingAnnotation, Session } from './types'
import { InstrucktApi } from './api'
import type { AnnotationPayload } from './api'
import { InstrucktSSE } from './sse'
import { Toolbar } from './ui/toolbar'
import { ElementHighlight } from './ui/highlight'
import { AnnotationPopup } from './ui/popup'
import { AnnotationMarkers } from './ui/markers'
import { injectGlobalStyles } from './ui/styles'
import { getElementSelector, getElementName, getNearbyText, getCssClasses, getPageBoundingBox } from './selector'
import * as livewireAdapter from './adapters/livewire'
import * as vueAdapter from './adapters/vue'
import * as svelteAdapter from './adapters/svelte'
import * as reactAdapter from './adapters/react'

// Re-export for api.ts consumers
export type { AnnotationPayload }

const SESSION_KEY = 'instruckt_session'

export class Instruckt {
  private config: Required<Pick<InstrucktConfig, 'endpoint' | 'theme' | 'position'>> & InstrucktConfig
  private api: InstrucktApi
  private sse: InstrucktSSE | null = null
  private toolbar: Toolbar | null = null
  private highlight: ElementHighlight | null = null
  private popup: AnnotationPopup | null = null
  private markers: AnnotationMarkers | null = null
  private annotations: Annotation[] = []
  private session: Session | null = null
  private isAnnotating = false
  private isFrozen = false
  private frozenStyleEl: HTMLStyleElement | null = null
  private rafId: number | null = null
  private pendingMouseTarget: Element | null = null
  private mutationObserver: MutationObserver | null = null
  private boundKeydown: (e: KeyboardEvent) => void
  private boundScroll: () => void
  private boundResize: () => void

  constructor(config: InstrucktConfig) {
    this.config = {
      adapters: ['livewire', 'vue', 'svelte', 'react'],
      theme: 'auto',
      position: 'bottom-right',
      ...config,
    }
    this.api = new InstrucktApi(config.endpoint)
    this.boundKeydown = this.onKeydown.bind(this)
    this.boundScroll = this.onScrollResize.bind(this)
    this.boundResize = this.onScrollResize.bind(this)
    this.init()
  }

  private async init(): Promise<void> {
    injectGlobalStyles()

    if (this.config.theme !== 'auto') {
      document.documentElement.setAttribute('data-instruckt-theme', this.config.theme)
    }

    this.toolbar = new Toolbar(this.config.position, {
      onToggleAnnotate: (active) => this.setAnnotating(active),
      onFreezeAnimations: (frozen) => this.setFrozen(frozen),
      onCopy: () => this.copyAnnotations(),
    })

    this.highlight = new ElementHighlight()
    this.popup = new AnnotationPopup()
    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation))

    document.addEventListener('keydown', this.boundKeydown)
    window.addEventListener('scroll', this.boundScroll, { passive: true })
    window.addEventListener('resize', this.boundResize, { passive: true })

    this.setupMutationObserver()
    await this.connectSession()
  }

  // ── Session ───────────────────────────────────────────────────

  private async connectSession(): Promise<void> {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        const data = await this.api.getSession(stored)
        this.session = data
        this.annotations = data.annotations ?? []
        this.syncMarkersFromAnnotations()
        this.toolbar?.setAnnotationCount(this.pendingCount())
        this.connectSSE(stored)
        return
      } catch {
        sessionStorage.removeItem(SESSION_KEY)
      }
    }
    try {
      this.session = await this.api.createSession(window.location.href)
      sessionStorage.setItem(SESSION_KEY, this.session.id)
      this.config.onSessionCreate?.(this.session)
      this.connectSSE(this.session.id)
    } catch {
      console.warn('[instruckt] Could not connect to server — running offline.')
    }
  }

  private connectSSE(sessionId: string): void {
    this.sse = new InstrucktSSE(this.config.endpoint, sessionId, (annotation) => {
      this.onAnnotationUpdated(annotation)
    })
    this.sse.connect()
  }

  // ── Annotate mode ─────────────────────────────────────────────

  private setAnnotating(active: boolean): void {
    if (active && this.isFrozen) {
      // Mutually exclusive — turn off freeze first
      this.setFrozen(false)
    }
    this.isAnnotating = active
    if (active) {
      this.attachAnnotateListeners()
    } else {
      this.detachAnnotateListeners()
      this.highlight?.hide()
      if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null }
    }
  }

  private setFrozen(frozen: boolean): void {
    if (frozen && this.isAnnotating) {
      this.setAnnotating(false)
      this.toolbar?.setMode('idle')
    }
    this.isFrozen = frozen
    if (frozen) {
      this.frozenStyleEl = document.createElement('style')
      this.frozenStyleEl.id = 'instruckt-freeze'
      this.frozenStyleEl.textContent = `
        *, *::before, *::after { animation-play-state: paused !important; transition: none !important; }
        video { filter: none !important; }
      `
      document.head.appendChild(this.frozenStyleEl)
    } else {
      this.frozenStyleEl?.remove()
      this.frozenStyleEl = null
    }
  }

  // ── Event listeners ───────────────────────────────────────────

  private boundMouseMove = (e: MouseEvent): void => {
    this.pendingMouseTarget = e.target as Element
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null
        if (this.pendingMouseTarget && !this.isInstruckt(this.pendingMouseTarget)) {
          this.highlight?.show(this.pendingMouseTarget)
        } else {
          this.highlight?.hide()
        }
      })
    }
  }

  private boundMouseLeave = (): void => {
    this.highlight?.hide()
  }

  private boundClick = (e: MouseEvent): void => {
    const target = e.target as Element
    if (this.isInstruckt(target)) return
    e.preventDefault()
    e.stopPropagation()

    // Capture selection BEFORE the click can clear it
    const selectedText = window.getSelection()?.toString().trim() || undefined

    const elementPath = getElementSelector(target)
    const elementName = getElementName(target)
    const cssClasses = getCssClasses(target)
    const nearbyText = getNearbyText(target) || undefined
    const boundingBox = getPageBoundingBox(target)
    const framework = this.detectFramework(target) ?? undefined

    const pending: PendingAnnotation = {
      element: target,
      elementPath,
      elementName,
      cssClasses,
      boundingBox,
      x: e.clientX,
      y: e.clientY,
      selectedText,
      nearbyText,
      framework,
    }

    this.popup?.showNew(pending, {
      onSubmit: (result) => this.submitAnnotation(pending, result),
      onCancel: () => {},
    })
  }

  private attachAnnotateListeners(): void {
    document.addEventListener('mousemove', this.boundMouseMove)
    document.addEventListener('mouseleave', this.boundMouseLeave)
    document.addEventListener('click', this.boundClick, true)
  }

  private detachAnnotateListeners(): void {
    document.removeEventListener('mousemove', this.boundMouseMove)
    document.removeEventListener('mouseleave', this.boundMouseLeave)
    document.removeEventListener('click', this.boundClick, true)
  }

  private isInstruckt(el: Element): boolean {
    return el.closest('[data-instruckt]') !== null
  }

  // ── Framework detection ───────────────────────────────────────

  private detectFramework(el: Element) {
    const adapters = this.config.adapters ?? []
    if (adapters.includes('livewire')) {
      const ctx = livewireAdapter.getContext(el)
      if (ctx) return ctx
    }
    if (adapters.includes('vue')) {
      const ctx = vueAdapter.getContext(el)
      if (ctx) return ctx
    }
    if (adapters.includes('svelte')) {
      const ctx = svelteAdapter.getContext(el)
      if (ctx) return ctx
    }
    if (adapters.includes('react')) {
      const ctx = reactAdapter.getContext(el)
      if (ctx) return ctx
    }
    return null
  }

  // ── Submit ────────────────────────────────────────────────────

  private async submitAnnotation(
    pending: PendingAnnotation,
    result: { comment: string; intent: Annotation['intent']; severity: Annotation['severity'] },
  ): Promise<void> {
    if (!this.session) {
      await this.connectSession()
      if (!this.session) {
        console.warn('[instruckt] No session — annotation not saved.')
        return
      }
    }

    const payload: AnnotationPayload = {
      x: (pending.x / window.innerWidth) * 100,
      y: pending.y + window.scrollY,
      comment: result.comment,
      element: pending.elementName,
      elementPath: pending.elementPath,
      cssClasses: pending.cssClasses,
      boundingBox: pending.boundingBox,
      selectedText: pending.selectedText,
      nearbyText: pending.nearbyText,
      intent: result.intent,
      severity: result.severity,
      framework: pending.framework,
      url: window.location.href,
    }

    try {
      const annotation = await this.api.addAnnotation(this.session.id, payload)
      this.annotations.push(annotation)
      this.markers?.upsert(annotation, this.annotations.length)
      this.toolbar?.setAnnotationCount(this.pendingCount())
      this.config.onAnnotationAdd?.(annotation)
    } catch (err) {
      console.error('[instruckt] Failed to save annotation:', err)
    }
  }

  // ── Marker click — show thread ────────────────────────────────

  private onMarkerClick(annotation: Annotation): void {
    this.popup?.showThread(annotation, {
      onResolve: async (a) => {
        try {
          const updated = await this.api.updateAnnotation(a.id, { status: 'resolved' })
          this.onAnnotationUpdated(updated)
        } catch (err) {
          console.error('[instruckt] Failed to resolve annotation:', err)
        }
      },
      onReply: async (a, content) => {
        try {
          const updated = await this.api.addReply(a.id, content, 'human')
          this.onAnnotationUpdated(updated)
        } catch (err) {
          console.error('[instruckt] Failed to add reply:', err)
        }
      },
    })
  }

  // ── SSE updates ───────────────────────────────────────────────

  private onAnnotationUpdated(updated: Annotation): void {
    const idx = this.annotations.findIndex(a => a.id === updated.id)
    if (idx >= 0) {
      this.annotations[idx] = updated
      this.markers?.update(updated)
    } else {
      this.annotations.push(updated)
      this.markers?.upsert(updated, this.annotations.length)
    }
    this.toolbar?.setAnnotationCount(this.pendingCount())
    this.config.onAnnotationResolve?.(updated)
  }

  // ── MutationObserver — handles Livewire/Vue DOM teardown ──────

  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      // When nodes are removed, check if any annotation's element path is gone
      const anyRemoved = mutations.some(m => m.removedNodes.length > 0)
      if (!anyRemoved) return

      // Reposition markers since DOM changed (Livewire re-render shifts layout)
      this.markers?.reposition(this.annotations)
    })

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  // ── Scroll/resize — reposition markers ───────────────────────

  private onScrollResize(): void {
    this.markers?.reposition(this.annotations)
  }

  // ── Keyboard ──────────────────────────────────────────────────

  private onKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement
    // Skip inputs, textareas, selects, and any contenteditable
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    if (target.closest('[contenteditable="true"]')) return

    if (e.key === 'a' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const next = !this.isAnnotating
      this.toolbar?.setMode(next ? 'annotating' : 'idle')
      this.setAnnotating(next)
    }
    if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const next = !this.isFrozen
      this.toolbar?.setMode(next ? 'frozen' : 'idle')
      this.setFrozen(next)
    }
    if (e.key === 'Escape') {
      if (this.isAnnotating) {
        this.toolbar?.setMode('idle')
        this.setAnnotating(false)
      }
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

  private pendingCount(): number {
    return this.annotations.filter(a => a.status === 'pending' || a.status === 'acknowledged').length
  }

  private syncMarkersFromAnnotations(): void {
    this.annotations.forEach((a, i) => this.markers?.upsert(a, i + 1))
  }

  // ── Copy / export ─────────────────────────────────────────────

  private copyAnnotations(): void {
    const md = this.exportMarkdown()
    navigator.clipboard.writeText(md).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const el = document.createElement('textarea')
      el.value = md
      el.style.cssText = 'position:fixed;left:-9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      el.remove()
    })
  }

  exportMarkdown(): string {
    const pending = this.annotations.filter(a => a.status === 'pending' || a.status === 'acknowledged')
    if (pending.length === 0) {
      return `## Instruckt Feedback — ${window.location.href}\n\nNo open annotations.`
    }

    const lines: string[] = [
      `## Instruckt Feedback — ${window.location.href}`,
      `> ${pending.length} open annotation${pending.length === 1 ? '' : 's'}`,
      '',
    ]

    pending.forEach((a, i) => {
      const severityIcon = a.severity === 'blocking' ? '🔴' : a.severity === 'important' ? '🟠' : '🟡'
      const intentLabel = a.intent === 'fix' ? 'Fix' : a.intent === 'change' ? 'Change' : a.intent === 'question' ? 'Question' : 'Approve'
      lines.push(`### ${i + 1}. ${a.element} — ${intentLabel} ${severityIcon}`)
      lines.push('')
      lines.push(a.comment)
      lines.push('')
      lines.push(`**Selector**: \`${a.elementPath}\``)
      if (a.framework) {
        const fw = a.framework
        const label = fw.framework === 'livewire' ? `Livewire — ${fw.component}` : fw.framework === 'vue' ? `Vue — ${fw.component}` : fw.framework === 'react' ? `React — ${fw.component}` : fw.component
        lines.push(`**Component**: ${label}`)
      }
      if (a.selectedText) lines.push(`**Selected text**: "${a.selectedText}"`)
      if (a.thread && a.thread.length > 0) {
        lines.push('')
        lines.push('**Thread:**')
        a.thread.forEach(m => {
          lines.push(`- **${m.role === 'agent' ? 'Agent' : 'You'}**: ${m.content}`)
        })
      }
      lines.push('')
      lines.push('---')
      lines.push('')
    })

    return lines.join('\n')
  }

  // ── Public API ────────────────────────────────────────────────

  getAnnotations(): Annotation[] { return [...this.annotations] }
  getSession(): Session | null { return this.session }

  destroy(): void {
    this.setAnnotating(false)
    this.setFrozen(false)
    document.removeEventListener('keydown', this.boundKeydown)
    window.removeEventListener('scroll', this.boundScroll)
    window.removeEventListener('resize', this.boundResize)
    this.mutationObserver?.disconnect()
    this.sse?.disconnect()
    this.toolbar?.destroy()
    this.highlight?.destroy()
    this.popup?.destroy()
    this.markers?.destroy()
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
  }
}
