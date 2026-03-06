/**
 * CSS selector and element path generation.
 * Produces unique, grep-able selectors for any DOM element.
 */

/** Build a unique CSS selector for an element */
export function getElementSelector(el: Element): string {
  if (el.id) {
    return `#${CSS.escape(el.id)}`
  }

  const path: string[] = []
  let current: Element | null = el

  while (current && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase()
    const parent: Element | null = current.parentElement

    if (!parent) {
      path.unshift(tag)
      break
    }

    // Try unique class combo
    const classes = Array.from(current.classList)
      .filter(c => !c.match(/^(hover|focus|active|visited|is-|has-)/)) // skip state classes
      .slice(0, 3)

    if (classes.length > 0) {
      const classSelector = `${tag}.${classes.map(CSS.escape).join('.')}`
      const matches = parent.querySelectorAll(classSelector)
      if (matches.length === 1) {
        path.unshift(classSelector)
        break
      }
    }

    // Fall back to nth-child
    const siblings = Array.from(parent.children).filter((c: Element) => c.tagName === current!.tagName)
    if (siblings.length === 1) {
      path.unshift(tag)
    } else {
      const index = siblings.indexOf(current) + 1
      path.unshift(`${tag}:nth-of-type(${index})`)
    }

    current = parent
  }

  return path.join(' > ')
}

/** Short element identifier for markdown output (grep-friendly) */
export function getElementName(el: Element): string {
  const tag = el.tagName.toLowerCase()

  const wireModel = el.getAttribute('wire:model') || el.getAttribute('wire:click')
  if (wireModel) return `${tag}[wire:${wireModel.split('.')[0]}]`

  if (el.id) return `${tag}#${el.id}`

  const firstClass = el.classList[0]
  if (firstClass) return `${tag}.${firstClass}`

  return tag
}

/** Human-readable HTML-like label for the popup UI */
export function getElementLabel(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)

  // Build a short opening tag with key attributes
  const attrs: string[] = []
  if (el.id) attrs.push(`id="${el.id}"`)
  const role = el.getAttribute('role')
  if (role) attrs.push(`role="${role}"`)
  const wireAttr = el.getAttribute('wire:model') || el.getAttribute('wire:click')
  if (wireAttr) attrs.push(`wire:${el.hasAttribute('wire:model') ? 'model' : 'click'}="${wireAttr}"`)

  const attrStr = attrs.length ? ' ' + attrs.join(' ') : ''
  const openTag = `<${tag}${attrStr}>`

  if (text) return `${openTag} ${text}`
  return openTag
}

/** Get nearby readable text for context */
export function getNearbyText(el: Element): string {
  const text = (el.textContent || '').trim().replace(/\s+/g, ' ')
  return text.slice(0, 120)
}

/** CSS classes as a space-separated string, filtering noise */
export function getCssClasses(el: Element): string {
  return Array.from(el.classList)
    .filter(c => !c.match(/^(instruckt-)/)) // exclude our own classes
    .join(' ')
}

/** Get bounding box relative to the page */
export function getPageBoundingBox(el: Element): { x: number; y: number; width: number; height: number } {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  }
}
