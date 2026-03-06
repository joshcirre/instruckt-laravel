export type AnnotationIntent = 'fix' | 'change' | 'question' | 'approve'
export type AnnotationSeverity = 'blocking' | 'important' | 'suggestion'
export type AnnotationStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed'
export type SessionStatus = 'active' | 'approved' | 'closed'

export interface ThreadMessage {
  id: string
  role: 'human' | 'agent'
  content: string
  timestamp: string
}

export interface FrameworkContext {
  framework: 'livewire' | 'vue' | 'svelte' | 'react'
  component: string
  data?: Record<string, unknown>
  // Livewire-specific
  wire_id?: string
  // Vue-specific
  component_uid?: string
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface Annotation {
  id: string
  sessionId: string
  url: string
  // Position as % of viewport width (x) and px from top (y)
  x: number
  y: number
  comment: string
  element: string
  elementPath: string
  cssClasses: string
  boundingBox: BoundingBox
  selectedText?: string
  nearbyText?: string
  isMultiSelect?: boolean
  elementBoundingBoxes?: BoundingBox[]
  intent: AnnotationIntent
  severity: AnnotationSeverity
  status: AnnotationStatus
  thread: ThreadMessage[]
  framework?: FrameworkContext
  createdAt: string
  updatedAt?: string
  resolvedAt?: string
  resolvedBy?: 'human' | 'agent'
  // Local tracking — not sent to server
  _syncedTo?: string
}

export interface Session {
  id: string
  url: string
  status: SessionStatus
  createdAt: string
  updatedAt?: string
}

export interface InstrucktConfig {
  /** URL to POST annotations to. Default: '/instruckt' */
  endpoint: string
  /** Framework adapters to activate. Default: auto-detect */
  adapters?: Array<'livewire' | 'vue' | 'svelte' | 'react'>
  /** Theme preference. Default: 'auto' */
  theme?: 'light' | 'dark' | 'auto'
  /** Position of the toolbar. Default: 'bottom-right' */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Callbacks */
  onAnnotationAdd?: (annotation: Annotation) => void
  onAnnotationResolve?: (annotation: Annotation) => void
  onSessionCreate?: (session: Session) => void
}

export interface PendingAnnotation {
  element: Element
  elementPath: string
  elementName: string
  cssClasses: string
  boundingBox: BoundingBox
  x: number
  y: number
  selectedText?: string
  nearbyText?: string
  framework?: FrameworkContext
}
