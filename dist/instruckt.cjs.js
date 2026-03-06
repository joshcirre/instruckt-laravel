"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Instruckt: () => Instruckt,
  init: () => init
});
module.exports = __toCommonJS(src_exports);

// src/api.ts
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
function headers() {
  const h = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  const csrf = getCsrfToken();
  if (csrf) h["X-XSRF-TOKEN"] = csrf;
  return h;
}
function toCamelCase(obj) {
  return toCamel(obj);
}
function toCamel(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = Array.isArray(v) ? v.map((item) => item && typeof item === "object" && !Array.isArray(item) ? toCamel(item) : item) : v && typeof v === "object" && !Array.isArray(v) ? toCamel(v) : v;
  }
  return out;
}
function toSnake(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const snake = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    out[snake] = v && typeof v === "object" && !Array.isArray(v) ? toSnake(v) : v;
  }
  return out;
}
var InstrucktApi = class {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
  async createSession(url) {
    const res = await fetch(`${this.endpoint}/sessions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error(`instruckt: failed to create session (${res.status})`);
    return toCamel(await res.json());
  }
  async getSession(sessionId) {
    const res = await fetch(`${this.endpoint}/sessions/${sessionId}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`instruckt: failed to get session (${res.status})`);
    return toCamel(await res.json());
  }
  async addAnnotation(sessionId, data) {
    const res = await fetch(`${this.endpoint}/sessions/${sessionId}/annotations`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(toSnake(data))
    });
    if (!res.ok) throw new Error(`instruckt: failed to add annotation (${res.status})`);
    return toCamel(await res.json());
  }
  async updateAnnotation(annotationId, data) {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(toSnake(data))
    });
    if (!res.ok) throw new Error(`instruckt: failed to update annotation (${res.status})`);
    return toCamel(await res.json());
  }
  async addReply(annotationId, content, role = "human") {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}/reply`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ role, content })
    });
    if (!res.ok) throw new Error(`instruckt: failed to add reply (${res.status})`);
    return toCamel(await res.json());
  }
};

// src/sse.ts
var InstrucktSSE = class {
  constructor(endpoint, sessionId, onUpdate) {
    this.endpoint = endpoint;
    this.sessionId = sessionId;
    this.onUpdate = onUpdate;
    this.source = null;
  }
  connect() {
    if (this.source) return;
    this.source = new EventSource(`${this.endpoint}/sessions/${this.sessionId}/events`);
    this.source.addEventListener("annotation.updated", (e) => {
      try {
        const raw = JSON.parse(e.data);
        const annotation = toCamelCase(raw);
        this.onUpdate(annotation);
      } catch (e2) {
      }
    });
    this.source.onerror = () => {
    };
  }
  disconnect() {
    var _a;
    (_a = this.source) == null ? void 0 : _a.close();
    this.source = null;
  }
};

// src/ui/styles.ts
var GLOBAL_CSS = (
  /* css */
  `
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`
);
var TOOLBAR_CSS = (
  /* css */
  `
:host {
  all: initial;
  display: block;
  position: fixed;
  z-index: 2147483646;
}

* { box-sizing: border-box; }

:host-context([data-instruckt-theme="dark"]),
@media (prefers-color-scheme: dark) {
  :host {
    --ik-bg: #1c1c1e; --ik-bg2: #2c2c2e; --ik-border: #38383a;
    --ik-text: #f4f4f5; --ik-muted: #a1a1aa;
    --ik-shadow: 0 8px 32px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06);
  }
}

:host {
  --ik-accent: #6366f1;
  --ik-accent-h: #4f46e5;
  --ik-bg: #ffffff;
  --ik-bg2: #f4f4f5;
  --ik-border: #e4e4e7;
  --ik-text: #18181b;
  --ik-muted: #a1a1aa;
  --ik-shadow: 0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04);
}

.toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--ik-bg);
  border-radius: 12px;
  padding: 6px;
  box-shadow: var(--ik-shadow);
  user-select: none;
  touch-action: none;
  cursor: grab;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.toolbar:active { cursor: grabbing; }

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--ik-muted);
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: background .15s ease, color .15s ease;
}
.btn svg { display: block; }
.btn:hover { background: var(--ik-bg2); color: var(--ik-text); }
.btn.active { background: var(--ik-accent); color: #fff; }
.btn.active:hover { background: var(--ik-accent-h); }

.divider { width: 18px; height: 1px; background: var(--ik-border); margin: 3px 0; }

.badge {
  position: absolute;
  top: -3px; right: -3px;
  min-width: 16px; height: 16px;
  background: #ef4444;
  color: #fff;
  border-radius: 8px;
  font-size: 10px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
`
);
var POPUP_CSS = (
  /* css */
  `
:host {
  all: initial;
  display: block;
  position: fixed;
  z-index: 2147483647;
}

* { box-sizing: border-box; }

:host {
  --ik-accent: #6366f1;
  --ik-accent-h: #4f46e5;
  --ik-bg: #ffffff;
  --ik-bg2: #f8f8f8;
  --ik-border: #e4e4e7;
  --ik-text: #18181b;
  --ik-muted: #71717a;
  --ik-shadow: 0 4px 24px rgba(0,0,0,.12);
  --ik-radius: 10px;
  --ik-hl: rgba(99,102,241,.15);
}

@media (prefers-color-scheme: dark) {
  :host {
    --ik-bg: #1c1c1e; --ik-bg2: #2c2c2e; --ik-border: #3a3a3c;
    --ik-text: #f4f4f5; --ik-muted: #a1a1aa;
    --ik-shadow: 0 4px 24px rgba(0,0,0,.5);
    --ik-hl: rgba(99,102,241,.2);
  }
}

.popup {
  width: 340px;
  background: var(--ik-bg);
  border: 1px solid var(--ik-border);
  border-radius: var(--ik-radius);
  box-shadow: var(--ik-shadow);
  padding: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  color: var(--ik-text);
  animation: pop-in .12s ease;
}
@keyframes pop-in {
  from { opacity:0; transform: scale(.95) translateY(4px); }
  to   { opacity:1; transform: scale(1) translateY(0); }
}

.header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.element-tag {
  font-size:11px; font-family:ui-monospace,monospace; color:var(--ik-muted);
  background:var(--ik-bg2); border-radius:4px; padding:2px 6px;
  max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.close-btn {
  background:none; border:none; color:var(--ik-muted);
  cursor:pointer; font-size:18px; line-height:1; padding:0;
}

.fw-badge {
  display:inline-flex; align-items:center; gap:4px;
  font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
  color:var(--ik-accent); background:var(--ik-hl); border-radius:4px;
  padding:2px 6px; margin-bottom:8px;
}
.selected-text {
  font-size:12px; color:var(--ik-muted); background:var(--ik-bg2);
  border-left:3px solid var(--ik-accent); padding:4px 8px;
  border-radius:0 4px 4px 0; margin-bottom:10px;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}

.label {
  font-size:10px; font-weight:700; text-transform:uppercase;
  letter-spacing:.05em; color:var(--ik-muted); margin-bottom:4px;
}
.row { display:flex; gap:6px; margin-bottom:10px; }
.chips { display:flex; gap:4px; flex-wrap:wrap; }

.chip {
  font-size:11px; padding:3px 8px; border-radius:12px;
  border:1px solid var(--ik-border); background:transparent;
  color:var(--ik-muted); cursor:pointer; transition:all .1s;
}
.chip:hover { border-color:var(--ik-accent); color:var(--ik-accent); }
.chip.sel { background:var(--ik-accent); border-color:var(--ik-accent); color:#fff; }
.chip.blocking.sel  { background:#ef4444; border-color:#ef4444; }
.chip.important.sel { background:#f97316; border-color:#f97316; }
.chip.suggestion.sel{ background:#22c55e; border-color:#22c55e; }

textarea {
  width:100%; min-height:80px; resize:vertical;
  border:1px solid var(--ik-border); border-radius:6px;
  background:var(--ik-bg2); color:var(--ik-text);
  font-family:inherit; font-size:13px; padding:8px 10px;
  outline:none; transition:border-color .15s; margin-bottom:10px;
}
textarea:focus { border-color:var(--ik-accent); }
textarea::placeholder { color:var(--ik-muted); }

.actions { display:flex; justify-content:flex-end; gap:6px; }

.btn-secondary {
  padding:6px 14px; border-radius:6px; border:1px solid var(--ik-border);
  background:transparent; color:var(--ik-muted); font-size:12px; cursor:pointer; transition:all .1s;
}
.btn-secondary:hover { border-color:var(--ik-muted); color:var(--ik-text); }

.btn-primary {
  padding:6px 14px; border-radius:6px; border:none;
  background:var(--ik-accent); color:#fff;
  font-size:12px; font-weight:700; cursor:pointer; transition:background .1s;
}
.btn-primary:hover { background:var(--ik-accent-h); }
.btn-primary:disabled { opacity:.5; cursor:not-allowed; }

/* Thread view */
.thread { margin-top:10px; border-top:1px solid var(--ik-border); padding-top:10px; }
.msg { margin-bottom:8px; }
.msg-role {
  font-size:10px; font-weight:700; text-transform:uppercase;
  letter-spacing:.05em; margin-bottom:2px;
}
.msg-role.human { color:var(--ik-accent); }
.msg-role.agent { color:#22c55e; }
.msg-content { font-size:12px; line-height:1.5; }

.status-badge {
  display:inline-flex; align-items:center; gap:4px;
  font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
  border-radius:4px; padding:2px 6px;
}
.status-badge.pending      { background:rgba(99,102,241,.15); color:var(--ik-accent); }
.status-badge.acknowledged { background:rgba(249,115,22,.15); color:#f97316; }
.status-badge.resolved     { background:rgba(34,197,94,.15); color:#22c55e; }
.status-badge.dismissed    { background:var(--ik-bg2); color:var(--ik-muted); }
`
);
var MARKER_CSS = (
  /* css */
  `
.ik-marker {
  position: absolute;
  z-index: 2147483645;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99,102,241,.4);
  transition: transform .15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  pointer-events: all;
  user-select: none;
}
.ik-marker:hover { transform: scale(1.15); }
.ik-marker.resolved  { background: #22c55e; box-shadow: 0 2px 8px rgba(34,197,94,.4); }
.ik-marker.dismissed { background: #71717a; box-shadow: 0 2px 8px rgba(0,0,0,.2); }
.ik-marker.acknowledged { background: #f97316; box-shadow: 0 2px 8px rgba(249,115,22,.4); }
`
);
function injectGlobalStyles() {
  if (document.getElementById("instruckt-global")) return;
  const style = document.createElement("style");
  style.id = "instruckt-global";
  style.textContent = GLOBAL_CSS + MARKER_CSS;
  document.head.appendChild(style);
}

// src/ui/toolbar.ts
var ICONS = {
  annotate: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
  freeze: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
};
var Toolbar = class {
  constructor(position, callbacks) {
    this.position = position;
    this.callbacks = callbacks;
    this.mode = "idle";
    this.dragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.build();
    this.setupDrag();
  }
  build() {
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "toolbar");
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = TOOLBAR_CSS;
    this.shadow.appendChild(style);
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    this.annotateBtn = this.makeBtn(ICONS.annotate, "Annotate elements (A)", () => {
      const next = this.mode !== "annotating";
      this.setMode(next ? "annotating" : "idle");
      this.callbacks.onToggleAnnotate(next);
    });
    this.freezeBtn = this.makeBtn(ICONS.freeze, "Freeze animations (F)", () => {
      const next = this.mode !== "frozen";
      this.setMode(next ? "frozen" : "idle");
      this.callbacks.onFreezeAnimations(next);
    });
    this.copyBtn = this.makeBtn(ICONS.copy, "Copy annotations as markdown", () => {
      this.callbacks.onCopy();
      this.copyBtn.innerHTML = ICONS.check;
      setTimeout(() => {
        this.copyBtn.innerHTML = ICONS.copy;
      }, 1200);
    });
    const divider = document.createElement("div");
    divider.className = "divider";
    const divider2 = document.createElement("div");
    divider2.className = "divider";
    toolbar.append(this.annotateBtn, divider, this.freezeBtn, divider2, this.copyBtn);
    this.shadow.appendChild(toolbar);
    this.applyPosition();
    document.body.appendChild(this.host);
  }
  makeBtn(iconHtml, title, onClick) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.title = title;
    btn.setAttribute("aria-label", title);
    btn.innerHTML = iconHtml;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }
  applyPosition() {
    const m = "16px";
    Object.assign(this.host.style, {
      position: "fixed",
      zIndex: "2147483646",
      bottom: this.position.includes("bottom") ? m : "auto",
      top: this.position.includes("top") ? m : "auto",
      right: this.position.includes("right") ? m : "auto",
      left: this.position.includes("left") ? m : "auto"
    });
  }
  setupDrag() {
    this.shadow.addEventListener("mousedown", (e) => {
      if (e.target.closest(".btn")) return;
      this.dragging = true;
      const rect = this.host.getBoundingClientRect();
      this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!this.dragging) return;
      Object.assign(this.host.style, {
        left: `${e.clientX - this.dragOffset.x}px`,
        top: `${e.clientY - this.dragOffset.y}px`,
        right: "auto",
        bottom: "auto"
      });
    });
    document.addEventListener("mouseup", () => {
      this.dragging = false;
    });
  }
  setMode(mode) {
    this.mode = mode;
    this.annotateBtn.classList.toggle("active", mode === "annotating");
    this.freezeBtn.classList.toggle("active", mode === "frozen");
    document.body.classList.toggle("ik-annotating", mode === "annotating");
  }
  setAnnotationCount(count) {
    let badge = this.annotateBtn.querySelector(".badge");
    if (count > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "badge";
        this.annotateBtn.appendChild(badge);
      }
      badge.textContent = count > 99 ? "99+" : String(count);
    } else {
      badge == null ? void 0 : badge.remove();
    }
  }
  destroy() {
    this.host.remove();
    document.body.classList.remove("ik-annotating");
  }
};

// src/ui/highlight.ts
var ElementHighlight = class {
  constructor() {
    this.el = document.createElement("div");
    Object.assign(this.el.style, {
      position: "fixed",
      pointerEvents: "none",
      // MUST be none — prevents swallowing clicks
      zIndex: "2147483644",
      border: "2px solid rgba(99,102,241,0.7)",
      background: "rgba(99,102,241,0.1)",
      borderRadius: "3px",
      transition: "all 0.06s ease",
      display: "none"
    });
    this.el.setAttribute("data-instruckt", "highlight");
    document.body.appendChild(this.el);
  }
  show(el) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      this.hide();
      return;
    }
    Object.assign(this.el.style, {
      display: "block",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
  }
  hide() {
    this.el.style.display = "none";
  }
  destroy() {
    this.el.remove();
  }
};

// src/ui/popup.ts
function esc(s) {
  return String(s != null ? s : "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fwIcon(fw) {
  var _a;
  return (_a = { livewire: "\u26A1", vue: "\u{1F49A}", svelte: "\u{1F9E1}" }[fw]) != null ? _a : "\u{1F527}";
}
var AnnotationPopup = class {
  constructor() {
    this.host = null;
    this.shadow = null;
    this.intent = "fix";
    this.severity = "important";
    this.boundOutside = (e) => {
      if (this.host && !this.host.contains(e.target)) {
        this.destroy();
      }
    };
  }
  // ── New annotation popup ──────────────────────────────────────
  showNew(pending, callbacks) {
    this.destroy();
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "popup");
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = POPUP_CSS;
    this.shadow.appendChild(style);
    const popup = document.createElement("div");
    popup.className = "popup";
    const fwBadge = pending.framework ? `<div class="fw-badge">${fwIcon(pending.framework.framework)} ${esc(pending.framework.component)}</div>` : "";
    const selText = pending.selectedText ? `<div class="selected-text">"${esc(pending.selectedText.slice(0, 80))}"</div>` : "";
    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(pending.elementPath)}">${esc(pending.elementName)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
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
      <textarea placeholder="Describe what you'd like changed\u2026" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `;
    this.wireChips(popup, "intent", (v) => {
      this.intent = v;
    });
    this.wireChips(popup, "severity", (v) => {
      this.severity = v;
    });
    const textarea = popup.querySelector("textarea");
    const submitBtn = popup.querySelector('[data-action="submit"]');
    textarea.addEventListener("input", () => {
      submitBtn.disabled = textarea.value.trim().length === 0;
    });
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!submitBtn.disabled) submitBtn.click();
      }
      if (e.key === "Escape") {
        callbacks.onCancel();
        this.destroy();
      }
    });
    popup.querySelector('[data-action="cancel"]').addEventListener("click", () => {
      callbacks.onCancel();
      this.destroy();
    });
    popup.querySelector(".close-btn").addEventListener("click", () => {
      callbacks.onCancel();
      this.destroy();
    });
    submitBtn.addEventListener("click", () => {
      const comment = textarea.value.trim();
      if (!comment) return;
      callbacks.onSubmit({ comment, intent: this.intent, severity: this.severity });
      this.destroy();
    });
    this.shadow.appendChild(popup);
    document.body.appendChild(this.host);
    this.positionHost(pending.x, pending.y);
    this.setupOutsideClick();
    textarea.focus();
  }
  // ── Thread / existing annotation popup ───────────────────────
  showThread(annotation, callbacks) {
    var _a;
    this.destroy();
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "popup");
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = POPUP_CSS;
    this.shadow.appendChild(style);
    const popup = document.createElement("div");
    popup.className = "popup";
    const statusLabel = (s) => `<span class="status-badge ${esc(s)}">${esc(s)}</span>`;
    const thread = ((_a = annotation.thread) != null ? _a : []).map((m) => `
      <div class="msg">
        <div class="msg-role ${esc(m.role)}">${m.role === "agent" ? "\u{1F916} Agent" : "\u{1F464} You"}</div>
        <div class="msg-content">${esc(m.content)}</div>
      </div>
    `).join("");
    const isPending = ["pending", "acknowledged"].includes(annotation.status);
    popup.innerHTML = `
      <div class="header">
        <span class="element-tag">${esc(annotation.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${statusLabel(annotation.status)}
      <div class="selected-text" style="margin-top:8px;">${esc(annotation.comment)}</div>
      ${thread ? `<div class="thread">${thread}</div>` : ""}
      ${isPending ? `
        <div class="thread" style="margin-top:8px;">
          <textarea placeholder="Add a reply\u2026" rows="2"></textarea>
          <div class="actions" style="margin-top:6px;">
            <button class="btn-secondary" data-action="resolve">Mark resolved</button>
            <button class="btn-primary" data-action="reply" disabled>Reply</button>
          </div>
        </div>
      ` : ""}
    `;
    popup.querySelector(".close-btn").addEventListener("click", () => this.destroy());
    if (isPending) {
      const textarea = popup.querySelector("textarea");
      const replyBtn = popup.querySelector('[data-action="reply"]');
      textarea.addEventListener("input", () => {
        replyBtn.disabled = textarea.value.trim().length === 0;
      });
      replyBtn.addEventListener("click", () => {
        const content = textarea.value.trim();
        if (!content) return;
        callbacks.onReply(annotation, content);
        this.destroy();
      });
      popup.querySelector('[data-action="resolve"]').addEventListener("click", () => {
        callbacks.onResolve(annotation);
        this.destroy();
      });
    }
    this.shadow.appendChild(popup);
    document.body.appendChild(this.host);
    this.positionHost(window.innerWidth / 2 - 170, window.innerHeight / 2 - 150);
    this.setupOutsideClick();
  }
  // ── Helpers ───────────────────────────────────────────────────
  wireChips(container, group, onChange) {
    container.querySelectorAll(`[data-group="${group}"] .chip`).forEach((btn) => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(`[data-group="${group}"] .chip`).forEach((b) => b.classList.remove("sel"));
        btn.classList.add("sel");
        onChange(btn.dataset.value);
      });
    });
  }
  positionHost(x, y) {
    if (!this.host) return;
    Object.assign(this.host.style, { position: "fixed", zIndex: "2147483647", left: "-9999px", top: "0" });
    requestAnimationFrame(() => {
      var _a, _b;
      if (!this.host) return;
      const w = 340 + 20;
      const h = (_b = (_a = this.host.querySelector(".popup")) == null ? void 0 : _a.getBoundingClientRect().height) != null ? _b : 300;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const left = Math.max(10, Math.min(x + 10, vw - w));
      const top = Math.max(10, Math.min(y + 10, vh - h - 10));
      Object.assign(this.host.style, { left: `${left}px`, top: `${top}px` });
    });
  }
  setupOutsideClick() {
    setTimeout(() => document.addEventListener("mousedown", this.boundOutside), 0);
  }
  destroy() {
    var _a;
    (_a = this.host) == null ? void 0 : _a.remove();
    this.host = null;
    this.shadow = null;
    document.removeEventListener("mousedown", this.boundOutside);
  }
};

// src/ui/markers.ts
var AnnotationMarkers = class {
  constructor(onClick) {
    this.onClick = onClick;
    this.markers = /* @__PURE__ */ new Map();
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "2147483645"
    });
    this.container.setAttribute("data-instruckt", "markers");
    document.body.appendChild(this.container);
  }
  /** Add or update a marker for an annotation */
  upsert(annotation, index) {
    const existing = this.markers.get(annotation.id);
    if (existing) {
      this.updateStyle(existing.el, annotation);
      return;
    }
    const el = document.createElement("div");
    el.className = `ik-marker ${this.statusClass(annotation.status)}`;
    el.textContent = String(index);
    el.title = annotation.comment.slice(0, 60);
    el.style.pointerEvents = "all";
    el.style.left = `${annotation.x / 100 * window.innerWidth}px`;
    el.style.top = `${annotation.y - window.scrollY}px`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onClick(annotation);
    });
    this.container.appendChild(el);
    this.markers.set(annotation.id, { el, annotationId: annotation.id });
  }
  /** Update an existing marker after its annotation status changed */
  update(annotation) {
    const marker = this.markers.get(annotation.id);
    if (!marker) return;
    this.updateStyle(marker.el, annotation);
  }
  updateStyle(el, annotation) {
    el.className = `ik-marker ${this.statusClass(annotation.status)}`;
    el.title = annotation.comment.slice(0, 60);
  }
  statusClass(status) {
    if (status === "resolved") return "resolved";
    if (status === "dismissed") return "dismissed";
    if (status === "acknowledged") return "acknowledged";
    return "";
  }
  /** Reposition all markers (e.g. after scroll or resize) */
  reposition(annotations) {
    annotations.forEach((annotation) => {
      const marker = this.markers.get(annotation.id);
      if (!marker) return;
      marker.el.style.left = `${annotation.x / 100 * window.innerWidth}px`;
      marker.el.style.top = `${annotation.y - window.scrollY}px`;
    });
  }
  remove(annotationId) {
    const marker = this.markers.get(annotationId);
    if (!marker) return;
    marker.el.remove();
    this.markers.delete(annotationId);
  }
  destroy() {
    this.container.remove();
    this.markers.clear();
  }
};

// src/selector.ts
function getElementSelector(el) {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }
  const path = [];
  let current = el;
  while (current && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase();
    const parent = current.parentElement;
    if (!parent) {
      path.unshift(tag);
      break;
    }
    const classes = Array.from(current.classList).filter((c) => !c.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0, 3);
    if (classes.length > 0) {
      const classSelector = `${tag}.${classes.map(CSS.escape).join(".")}`;
      const matches = parent.querySelectorAll(classSelector);
      if (matches.length === 1) {
        path.unshift(classSelector);
        break;
      }
    }
    const siblings = Array.from(parent.children).filter((c) => c.tagName === current.tagName);
    if (siblings.length === 1) {
      path.unshift(tag);
    } else {
      const index = siblings.indexOf(current) + 1;
      path.unshift(`${tag}:nth-of-type(${index})`);
    }
    current = parent;
  }
  return path.join(" > ");
}
function getElementName(el) {
  const wireModel = el.getAttribute("wire:model") || el.getAttribute("wire:click");
  if (wireModel) return `wire:${wireModel.split(".")[0]}`;
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;
  const id = el.id;
  if (id) return `#${id}`;
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role");
  if (role) return `${tag}[${role}]`;
  const firstClass = el.classList[0];
  if (firstClass) return `${tag}.${firstClass}`;
  return tag;
}
function getNearbyText(el) {
  const text = (el.textContent || "").trim().replace(/\s+/g, " ");
  return text.slice(0, 120);
}
function getCssClasses(el) {
  return Array.from(el.classList).filter((c) => !c.match(/^(instruckt-)/)).join(" ");
}
function getPageBoundingBox(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height
  };
}

// src/adapters/livewire.ts
function isAvailable() {
  return typeof window.Livewire !== "undefined";
}
function detect(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const wireId = node.getAttribute("wire:id");
    if (wireId) return wireId;
    node = node.parentElement;
  }
  return null;
}
function getContext(el) {
  var _a, _b;
  if (!isAvailable()) return null;
  const wireId = detect(el);
  if (!wireId) return null;
  const component = window.Livewire.find(wireId);
  if (!component) return null;
  const snapshotData = (_b = (_a = component.snapshot) == null ? void 0 : _a.data) != null ? _b : {};
  const data = {};
  for (const key of Object.keys(snapshotData)) {
    try {
      data[key] = component.get(key);
    } catch (e) {
    }
  }
  return {
    framework: "livewire",
    component: component.name,
    wire_id: wireId,
    data
  };
}

// src/adapters/vue.ts
function detect2(el) {
  var _a;
  let node = el;
  while (node && node !== document.documentElement) {
    const instance = (_a = node.__vueParentComponent) != null ? _a : node.__vue__;
    if (instance) return instance;
    node = node.parentElement;
  }
  return null;
}
function getContext2(el) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const instance = detect2(el);
  if (!instance) return null;
  const name = (_h = (_g = (_e = (_c = (_a = instance.$options) == null ? void 0 : _a.name) != null ? _c : (_b = instance.$options) == null ? void 0 : _b.__name) != null ? _e : (_d = instance.type) == null ? void 0 : _d.name) != null ? _g : (_f = instance.type) == null ? void 0 : _f.__name) != null ? _h : "Anonymous";
  const data = {};
  if (instance.props) {
    Object.assign(data, instance.props);
  }
  if (instance.setupState) {
    for (const [key, value] of Object.entries(instance.setupState)) {
      if (!key.startsWith("_") && typeof value !== "function") {
        try {
          data[key] = JSON.parse(JSON.stringify(value));
        } catch (e) {
          data[key] = String(value);
        }
      }
    }
  }
  return {
    framework: "vue",
    component: name,
    component_uid: instance.uid !== void 0 ? String(instance.uid) : void 0,
    data
  };
}

// src/adapters/svelte.ts
function detect3(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    if (node.__svelte_meta) return node.__svelte_meta;
    node = node.parentElement;
  }
  return null;
}
function getContext3(el) {
  var _a, _b, _c, _d;
  const meta = detect3(el);
  if (!meta) return null;
  const filePath = (_b = (_a = meta.loc) == null ? void 0 : _a.file) != null ? _b : "";
  const component = filePath ? (_d = (_c = filePath.split("/").pop()) == null ? void 0 : _c.replace(/\.svelte$/, "")) != null ? _d : "Unknown" : "Unknown";
  return {
    framework: "svelte",
    component,
    data: filePath ? { file: filePath } : void 0
  };
}

// src/adapters/react.ts
function getFiberKey(el) {
  for (const key of Object.keys(el)) {
    if (key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")) {
      return key;
    }
  }
  return null;
}
function getComponentName(fiber) {
  let node = fiber;
  while (node) {
    const { type } = node;
    if (typeof type === "function" && type.name) {
      const name = type.name;
      if (name[0] === name[0].toUpperCase() && name.length > 1) return name;
    }
    if (typeof type === "object" && type !== null && type.displayName) {
      return type.displayName;
    }
    node = node.return;
  }
  return "Component";
}
function getProps(fiber) {
  var _a, _b;
  const props = (_b = (_a = fiber.memoizedProps) != null ? _a : fiber.pendingProps) != null ? _b : {};
  const result = {};
  for (const [k, v] of Object.entries(props)) {
    if (k === "children" || typeof v === "function") continue;
    try {
      result[k] = JSON.parse(JSON.stringify(v));
    } catch (e) {
      result[k] = String(v);
    }
  }
  return result;
}
function getContext4(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const key = getFiberKey(node);
    if (key) {
      const fiber = node[key];
      if (fiber) {
        const component = getComponentName(fiber);
        const data = getProps(fiber);
        return { framework: "react", component, data };
      }
    }
    node = node.parentElement;
  }
  return null;
}

// src/instruckt.ts
var SESSION_KEY = "instruckt_session";
var Instruckt = class {
  constructor(config) {
    this.sse = null;
    this.toolbar = null;
    this.highlight = null;
    this.popup = null;
    this.markers = null;
    this.annotations = [];
    this.session = null;
    this.isAnnotating = false;
    this.isFrozen = false;
    this.frozenStyleEl = null;
    this.rafId = null;
    this.pendingMouseTarget = null;
    this.mutationObserver = null;
    // ── Event listeners ───────────────────────────────────────────
    this.boundMouseMove = (e) => {
      this.pendingMouseTarget = e.target;
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => {
          var _a, _b;
          this.rafId = null;
          if (this.pendingMouseTarget && !this.isInstruckt(this.pendingMouseTarget)) {
            (_a = this.highlight) == null ? void 0 : _a.show(this.pendingMouseTarget);
          } else {
            (_b = this.highlight) == null ? void 0 : _b.hide();
          }
        });
      }
    };
    this.boundMouseLeave = () => {
      var _a;
      (_a = this.highlight) == null ? void 0 : _a.hide();
    };
    this.boundClick = (e) => {
      var _a, _b, _c;
      const target = e.target;
      if (this.isInstruckt(target)) return;
      e.preventDefault();
      e.stopPropagation();
      const selectedText = ((_a = window.getSelection()) == null ? void 0 : _a.toString().trim()) || void 0;
      const elementPath = getElementSelector(target);
      const elementName = getElementName(target);
      const cssClasses = getCssClasses(target);
      const nearbyText = getNearbyText(target) || void 0;
      const boundingBox = getPageBoundingBox(target);
      const framework = (_b = this.detectFramework(target)) != null ? _b : void 0;
      const pending = {
        element: target,
        elementPath,
        elementName,
        cssClasses,
        boundingBox,
        x: e.clientX,
        y: e.clientY,
        selectedText,
        nearbyText,
        framework
      };
      (_c = this.popup) == null ? void 0 : _c.showNew(pending, {
        onSubmit: (result) => this.submitAnnotation(pending, result),
        onCancel: () => {
        }
      });
    };
    this.config = __spreadValues({
      adapters: ["livewire", "vue", "svelte", "react"],
      theme: "auto",
      position: "bottom-right"
    }, config);
    this.api = new InstrucktApi(config.endpoint);
    this.boundKeydown = this.onKeydown.bind(this);
    this.boundScroll = this.onScrollResize.bind(this);
    this.boundResize = this.onScrollResize.bind(this);
    this.init();
  }
  async init() {
    injectGlobalStyles();
    if (this.config.theme !== "auto") {
      document.documentElement.setAttribute("data-instruckt-theme", this.config.theme);
    }
    this.toolbar = new Toolbar(this.config.position, {
      onToggleAnnotate: (active) => this.setAnnotating(active),
      onFreezeAnimations: (frozen) => this.setFrozen(frozen),
      onCopy: () => this.copyAnnotations()
    });
    this.highlight = new ElementHighlight();
    this.popup = new AnnotationPopup();
    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation));
    document.addEventListener("keydown", this.boundKeydown);
    window.addEventListener("scroll", this.boundScroll, { passive: true });
    window.addEventListener("resize", this.boundResize, { passive: true });
    this.setupMutationObserver();
    await this.connectSession();
  }
  // ── Session ───────────────────────────────────────────────────
  async connectSession() {
    var _a, _b, _c, _d;
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const data = await this.api.getSession(stored);
        this.session = data;
        this.annotations = (_a = data.annotations) != null ? _a : [];
        this.syncMarkersFromAnnotations();
        (_b = this.toolbar) == null ? void 0 : _b.setAnnotationCount(this.pendingCount());
        this.connectSSE(stored);
        return;
      } catch (e) {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    try {
      this.session = await this.api.createSession(window.location.href);
      sessionStorage.setItem(SESSION_KEY, this.session.id);
      (_d = (_c = this.config).onSessionCreate) == null ? void 0 : _d.call(_c, this.session);
      this.connectSSE(this.session.id);
    } catch (e) {
      console.warn("[instruckt] Could not connect to server \u2014 running offline.");
    }
  }
  connectSSE(sessionId) {
    this.sse = new InstrucktSSE(this.config.endpoint, sessionId, (annotation) => {
      this.onAnnotationUpdated(annotation);
    });
    this.sse.connect();
  }
  // ── Annotate mode ─────────────────────────────────────────────
  setAnnotating(active) {
    var _a;
    if (active && this.isFrozen) {
      this.setFrozen(false);
    }
    this.isAnnotating = active;
    if (active) {
      this.attachAnnotateListeners();
    } else {
      this.detachAnnotateListeners();
      (_a = this.highlight) == null ? void 0 : _a.hide();
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }
  setFrozen(frozen) {
    var _a, _b;
    if (frozen && this.isAnnotating) {
      this.setAnnotating(false);
      (_a = this.toolbar) == null ? void 0 : _a.setMode("idle");
    }
    this.isFrozen = frozen;
    if (frozen) {
      this.frozenStyleEl = document.createElement("style");
      this.frozenStyleEl.id = "instruckt-freeze";
      this.frozenStyleEl.textContent = `
        *, *::before, *::after { animation-play-state: paused !important; transition: none !important; }
        video { filter: none !important; }
      `;
      document.head.appendChild(this.frozenStyleEl);
    } else {
      (_b = this.frozenStyleEl) == null ? void 0 : _b.remove();
      this.frozenStyleEl = null;
    }
  }
  attachAnnotateListeners() {
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseleave", this.boundMouseLeave);
    document.addEventListener("click", this.boundClick, true);
  }
  detachAnnotateListeners() {
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseleave", this.boundMouseLeave);
    document.removeEventListener("click", this.boundClick, true);
  }
  isInstruckt(el) {
    return el.closest("[data-instruckt]") !== null;
  }
  // ── Framework detection ───────────────────────────────────────
  detectFramework(el) {
    var _a;
    const adapters = (_a = this.config.adapters) != null ? _a : [];
    if (adapters.includes("livewire")) {
      const ctx = getContext(el);
      if (ctx) return ctx;
    }
    if (adapters.includes("vue")) {
      const ctx = getContext2(el);
      if (ctx) return ctx;
    }
    if (adapters.includes("svelte")) {
      const ctx = getContext3(el);
      if (ctx) return ctx;
    }
    if (adapters.includes("react")) {
      const ctx = getContext4(el);
      if (ctx) return ctx;
    }
    return null;
  }
  // ── Submit ────────────────────────────────────────────────────
  async submitAnnotation(pending, result) {
    var _a, _b, _c, _d;
    if (!this.session) {
      await this.connectSession();
      if (!this.session) {
        console.warn("[instruckt] No session \u2014 annotation not saved.");
        return;
      }
    }
    const payload = {
      x: pending.x / window.innerWidth * 100,
      y: pending.y + window.scrollY,
      comment: result.comment,
      element: pending.elementName,
      elementPath: pending.elementPath,
      cssClasses: pending.cssClasses,
      boundingBox: pending.boundingBox,
      selectedText: pending.selectedText,
      nearbyText: pending.nearbyText,
      intent: result.intent,
      severity: result.severity,
      framework: pending.framework,
      url: window.location.href
    };
    try {
      const annotation = await this.api.addAnnotation(this.session.id, payload);
      this.annotations.push(annotation);
      (_a = this.markers) == null ? void 0 : _a.upsert(annotation, this.annotations.length);
      (_b = this.toolbar) == null ? void 0 : _b.setAnnotationCount(this.pendingCount());
      (_d = (_c = this.config).onAnnotationAdd) == null ? void 0 : _d.call(_c, annotation);
    } catch (err) {
      console.error("[instruckt] Failed to save annotation:", err);
    }
  }
  // ── Marker click — show thread ────────────────────────────────
  onMarkerClick(annotation) {
    var _a;
    (_a = this.popup) == null ? void 0 : _a.showThread(annotation, {
      onResolve: async (a) => {
        try {
          const updated = await this.api.updateAnnotation(a.id, { status: "resolved" });
          this.onAnnotationUpdated(updated);
        } catch (err) {
          console.error("[instruckt] Failed to resolve annotation:", err);
        }
      },
      onReply: async (a, content) => {
        try {
          const updated = await this.api.addReply(a.id, content, "human");
          this.onAnnotationUpdated(updated);
        } catch (err) {
          console.error("[instruckt] Failed to add reply:", err);
        }
      }
    });
  }
  // ── SSE updates ───────────────────────────────────────────────
  onAnnotationUpdated(updated) {
    var _a, _b, _c, _d, _e;
    const idx = this.annotations.findIndex((a) => a.id === updated.id);
    if (idx >= 0) {
      this.annotations[idx] = updated;
      (_a = this.markers) == null ? void 0 : _a.update(updated);
    } else {
      this.annotations.push(updated);
      (_b = this.markers) == null ? void 0 : _b.upsert(updated, this.annotations.length);
    }
    (_c = this.toolbar) == null ? void 0 : _c.setAnnotationCount(this.pendingCount());
    (_e = (_d = this.config).onAnnotationResolve) == null ? void 0 : _e.call(_d, updated);
  }
  // ── MutationObserver — handles Livewire/Vue DOM teardown ──────
  setupMutationObserver() {
    this.mutationObserver = new MutationObserver((mutations) => {
      var _a;
      const anyRemoved = mutations.some((m) => m.removedNodes.length > 0);
      if (!anyRemoved) return;
      (_a = this.markers) == null ? void 0 : _a.reposition(this.annotations);
    });
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  // ── Scroll/resize — reposition markers ───────────────────────
  onScrollResize() {
    var _a;
    (_a = this.markers) == null ? void 0 : _a.reposition(this.annotations);
  }
  // ── Keyboard ──────────────────────────────────────────────────
  onKeydown(e) {
    var _a, _b, _c;
    const target = e.target;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
    if (target.closest('[contenteditable="true"]')) return;
    if (e.key === "a" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const next = !this.isAnnotating;
      (_a = this.toolbar) == null ? void 0 : _a.setMode(next ? "annotating" : "idle");
      this.setAnnotating(next);
    }
    if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const next = !this.isFrozen;
      (_b = this.toolbar) == null ? void 0 : _b.setMode(next ? "frozen" : "idle");
      this.setFrozen(next);
    }
    if (e.key === "Escape") {
      if (this.isAnnotating) {
        (_c = this.toolbar) == null ? void 0 : _c.setMode("idle");
        this.setAnnotating(false);
      }
    }
  }
  // ── Helpers ───────────────────────────────────────────────────
  pendingCount() {
    return this.annotations.filter((a) => a.status === "pending" || a.status === "acknowledged").length;
  }
  syncMarkersFromAnnotations() {
    this.annotations.forEach((a, i) => {
      var _a;
      return (_a = this.markers) == null ? void 0 : _a.upsert(a, i + 1);
    });
  }
  // ── Copy / export ─────────────────────────────────────────────
  copyAnnotations() {
    const md = this.exportMarkdown();
    navigator.clipboard.writeText(md).catch(() => {
      const el = document.createElement("textarea");
      el.value = md;
      el.style.cssText = "position:fixed;left:-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    });
  }
  exportMarkdown() {
    const pending = this.annotations.filter((a) => a.status === "pending" || a.status === "acknowledged");
    if (pending.length === 0) {
      return `## Instruckt Feedback \u2014 ${window.location.href}

No open annotations.`;
    }
    const lines = [
      `## Instruckt Feedback \u2014 ${window.location.href}`,
      `> ${pending.length} open annotation${pending.length === 1 ? "" : "s"}`,
      ""
    ];
    pending.forEach((a, i) => {
      const severityIcon = a.severity === "blocking" ? "\u{1F534}" : a.severity === "important" ? "\u{1F7E0}" : "\u{1F7E1}";
      const intentLabel = a.intent === "fix" ? "Fix" : a.intent === "change" ? "Change" : a.intent === "question" ? "Question" : "Approve";
      lines.push(`### ${i + 1}. ${a.element} \u2014 ${intentLabel} ${severityIcon}`);
      lines.push("");
      lines.push(a.comment);
      lines.push("");
      lines.push(`**Selector**: \`${a.elementPath}\``);
      if (a.framework) {
        const fw = a.framework;
        const label = fw.framework === "livewire" ? `Livewire \u2014 ${fw.component}` : fw.framework === "vue" ? `Vue \u2014 ${fw.component}` : fw.framework === "react" ? `React \u2014 ${fw.component}` : fw.component;
        lines.push(`**Component**: ${label}`);
      }
      if (a.selectedText) lines.push(`**Selected text**: "${a.selectedText}"`);
      if (a.thread && a.thread.length > 0) {
        lines.push("");
        lines.push("**Thread:**");
        a.thread.forEach((m) => {
          lines.push(`- **${m.role === "agent" ? "Agent" : "You"}**: ${m.content}`);
        });
      }
      lines.push("");
      lines.push("---");
      lines.push("");
    });
    return lines.join("\n");
  }
  // ── Public API ────────────────────────────────────────────────
  getAnnotations() {
    return [...this.annotations];
  }
  getSession() {
    return this.session;
  }
  destroy() {
    var _a, _b, _c, _d, _e, _f;
    this.setAnnotating(false);
    this.setFrozen(false);
    document.removeEventListener("keydown", this.boundKeydown);
    window.removeEventListener("scroll", this.boundScroll);
    window.removeEventListener("resize", this.boundResize);
    (_a = this.mutationObserver) == null ? void 0 : _a.disconnect();
    (_b = this.sse) == null ? void 0 : _b.disconnect();
    (_c = this.toolbar) == null ? void 0 : _c.destroy();
    (_d = this.highlight) == null ? void 0 : _d.destroy();
    (_e = this.popup) == null ? void 0 : _e.destroy();
    (_f = this.markers) == null ? void 0 : _f.destroy();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
};

// src/index.ts
function init(config) {
  return new Instruckt(config);
}
//# sourceMappingURL=instruckt.cjs.js.map