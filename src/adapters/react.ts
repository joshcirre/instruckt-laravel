import type { FrameworkContext } from '../types'

interface ReactFiber {
  type: unknown
  memoizedProps: Record<string, unknown> | null
  pendingProps: Record<string, unknown> | null
  return: ReactFiber | null
  key: string | null
}

interface ReactElement extends Element {
  [key: string]: unknown
}

function getFiberKey(el: Element): string | null {
  for (const key of Object.keys(el)) {
    if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
      return key
    }
  }
  return null
}

function getComponentName(fiber: ReactFiber): string {
  let node: ReactFiber | null = fiber
  while (node) {
    const { type } = node
    if (typeof type === 'function' && (type as { name?: string }).name) {
      const name = (type as { name: string }).name
      // Skip React internals (start with lowercase = intrinsic HTML element function)
      if (name[0] === name[0].toUpperCase() && name.length > 1) return name
    }
    if (typeof type === 'object' && type !== null && (type as { displayName?: string }).displayName) {
      return (type as { displayName: string }).displayName
    }
    node = node.return
  }
  return 'Component'
}

function getProps(fiber: ReactFiber): Record<string, unknown> {
  const props = fiber.memoizedProps ?? fiber.pendingProps ?? {}
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (k === 'children' || typeof v === 'function') continue
    try {
      result[k] = JSON.parse(JSON.stringify(v))
    } catch {
      result[k] = String(v)
    }
  }
  return result
}

export function isAvailable(): boolean {
  // React attaches fiber data to DOM nodes with __reactFiber$ prefix
  const root = document.getElementById('root') ?? document.getElementById('app') ?? document.body.firstElementChild
  if (!root) return false
  return getFiberKey(root) !== null
}

export function getContext(el: Element): FrameworkContext | null {
  let node: Element | null = el
  while (node && node !== document.documentElement) {
    const key = getFiberKey(node)
    if (key) {
      const fiber = (node as ReactElement)[key] as ReactFiber
      if (fiber) {
        const component = getComponentName(fiber)
        const data = getProps(fiber)
        return { framework: 'react', component, data }
      }
    }
    node = node.parentElement
  }
  return null
}
