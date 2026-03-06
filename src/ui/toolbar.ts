import { TOOLBAR_CSS } from './styles'

export type ToolbarMode = 'idle' | 'annotating' | 'frozen'

interface ToolbarCallbacks {
  onToggleAnnotate: (active: boolean) => void
  onFreezeAnimations: (frozen: boolean) => void
  onCopy: () => void
  onClearPage?: () => void
  onClearAll?: () => void
  onMinimize?: (minimized: boolean) => void
}

// ── Inline SVG icons (24x24, 2px stroke) ─────────────────────

const ICONS = {
  annotate: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
  freeze: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clear: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  minimize: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>`,
  logo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
} as const

export class Toolbar {
  private host!: HTMLElement
  private shadow!: ShadowRoot
  private toolbarEl!: HTMLDivElement
  private fab!: HTMLButtonElement
  private fabBadge: HTMLSpanElement | null = null
  private annotateBtn!: HTMLButtonElement
  private freezeBtn!: HTMLButtonElement
  private copyBtn!: HTMLButtonElement
  private annotateActive = false
  private freezeActive = false
  private minimized = false
  private totalCount = 0
  private dragging = false
  private dragOffset = { x: 0, y: 0 }

  constructor(
    private readonly position: string,
    private readonly callbacks: ToolbarCallbacks,
  ) {
    this.build()
    this.setupDrag()
  }

  private build(): void {
    this.host = document.createElement('div')
    this.host.setAttribute('data-instruckt', 'toolbar')
    this.shadow = this.host.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = TOOLBAR_CSS
    this.shadow.appendChild(style)

    // Full toolbar
    this.toolbarEl = document.createElement('div')
    this.toolbarEl.className = 'toolbar'

    this.annotateBtn = this.makeBtn(ICONS.annotate, 'Annotate elements (A)', () => {
      const next = !this.annotateActive
      this.setAnnotateActive(next)
      this.callbacks.onToggleAnnotate(next)
    })

    this.freezeBtn = this.makeBtn(ICONS.freeze, 'Freeze page (F)', () => {
      const next = !this.freezeActive
      this.setFreezeActive(next)
      this.callbacks.onFreezeAnimations(next)
    })

    this.copyBtn = this.makeBtn(ICONS.copy, 'Copy annotations as markdown', () => {
      this.callbacks.onCopy()
      this.copyBtn.innerHTML = ICONS.check
      setTimeout(() => { this.copyBtn.innerHTML = ICONS.copy }, 1200)
    })

    const clearWrap = document.createElement('div')
    clearWrap.className = 'clear-wrap'

    const clearBtn = this.makeBtn(ICONS.clear, 'Clear this page (X)', () => {
      this.callbacks.onClearPage?.()
    })
    clearBtn.classList.add('danger-btn')

    const clearAllBtn = this.makeBtn(
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      'Clear ALL annotations across every page',
      () => this.callbacks.onClearAll?.(),
    )
    clearAllBtn.classList.add('danger-btn', 'clear-all-btn')

    clearWrap.appendChild(clearBtn)
    clearWrap.appendChild(clearAllBtn)

    const minimizeBtn = this.makeBtn(ICONS.minimize, 'Minimize toolbar', () => {
      this.setMinimized(true)
    })
    minimizeBtn.classList.add('minimize-btn')

    const mkDiv = () => { const d = document.createElement('div'); d.className = 'divider'; return d }

    this.toolbarEl.append(
      this.annotateBtn, mkDiv(), this.freezeBtn, mkDiv(),
      this.copyBtn, clearWrap, mkDiv(), minimizeBtn,
    )
    this.shadow.appendChild(this.toolbarEl)

    // Floating action button (minimized state)
    this.fab = document.createElement('button')
    this.fab.className = 'fab'
    this.fab.title = 'Open instruckt toolbar'
    this.fab.setAttribute('aria-label', 'Open instruckt toolbar')
    this.fab.innerHTML = ICONS.logo
    this.fab.style.display = 'none'
    this.fab.addEventListener('click', (e) => {
      e.stopPropagation()
      this.setMinimized(false)
    })
    this.shadow.appendChild(this.fab)

    // Prevent toolbar clicks from reaching page handlers (e.g. Alpine @click.outside)
    // Shadow DOM stopPropagation only works within the shadow tree — clicks still
    // re-dispatch from the host element into the regular DOM.
    this.host.addEventListener('click', (e) => e.stopPropagation())
    this.host.addEventListener('mousedown', (e) => e.stopPropagation())
    this.host.addEventListener('pointerdown', (e) => e.stopPropagation())

    this.applyPosition()
    const root = document.getElementById('instruckt-root') ?? document.body
    root.appendChild(this.host)
  }

  private makeBtn(iconHtml: string, title: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.className = 'btn'
    btn.title = title
    btn.setAttribute('aria-label', title)
    btn.innerHTML = iconHtml
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      onClick()
    })
    return btn
  }

  private applyPosition(): void {
    const m = '16px'
    Object.assign(this.host.style, {
      position: 'fixed',
      zIndex: '2147483646',
      bottom: this.position.includes('bottom') ? m : 'auto',
      top: this.position.includes('top') ? m : 'auto',
      right: this.position.includes('right') ? m : 'auto',
      left: this.position.includes('left') ? m : 'auto',
    })
  }

  private setupDrag(): void {
    this.shadow.addEventListener('mousedown', (evt) => {
      const e = evt as MouseEvent
      if ((e.target as Element).closest('.btn') || (e.target as Element).closest('.fab')) return
      this.dragging = true
      const rect = this.host.getBoundingClientRect()
      this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      e.preventDefault()
    })

    document.addEventListener('mousemove', (e) => {
      if (!this.dragging) return
      Object.assign(this.host.style, {
        left: `${e.clientX - this.dragOffset.x}px`,
        top: `${e.clientY - this.dragOffset.y}px`,
        right: 'auto',
        bottom: 'auto',
      })
    })

    document.addEventListener('mouseup', () => { this.dragging = false })
  }

  private setMinimized(min: boolean): void {
    this.minimized = min
    this.toolbarEl.style.display = min ? 'none' : ''
    this.fab.style.display = min ? '' : 'none'
    this.updateFabBadge()
    this.callbacks.onMinimize?.(min)
  }

  private updateFabBadge(): void {
    if (this.totalCount > 0 && this.minimized) {
      if (!this.fabBadge) {
        this.fabBadge = document.createElement('span')
        this.fabBadge.className = 'fab-badge'
        this.fab.appendChild(this.fabBadge)
      }
      this.fabBadge.textContent = this.totalCount > 99 ? '99+' : String(this.totalCount)
    } else {
      this.fabBadge?.remove()
      this.fabBadge = null
    }
  }

  isMinimized(): boolean {
    return this.minimized
  }

  /** Programmatically minimize without firing callback */
  minimize(): void {
    this.minimized = true
    this.toolbarEl.style.display = 'none'
    this.fab.style.display = ''
    this.updateFabBadge()
  }

  setAnnotateActive(active: boolean): void {
    this.annotateActive = active
    this.annotateBtn.classList.toggle('active', active)
    document.body.classList.toggle('ik-annotating', active)
  }

  setFreezeActive(active: boolean): void {
    this.freezeActive = active
    this.freezeBtn.classList.toggle('active', active)
  }

  // Keep for compatibility — resolves visual mode from instruckt.ts
  setMode(mode: ToolbarMode): void {
    this.setAnnotateActive(mode === 'annotating')
  }

  setAnnotationCount(count: number): void {
    let badge = this.annotateBtn.querySelector('.badge')
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span')
        badge.className = 'badge'
        this.annotateBtn.appendChild(badge)
      }
      badge.textContent = count > 99 ? '99+' : String(count)
    } else {
      badge?.remove()
    }
  }

  setTotalCount(count: number): void {
    this.totalCount = count
    this.updateFabBadge()
  }

  destroy(): void {
    this.host.remove()
    document.body.classList.remove('ik-annotating')
  }
}
