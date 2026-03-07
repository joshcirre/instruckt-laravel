import type { Annotation, PendingAnnotation } from '../types'
import { POPUP_CSS } from './styles'

interface PopupResult {
  comment: string
}

interface PopupCallbacks {
  onSubmit: (result: PopupResult) => void
  onCancel: () => void
}

interface EditCallbacks {
  onSave: (annotation: Annotation, newComment: string) => void
  onDelete: (annotation: Annotation) => void
}

function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Annotation popup — rendered in its own shadow DOM for CSS isolation */
export class AnnotationPopup {
  private host: HTMLElement | null = null
  private shadow: ShadowRoot | null = null

  // ── New annotation popup ──────────────────────────────────────

  showNew(pending: PendingAnnotation, callbacks: PopupCallbacks): void {
    this.destroy()
    this.host = document.createElement('div')
    this.host.setAttribute('data-instruckt', 'popup')
    this.stopHostPropagation(this.host)
    this.shadow = this.host.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = POPUP_CSS
    this.shadow.appendChild(style)

    const popup = document.createElement('div')
    popup.className = 'popup'

    const fwBadge = pending.framework
      ? `<div class="fw-badge">${esc(pending.framework.component)}</div>`
      : ''
    const selText = pending.selectedText
      ? `<div class="selected-text">"${esc(pending.selectedText.slice(0, 80))}"</div>`
      : ''

    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(pending.elementPath)}">${esc(pending.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">✕</button>
      </div>
      ${fwBadge}${selText}
      <textarea placeholder="What needs to change here?" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `

    const textarea = popup.querySelector('textarea')!
    const submitBtn = popup.querySelector<HTMLButtonElement>('[data-action="submit"]')!

    textarea.addEventListener('input', () => {
      submitBtn.disabled = textarea.value.trim().length === 0
    })
    textarea.addEventListener('keydown', (e) => {
      // Stop ALL keyboard events from reaching page forms (React, Inertia, etc.)
      e.stopPropagation()
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
      callbacks.onSubmit({ comment })
      this.destroy()
    })

    this.shadow.appendChild(popup)
    ;(document.getElementById('instruckt-root') ?? document.body).appendChild(this.host)

    this.positionHost(pending.x, pending.y)
    this.setupOutsideClick()
    textarea.focus()
  }

  // ── Edit existing annotation ──────────────────────────────────

  showEdit(annotation: Annotation, callbacks: EditCallbacks): void {
    this.destroy()
    this.host = document.createElement('div')
    this.host.setAttribute('data-instruckt', 'popup')
    this.stopHostPropagation(this.host)
    this.shadow = this.host.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = POPUP_CSS
    this.shadow.appendChild(style)

    const popup = document.createElement('div')
    popup.className = 'popup'

    const fwBadge = annotation.framework
      ? `<div class="fw-badge">${esc(annotation.framework.component)}</div>`
      : ''

    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(annotation.elementPath)}">${esc(annotation.element)}</span>
        <button class="close-btn">✕</button>
      </div>
      ${fwBadge}
      <textarea rows="3">${esc(annotation.comment)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `

    popup.querySelector('.close-btn')!.addEventListener('click', () => this.destroy())

    const textarea = popup.querySelector('textarea')!
    const saveBtn = popup.querySelector<HTMLButtonElement>('[data-action="save"]')!
    const deleteBtn = popup.querySelector<HTMLButtonElement>('[data-action="delete"]')!

    textarea.addEventListener('keydown', (e) => {
      e.stopPropagation()
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        saveBtn.click()
      }
      if (e.key === 'Escape') this.destroy()
    })

    saveBtn.addEventListener('click', () => {
      const newComment = textarea.value.trim()
      if (!newComment) return
      callbacks.onSave(annotation, newComment)
      this.destroy()
    })

    deleteBtn.addEventListener('click', () => {
      callbacks.onDelete(annotation)
      this.destroy()
    })

    this.shadow.appendChild(popup)
    ;(document.getElementById('instruckt-root') ?? document.body).appendChild(this.host)

    // Position near the marker
    const markerX = (annotation.x / 100) * window.innerWidth
    const markerY = annotation.y - window.scrollY
    this.positionHost(markerX, markerY)
    this.setupOutsideClick()
    textarea.focus()
    textarea.setSelectionRange(textarea.value.length, textarea.value.length)
  }

  // ── Helpers ───────────────────────────────────────────────────

  /** Prevent popup interactions from reaching page handlers (e.g. @click.outside, form submit) */
  private stopHostPropagation(host: HTMLElement): void {
    for (const evt of ['click', 'mousedown', 'pointerdown', 'keydown', 'keyup', 'keypress', 'submit'] as const) {
      host.addEventListener(evt, (e) => e.stopPropagation())
    }
  }

  private positionHost(x: number, y: number): void {
    if (!this.host) return
    // Use popover="manual" to render in the top layer (above native popovers)
    this.host.setAttribute('popover', 'manual')
    try { this.host.showPopover() } catch { /* fallback to z-index */ }
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
    setTimeout(() => document.addEventListener('mousedown', this.boundOutside), 0)
  }

  destroy(): void {
    this.host?.remove()
    this.host = null
    this.shadow = null
    document.removeEventListener('mousedown', this.boundOutside)
  }
}
