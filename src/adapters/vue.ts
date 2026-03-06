import type { FrameworkContext } from '../types'

interface VueInstance {
  $options?: { name?: string; __name?: string }
  type?: { name?: string; __name?: string }
  uid?: number
  props?: Record<string, unknown>
  setupState?: Record<string, unknown>
}

interface VueElement extends Element {
  __vue__?: VueInstance
  __vueParentComponent?: VueInstance
  _vei?: unknown
}

export function isAvailable(): boolean {
  // Vue 3: mounts with data-v-app attribute; Vue 2: exposes global Vue constructor
  return !!(document.querySelector('[data-v-app]') || (window as unknown as Record<string, unknown>)['Vue'])
}

/** Walk up the DOM to find the nearest Vue component */
export function detect(el: Element): VueInstance | null {
  let node: VueElement | null = el as VueElement
  while (node && node !== document.documentElement) {
    const instance = node.__vueParentComponent ?? node.__vue__
    if (instance) return instance
    node = node.parentElement as VueElement | null
  }
  return null
}

/** Get Vue component context for an element */
export function getContext(el: Element): FrameworkContext | null {
  const instance = detect(el)
  if (!instance) return null

  // Support Vue 2 ($options.name) and Vue 3 (type.name or type.__name)
  const name =
    instance.$options?.name ??
    instance.$options?.__name ??
    instance.type?.name ??
    instance.type?.__name ??
    'Anonymous'

  const data: Record<string, unknown> = {}

  // Vue 3 props
  if (instance.props) {
    Object.assign(data, instance.props)
  }

  // Vue 3 setup state (public reactive refs)
  if (instance.setupState) {
    for (const [key, value] of Object.entries(instance.setupState)) {
      if (!key.startsWith('_') && typeof value !== 'function') {
        try {
          data[key] = JSON.parse(JSON.stringify(value))
        } catch {
          data[key] = String(value)
        }
      }
    }
  }

  return {
    framework: 'vue',
    component: name,
    component_uid: instance.uid !== undefined ? String(instance.uid) : undefined,
    data,
  }
}
