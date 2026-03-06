import type { Annotation, Session } from './types'

/** Read Laravel's XSRF-TOKEN cookie for CSRF protection */
function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  const csrf = getCsrfToken()
  if (csrf) h['X-XSRF-TOKEN'] = csrf
  return h
}

/** Convert snake_case API response to camelCase for JS types */
export function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  return toCamel(obj)
}

function toCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    out[camel] = Array.isArray(v)
      ? v.map(item => (item && typeof item === 'object' && !Array.isArray(item)) ? toCamel(item as Record<string, unknown>) : item)
      : (v && typeof v === 'object' && !Array.isArray(v)) ? toCamel(v as Record<string, unknown>) : v
  }
  return out
}

/** Convert camelCase JS payload to snake_case for Laravel API */
function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    const snake = k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
    out[snake] = (v && typeof v === 'object' && !Array.isArray(v)) ? toSnake(v as Record<string, unknown>) : v
  }
  return out
}

export type AnnotationPayload = Omit<
  Annotation,
  'id' | 'sessionId' | 'status' | 'thread' | 'createdAt' | '_syncedTo'
>

export class InstrucktApi {
  constructor(private readonly endpoint: string) {}

  async createSession(url: string): Promise<Session> {
    const res = await fetch(`${this.endpoint}/sessions`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ url }),
    })
    if (!res.ok) throw new Error(`instruckt: failed to create session (${res.status})`)
    return toCamel(await res.json()) as unknown as Session
  }

  async getSession(sessionId: string): Promise<Session & { annotations: Annotation[] }> {
    const res = await fetch(`${this.endpoint}/sessions/${sessionId}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`instruckt: failed to get session (${res.status})`)
    return toCamel(await res.json()) as unknown as Session & { annotations: Annotation[] }
  }

  async addAnnotation(sessionId: string, data: AnnotationPayload): Promise<Annotation> {
    const res = await fetch(`${this.endpoint}/sessions/${sessionId}/annotations`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(toSnake(data as unknown as Record<string, unknown>)),
    })
    if (!res.ok) throw new Error(`instruckt: failed to add annotation (${res.status})`)
    return toCamel(await res.json()) as unknown as Annotation
  }

  async updateAnnotation(
    annotationId: string,
    data: Partial<Pick<Annotation, 'status' | 'comment' | 'intent' | 'severity'>>,
  ): Promise<Annotation> {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(toSnake(data as unknown as Record<string, unknown>)),
    })
    if (!res.ok) throw new Error(`instruckt: failed to update annotation (${res.status})`)
    return toCamel(await res.json()) as unknown as Annotation
  }

  async addReply(annotationId: string, content: string, role: 'human' | 'agent' = 'human'): Promise<Annotation> {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}/reply`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ role, content }),
    })
    if (!res.ok) throw new Error(`instruckt: failed to add reply (${res.status})`)
    return toCamel(await res.json()) as unknown as Annotation
  }
}
