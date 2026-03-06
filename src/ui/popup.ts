import type { Annotation, AnnotationIntent, AnnotationSeverity, PendingAnnotation } from '../types'
import { POPUP_CSS } from './styles'

interface PopupResult {
  comment: string
  intent: AnnotationIntent
  severity: AnnotationSeverity
}

interface PopupCallbacks {
  onSubmit: (result: PopupResult) => void
  onCancel: () => void
}

interface ThreadCallbacks {
  onResolve: (annotation: Annotation) => void
  onReply: (annotation: Annotation, content: string) => void
}

function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function fwIcon(fw: string): string {
  return ({ livewire: '⚡', vue: '💚', svelte: '🧡' } as Record<string, string>)[fw] ?? '🔧'
}

/** Annotation popup — rendered in its own shadow DOM for CSS isolation */
export class AnnotationPopup {
  private host: HTMLElement | null = null
  private shadow: ShadowRoot | null = null
  private intent: AnnotationIntent = 'fix'
  private severity: AnnotationSeverity = 'important'

  // ── New annotation popup ──────────────────────────────────────

  showNew(pending: PendingAnnotation, callbacks: PopupCallbacks): void {
    this.destroy()
    this.host = document.createElement('div')
    this.host.setAttribute('data-instruckt', 'popup')
    this.shadow = this.host.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = POPUP_CSS
    this.shadow.appendChild(style)

    const popup = document.createElement('div')
    popup.className = 'popup'

    const fwBadge = pending.framework
      ? `<div class="fw-badge">${fwIcon(pending.framework.framework)} ${esc(pending.framework.component)}</div>`
      : ''
    const selText = pending.selectedText
      ? `<div class="selected-text">"${esc(pending.selectedText.slice(0, 80))}"</div>`
      : ''

    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(pending.elementPath)}">${esc(pending.elementName)}</span>
        <button class="close-btn" title="Cancel (Esc)">✕</button>
      </div>
      ${fwBadge}${selText}
      <div class="label">Intent</div>
      <div class="row">
        <div class="chips" data-group="intent">
          <button class="chip sel" data-value="fix">Fix</button>
          <button class="chip" data-value="change">Change</button>
          <button class="chip" data-value="question">Question</button>
          <button class="chip" data-value="approve">Approve</button>
        </div>
      </div>
      <div class="label">Severity</div>
      <div class="row">
        <div class="chips" data-group="severity">
          <button class="chip blocking" data-value="blocking">Blocking</button>
          <button class="chip important sel" data-value="important">Important</button>
          <button class="chip suggestion" data-value="suggestion">Suggestion</button>
        </div>
      </div>
      <textarea placeholder="Describe what you'd like changed…" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `

    this.wireChips(popup, 'intent', (v) => { this.intent = v as AnnotationIntent })
    this.wireChips(popup, 'severity', (v) => { this.severity = v as AnnotationSeverity })

    const textarea = popup.querySelector('textarea')!
    const submitBtn = popup.querySelector<HTMLButtonElement>('[data-action="submit"]')!

    textarea.addEventListener('input', () => {
      submitBtn.disabled = textarea.value.trim().length === 0
    })
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (!submitBtn.disabled) submitBtn.click()
      }
      if (e.key === 'Escape') { callbacks.onCancel(); this.destroy() }
    })

    popup.querySelector('[data-action="cancel"]')!.addEventListener('click', () => {
      callbacks.onCancel(); this.destroy()
    })
    popup.querySelector('.close-btn')!.addEventListener('click', () => {
      callbacks.onCancel(); this.destroy()
    })
    submitBtn.addEventListener('click', () => {
      const comment = textarea.value.trim()
      if (!comment) return
      callbacks.onSubmit({ comment, intent: this.intent, severity: this.severity })
      this.destroy()
    })

    this.shadow.appendChild(popup)
    document.body.appendChild(this.host)

    this.positionHost(pending.x, pending.y)
    this.setupOutsideClick()
    textarea.focus()
  }

  // ── Thread / existing annotation popup ───────────────────────

  showThread(annotation: Annotation, callbacks: ThreadCallbacks): void {
    this.destroy()
    this.host = document.createElement('div')
    this.host.setAttribute('data-instruckt', 'popup')
    this.shadow = this.host.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = POPUP_CSS
    this.shadow.appendChild(style)

    const popup = document.createElement('div')
    popup.className = 'popup'

    const statusLabel = (s: string) => `<span class="status-badge ${esc(s)}">${esc(s)}</span>`
    const thread = (annotation.thread ?? []).map(m => `
      <div class="msg">
        <div class="msg-role ${esc(m.role)}">${m.role === 'agent' ? '🤖 Agent' : '👤 You'}</div>
        <div class="msg-content">${esc(m.content)}</div>
      </div>
    `).join('')

    const isPending = ['pending', 'acknowledged'].includes(annotation.status)

    popup.innerHTML = `
      <div class="header">
        <span class="element-tag">${esc(annotation.element)}</span>
        <button class="close-btn">✕</button>
      </div>
      ${statusLabel(annotation.status)}
      <div class="selected-text" style="margin-top:8px;">${esc(annotation.comment)}</div>
      ${thread ? `<div class="thread">${thread}</div>` : ''}
      ${isPending ? `
        <div class="thread" style="margin-top:8px;">
          <textarea placeholder="Add a reply…" rows="2"></textarea>
          <div class="actions" style="margin-top:6px;">
            <button class="btn-secondary" data-action="resolve">Mark resolved</button>
            <button class="btn-primary" data-action="reply" disabled>Reply</button>
          </div>
        </div>
      ` : ''}
    `

    popup.querySelector('.close-btn')!.addEventListener('click', () => this.destroy())

    if (isPending) {
      const textarea = popup.querySelector('textarea')!
      const replyBtn = popup.querySelector<HTMLButtonElement>('[data-action="reply"]')!
      textarea.addEventListener('input', () => {
        replyBtn.disabled = textarea.value.trim().length === 0
      })
      replyBtn.addEventListener('click', () => {
        const content = textarea.value.trim()
        if (!content) return
        callbacks.onReply(annotation, content)
        this.destroy()
      })
      popup.querySelector('[data-action="resolve"]')!.addEventListener('click', () => {
        callbacks.onResolve(annotation)
        this.destroy()
      })
    }

    this.shadow.appendChild(popup)
    document.body.appendChild(this.host)

    // Position near center of screen for thread view
    this.positionHost(window.innerWidth / 2 - 170, window.innerHeight / 2 - 150)
    this.setupOutsideClick()
  }

  // ── Helpers ───────────────────────────────────────────────────

  private wireChips(container: HTMLElement, group: string, onChange: (v: string) => void): void {
    container.querySelectorAll<HTMLButtonElement>(`[data-group="${group}"] .chip`).forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll(`[data-group="${group}"] .chip`).forEach(b => b.classList.remove('sel'))
        btn.classList.add('sel')
        onChange(btn.dataset.value!)
      })
    })
  }

  private positionHost(x: number, y: number): void {
    if (!this.host) return
    // Temporarily visible to measure
    Object.assign(this.host.style, { position: 'fixed', zIndex: '2147483647', left: '-9999px', top: '0' })

    requestAnimationFrame(() => {
      if (!this.host) return
      const w = 340 + 20
      const h = this.host.querySelector('.popup')?.getBoundingClientRect().height ?? 300
      const vw = window.innerWidth
      const vh = window.innerHeight
      const left = Math.max(10, Math.min(x + 10, vw - w))
      const top  = Math.max(10, Math.min(y + 10, vh - h - 10))
      Object.assign(this.host.style, { left: `${left}px`, top: `${top}px` })
    })
  }

  private boundOutside = (e: MouseEvent): void => {
    if (this.host && !this.host.contains(e.target as Node)) {
      this.destroy()
    }
  }

  private setupOutsideClick(): void {
    // Use setTimeout so this click event doesn't immediately fire for the triggering click
    setTimeout(() => document.addEventListener('mousedown', this.boundOutside), 0)
  }

  destroy(): void {
    this.host?.remove()
    this.host = null
    this.shadow = null
    document.removeEventListener('mousedown', this.boundOutside)
  }
}
