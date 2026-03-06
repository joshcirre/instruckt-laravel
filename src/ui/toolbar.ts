import { TOOLBAR_CSS } from './styles'

export type ToolbarMode = 'idle' | 'annotating' | 'frozen'

interface ToolbarCallbacks {
  onToggleAnnotate: (active: boolean) => void
  onFreezeAnimations: (frozen: boolean) => void
  onCopy: () => void
}

// ── Inline SVG icons (24x24, 2px stroke) ─────────────────────

const ICONS = {
  annotate: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
  freeze: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
} as const

export class Toolbar {
  private host!: HTMLElement
  private shadow!: ShadowRoot
  private annotateBtn!: HTMLButtonElement
  private freezeBtn!: HTMLButtonElement
  private copyBtn!: HTMLButtonElement
  private mode: ToolbarMode = 'idle'
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

    const toolbar = document.createElement('div')
    toolbar.className = 'toolbar'

    this.annotateBtn = this.makeBtn(ICONS.annotate, 'Annotate elements (A)', () => {
      const next = this.mode !== 'annotating'
      this.setMode(next ? 'annotating' : 'idle')
      this.callbacks.onToggleAnnotate(next)
    })

    this.freezeBtn = this.makeBtn(ICONS.freeze, 'Freeze animations (F)', () => {
      const next = this.mode !== 'frozen'
      this.setMode(next ? 'frozen' : 'idle')
      this.callbacks.onFreezeAnimations(next)
    })

    this.copyBtn = this.makeBtn(ICONS.copy, 'Copy annotations as markdown', () => {
      this.callbacks.onCopy()
      this.copyBtn.innerHTML = ICONS.check
      setTimeout(() => { this.copyBtn.innerHTML = ICONS.copy }, 1200)
    })

    const divider = document.createElement('div')
    divider.className = 'divider'
    const divider2 = document.createElement('div')
    divider2.className = 'divider'

    toolbar.append(this.annotateBtn, divider, this.freezeBtn, divider2, this.copyBtn)
    this.shadow.appendChild(toolbar)

    this.applyPosition()
    document.body.appendChild(this.host)
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
    this.shadow.addEventListener('mousedown', (e) => {
      if ((e.target as Element).closest('.btn')) return
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

  setMode(mode: ToolbarMode): void {
    this.mode = mode
    this.annotateBtn.classList.toggle('active', mode === 'annotating')
    this.freezeBtn.classList.toggle('active', mode === 'frozen')
    document.body.classList.toggle('ik-annotating', mode === 'annotating')
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

  destroy(): void {
    this.host.remove()
    document.body.classList.remove('ik-annotating')
  }
}
