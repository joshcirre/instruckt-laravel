type AnnotationIntent = 'fix' | 'change' | 'question' | 'approve';
type AnnotationSeverity = 'blocking' | 'important' | 'suggestion';
type AnnotationStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed';
type SessionStatus = 'active' | 'approved' | 'closed';
interface ThreadMessage {
    id: string;
    role: 'human' | 'agent';
    content: string;
    timestamp: string;
}
interface FrameworkContext {
    framework: 'livewire' | 'vue' | 'svelte' | 'react';
    component: string;
    data?: Record<string, unknown>;
    wire_id?: string;
    component_uid?: string;
}
interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface Annotation {
    id: string;
    sessionId: string;
    url: string;
    x: number;
    y: number;
    comment: string;
    element: string;
    elementPath: string;
    cssClasses: string;
    boundingBox: BoundingBox;
    selectedText?: string;
    nearbyText?: string;
    isMultiSelect?: boolean;
    elementBoundingBoxes?: BoundingBox[];
    intent: AnnotationIntent;
    severity: AnnotationSeverity;
    status: AnnotationStatus;
    thread: ThreadMessage[];
    framework?: FrameworkContext;
    createdAt: string;
    updatedAt?: string;
    resolvedAt?: string;
    resolvedBy?: 'human' | 'agent';
    _syncedTo?: string;
}
interface Session {
    id: string;
    url: string;
    status: SessionStatus;
    createdAt: string;
    updatedAt?: string;
}
interface InstrucktConfig {
    /** URL to POST annotations to. Default: '/instruckt' */
    endpoint: string;
    /** Framework adapters to activate. Default: auto-detect */
    adapters?: Array<'livewire' | 'vue' | 'svelte' | 'react'>;
    /** Theme preference. Default: 'auto' */
    theme?: 'light' | 'dark' | 'auto';
    /** Position of the toolbar. Default: 'bottom-right' */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** Callbacks */
    onAnnotationAdd?: (annotation: Annotation) => void;
    onAnnotationResolve?: (annotation: Annotation) => void;
    onSessionCreate?: (session: Session) => void;
}

type AnnotationPayload = Omit<Annotation, 'id' | 'sessionId' | 'status' | 'thread' | 'createdAt' | '_syncedTo'>;

declare class Instruckt {
    private config;
    private api;
    private sse;
    private toolbar;
    private highlight;
    private popup;
    private markers;
    private annotations;
    private session;
    private isAnnotating;
    private isFrozen;
    private frozenStyleEl;
    private rafId;
    private pendingMouseTarget;
    private mutationObserver;
    private boundKeydown;
    private boundScroll;
    private boundResize;
    constructor(config: InstrucktConfig);
    private init;
    private connectSession;
    private connectSSE;
    private setAnnotating;
    private setFrozen;
    private boundMouseMove;
    private boundMouseLeave;
    private boundClick;
    private attachAnnotateListeners;
    private detachAnnotateListeners;
    private isInstruckt;
    private detectFramework;
    private submitAnnotation;
    private onMarkerClick;
    private onAnnotationUpdated;
    private setupMutationObserver;
    private onScrollResize;
    private onKeydown;
    private pendingCount;
    private syncMarkersFromAnnotations;
    private copyAnnotations;
    exportMarkdown(): string;
    getAnnotations(): Annotation[];
    getSession(): Session | null;
    destroy(): void;
}

/**
 * Initialize instruckt.
 *
 * @example
 * instruckt.init({ endpoint: '/instruckt' })
 *
 * @example CDN
 * <script src="instruckt.iife.js"></script>
 * <script>Instruckt.init({ endpoint: '/instruckt' })</script>
 */
declare function init(config: InstrucktConfig): Instruckt;

export { type Annotation, type AnnotationIntent, type AnnotationPayload, type AnnotationSeverity, type AnnotationStatus, type FrameworkContext, Instruckt, type InstrucktConfig, type Session, init };
