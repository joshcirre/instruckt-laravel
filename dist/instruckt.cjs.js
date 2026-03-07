"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = Array.isArray(v) ? v.map((item) => item && typeof item === "object" && !Array.isArray(item) ? toCamelCase(item) : item) : v && typeof v === "object" && !Array.isArray(v) ? toCamelCase(v) : v;
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
  async getAnnotations() {
    const res = await fetch(`${this.endpoint}/annotations`, {
      headers: headers()
    });
    if (!res.ok) throw new Error(`instruckt: failed to load annotations (${res.status})`);
    const raw = await res.json();
    return raw.map((r) => toCamelCase(r));
  }
  async addAnnotation(data) {
    const res = await fetch(`${this.endpoint}/annotations`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(toSnake(data))
    });
    if (!res.ok) throw new Error(`instruckt: failed to add annotation (${res.status})`);
    return toCamelCase(await res.json());
  }
  async updateAnnotation(annotationId, data) {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(toSnake(data))
    });
    if (!res.ok) throw new Error(`instruckt: failed to update annotation (${res.status})`);
    return toCamelCase(await res.json());
  }
  async addReply(annotationId, content, role = "human") {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}/reply`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ role, content })
    });
    if (!res.ok) throw new Error(`instruckt: failed to add reply (${res.status})`);
    return toCamelCase(await res.json());
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

.minimize-btn { color: var(--ik-muted); opacity: .6; }
.minimize-btn:hover { opacity: 1; }

.danger-btn { color: var(--ik-muted); opacity: .6; }
.danger-btn:hover { opacity: 1; color: #ef4444; }

.clear-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.clear-all-btn {
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  background: var(--ik-bg);
  box-shadow: var(--ik-shadow);
  border-radius: 8px;
}
/* Instant tooltip */
.clear-all-btn::before {
  content: attr(data-tooltip);
  position: absolute;
  right: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--ik-text);
  color: var(--ik-bg);
  pointer-events: none;
  opacity: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.clear-all-btn:hover::before { opacity: 1; }
/* Invisible bridge so hover doesn't break crossing the gap */
.clear-all-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 100%;
  width: 6px;
  height: 100%;
}
.clear-wrap:hover .clear-all-btn { display: flex; align-items: center; justify-content: center; }

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--ik-bg);
  color: var(--ik-muted);
  box-shadow: var(--ik-shadow);
  cursor: pointer;
  padding: 0;
  transition: color .15s ease, transform .15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.fab:hover { color: var(--ik-accent); transform: scale(1.1); }
.fab { position: relative; }

.fab-badge {
  position: absolute;
  top: -4px; right: -4px;
  min-width: 16px; height: 16px;
  background: #6366f1;
  color: #fff;
  border-radius: 8px;
  font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
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

.btn-danger {
  padding:6px 14px; border-radius:6px; border:1px solid #ef4444;
  background:transparent; color:#ef4444;
  font-size:12px; cursor:pointer; transition:all .1s;
}
.btn-danger:hover { background:#ef4444; color:#fff; }

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
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clear: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  minimize: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>`,
  logo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`
};
var Toolbar = class {
  constructor(position, callbacks) {
    this.position = position;
    this.callbacks = callbacks;
    this.fabBadge = null;
    this.annotateActive = false;
    this.freezeActive = false;
    this.minimized = false;
    this.totalCount = 0;
    this.dragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.build();
    this.setupDrag();
  }
  build() {
    var _a;
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "toolbar");
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = TOOLBAR_CSS;
    this.shadow.appendChild(style);
    this.toolbarEl = document.createElement("div");
    this.toolbarEl.className = "toolbar";
    this.annotateBtn = this.makeBtn(ICONS.annotate, "Annotate elements (A)", () => {
      const next = !this.annotateActive;
      this.setAnnotateActive(next);
      this.callbacks.onToggleAnnotate(next);
    });
    this.freezeBtn = this.makeBtn(ICONS.freeze, "Freeze page (F)", () => {
      const next = !this.freezeActive;
      this.setFreezeActive(next);
      this.callbacks.onFreezeAnimations(next);
    });
    this.copyBtn = this.makeBtn(ICONS.copy, "Copy annotations as markdown", () => {
      this.callbacks.onCopy();
      this.copyBtn.innerHTML = ICONS.check;
      setTimeout(() => {
        this.copyBtn.innerHTML = ICONS.copy;
      }, 1200);
    });
    const clearWrap = document.createElement("div");
    clearWrap.className = "clear-wrap";
    const clearBtn = this.makeBtn(ICONS.clear, "Clear this page (X)", () => {
      var _a2, _b;
      (_b = (_a2 = this.callbacks).onClearPage) == null ? void 0 : _b.call(_a2);
    });
    clearBtn.classList.add("danger-btn");
    const clearAllBtn = this.makeBtn(
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      "Delete all instructions.",
      () => {
        var _a2, _b;
        return (_b = (_a2 = this.callbacks).onClearAll) == null ? void 0 : _b.call(_a2);
      }
    );
    clearAllBtn.classList.add("danger-btn", "clear-all-btn");
    clearAllBtn.removeAttribute("title");
    clearAllBtn.setAttribute("data-tooltip", "Delete all instructions.");
    clearWrap.appendChild(clearBtn);
    clearWrap.appendChild(clearAllBtn);
    const minimizeBtn = this.makeBtn(ICONS.minimize, "Minimize toolbar", () => {
      this.setMinimized(true);
    });
    minimizeBtn.classList.add("minimize-btn");
    const mkDiv = () => {
      const d = document.createElement("div");
      d.className = "divider";
      return d;
    };
    this.toolbarEl.append(
      this.annotateBtn,
      mkDiv(),
      this.freezeBtn,
      mkDiv(),
      this.copyBtn,
      clearWrap,
      mkDiv(),
      minimizeBtn
    );
    this.shadow.appendChild(this.toolbarEl);
    this.fab = document.createElement("button");
    this.fab.className = "fab";
    this.fab.title = "Open instruckt toolbar";
    this.fab.setAttribute("aria-label", "Open instruckt toolbar");
    this.fab.innerHTML = ICONS.logo;
    this.fab.style.display = "none";
    this.fab.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setMinimized(false);
    });
    this.shadow.appendChild(this.fab);
    this.host.addEventListener("click", (e) => e.stopPropagation());
    this.host.addEventListener("mousedown", (e) => e.stopPropagation());
    this.host.addEventListener("pointerdown", (e) => e.stopPropagation());
    this.applyPosition();
    const root = (_a = document.getElementById("instruckt-root")) != null ? _a : document.body;
    root.appendChild(this.host);
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
    this.shadow.addEventListener("mousedown", (evt) => {
      const e = evt;
      if (e.target.closest(".btn") || e.target.closest(".fab")) return;
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
  setMinimized(min) {
    var _a, _b;
    this.minimized = min;
    this.toolbarEl.style.display = min ? "none" : "";
    this.fab.style.display = min ? "" : "none";
    this.updateFabBadge();
    (_b = (_a = this.callbacks).onMinimize) == null ? void 0 : _b.call(_a, min);
  }
  updateFabBadge() {
    var _a;
    if (this.totalCount > 0 && this.minimized) {
      if (!this.fabBadge) {
        this.fabBadge = document.createElement("span");
        this.fabBadge.className = "fab-badge";
        this.fab.appendChild(this.fabBadge);
      }
      this.fabBadge.textContent = this.totalCount > 99 ? "99+" : String(this.totalCount);
    } else {
      (_a = this.fabBadge) == null ? void 0 : _a.remove();
      this.fabBadge = null;
    }
  }
  isMinimized() {
    return this.minimized;
  }
  /** Programmatically minimize without firing callback */
  minimize() {
    this.minimized = true;
    this.toolbarEl.style.display = "none";
    this.fab.style.display = "";
    this.updateFabBadge();
  }
  setAnnotateActive(active) {
    this.annotateActive = active;
    this.annotateBtn.classList.toggle("active", active);
    document.body.classList.toggle("ik-annotating", active);
  }
  setFreezeActive(active) {
    this.freezeActive = active;
    this.freezeBtn.classList.toggle("active", active);
  }
  // Keep for compatibility — resolves visual mode from instruckt.ts
  setMode(mode) {
    this.setAnnotateActive(mode === "annotating");
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
  setTotalCount(count) {
    this.totalCount = count;
    this.updateFabBadge();
  }
  destroy() {
    this.host.remove();
    document.body.classList.remove("ik-annotating");
  }
};

// src/ui/highlight.ts
var ElementHighlight = class {
  constructor() {
    var _a;
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
    const root = (_a = document.getElementById("instruckt-root")) != null ? _a : document.body;
    root.appendChild(this.el);
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
var AnnotationPopup = class {
  constructor() {
    this.host = null;
    this.shadow = null;
    this.boundOutside = (e) => {
      if (this.host && !this.host.contains(e.target)) {
        this.destroy();
      }
    };
  }
  // ── New annotation popup ──────────────────────────────────────
  showNew(pending, callbacks) {
    var _a;
    this.destroy();
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "popup");
    this.stopHostPropagation(this.host);
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = POPUP_CSS;
    this.shadow.appendChild(style);
    const popup = document.createElement("div");
    popup.className = "popup";
    const fwBadge = pending.framework ? `<div class="fw-badge">${esc(pending.framework.component)}</div>` : "";
    const selText = pending.selectedText ? `<div class="selected-text">"${esc(pending.selectedText.slice(0, 80))}"</div>` : "";
    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(pending.elementPath)}">${esc(pending.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${fwBadge}${selText}
      <textarea placeholder="What needs to change here?" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `;
    const textarea = popup.querySelector("textarea");
    const submitBtn = popup.querySelector('[data-action="submit"]');
    textarea.addEventListener("input", () => {
      submitBtn.disabled = textarea.value.trim().length === 0;
    });
    textarea.addEventListener("keydown", (e) => {
      e.stopPropagation();
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
      callbacks.onSubmit({ comment });
      this.destroy();
    });
    this.shadow.appendChild(popup);
    ((_a = document.getElementById("instruckt-root")) != null ? _a : document.body).appendChild(this.host);
    this.positionHost(pending.x, pending.y);
    this.setupOutsideClick();
    textarea.focus();
  }
  // ── Edit existing annotation ──────────────────────────────────
  showEdit(annotation, callbacks) {
    var _a;
    this.destroy();
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "popup");
    this.stopHostPropagation(this.host);
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = POPUP_CSS;
    this.shadow.appendChild(style);
    const popup = document.createElement("div");
    popup.className = "popup";
    const fwBadge = annotation.framework ? `<div class="fw-badge">${esc(annotation.framework.component)}</div>` : "";
    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(annotation.elementPath)}">${esc(annotation.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${fwBadge}
      <textarea rows="3">${esc(annotation.comment)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `;
    popup.querySelector(".close-btn").addEventListener("click", () => this.destroy());
    const textarea = popup.querySelector("textarea");
    const saveBtn = popup.querySelector('[data-action="save"]');
    const deleteBtn = popup.querySelector('[data-action="delete"]');
    textarea.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        saveBtn.click();
      }
      if (e.key === "Escape") this.destroy();
    });
    saveBtn.addEventListener("click", () => {
      const newComment = textarea.value.trim();
      if (!newComment) return;
      callbacks.onSave(annotation, newComment);
      this.destroy();
    });
    deleteBtn.addEventListener("click", () => {
      callbacks.onDelete(annotation);
      this.destroy();
    });
    this.shadow.appendChild(popup);
    ((_a = document.getElementById("instruckt-root")) != null ? _a : document.body).appendChild(this.host);
    const markerX = annotation.x / 100 * window.innerWidth;
    const markerY = annotation.y - window.scrollY;
    this.positionHost(markerX, markerY);
    this.setupOutsideClick();
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }
  // ── Helpers ───────────────────────────────────────────────────
  /** Prevent popup interactions from reaching page handlers (e.g. @click.outside, form submit) */
  stopHostPropagation(host) {
    for (const evt of ["click", "mousedown", "pointerdown", "keydown", "keyup", "keypress", "submit"]) {
      host.addEventListener(evt, (e) => e.stopPropagation());
    }
  }
  positionHost(x, y) {
    if (!this.host) return;
    this.host.setAttribute("popover", "manual");
    try {
      this.host.showPopover();
    } catch (e) {
    }
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
    var _a;
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "2147483645"
    });
    this.container.setAttribute("data-instruckt", "markers");
    const root = (_a = document.getElementById("instruckt-root")) != null ? _a : document.body;
    root.appendChild(this.container);
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
  /** Show or hide all markers */
  setVisible(visible) {
    this.container.style.display = visible ? "" : "none";
  }
  /** Remove all markers without destroying the container */
  clear() {
    for (const { el } of this.markers.values()) {
      el.remove();
    }
    this.markers.clear();
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
  const tag = el.tagName.toLowerCase();
  const wireModel = el.getAttribute("wire:model") || el.getAttribute("wire:click");
  if (wireModel) return `${tag}[wire:${wireModel.split(".")[0]}]`;
  if (el.id) return `${tag}#${el.id}`;
  const firstClass = el.classList[0];
  if (firstClass) return `${tag}.${firstClass}`;
  return tag;
}
function getElementLabel(el) {
  const tag = el.tagName.toLowerCase();
  const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
  const attrs = [];
  if (el.id) attrs.push(`id="${el.id}"`);
  const role = el.getAttribute("role");
  if (role) attrs.push(`role="${role}"`);
  const wireAttr = el.getAttribute("wire:model") || el.getAttribute("wire:click");
  if (wireAttr) attrs.push(`wire:${el.hasAttribute("wire:model") ? "model" : "click"}="${wireAttr}"`);
  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  const openTag = `<${tag}${attrStr}>`;
  if (text) return `${openTag} ${text}`;
  return openTag;
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
    if (node.getAttribute("wire:id")) return node;
    node = node.parentElement;
  }
  return null;
}
function getContext(el) {
  var _a, _b;
  if (!isAvailable()) return null;
  const wireEl = detect(el);
  if (!wireEl) return null;
  const wireId = wireEl.getAttribute("wire:id");
  let componentName = "Unknown";
  const snapshotAttr = wireEl.getAttribute("wire:snapshot");
  if (snapshotAttr) {
    try {
      const snapshot = JSON.parse(snapshotAttr);
      componentName = (_b = (_a = snapshot == null ? void 0 : snapshot.memo) == null ? void 0 : _a.name) != null ? _b : "Unknown";
    } catch (e) {
    }
  }
  return {
    framework: "livewire",
    component: componentName,
    wire_id: wireId
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
function pageKey() {
  return window.location.pathname;
}
var _Instruckt = class _Instruckt {
  constructor(config) {
    this.toolbar = null;
    this.highlight = null;
    this.popup = null;
    this.markers = null;
    this.annotations = [];
    this.isAnnotating = false;
    this.isFrozen = false;
    this.frozenStyleEl = null;
    this.frozenPopovers = [];
    this.rafId = null;
    this.pendingMouseTarget = null;
    this.highlightLocked = false;
    this.pollTimer = null;
    this.boundReposition = () => {
      var _a;
      (_a = this.markers) == null ? void 0 : _a.reposition(this.annotations);
    };
    this.freezeBlockEvents = ["click", "mousedown", "pointerdown", "pointerup", "mouseup", "touchstart", "touchend", "auxclick"];
    this.freezePassiveEvents = ["focusin", "focusout", "blur", "pointerleave", "mouseleave", "mouseout"];
    /** Block interactions on the page when frozen (except instruckt UI) */
    this.boundFreezeClick = (e) => {
      if (this.isInstruckt(e.target)) return;
      if (this.isAnnotating && e.type === "click") return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    this.boundFreezeSubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    /** Block focus/hover events that JS dropdowns use to auto-close.
     *  Block ALL of these — even on instruckt elements — because frameworks
     *  like Flux check if focusin target is contained in the popover and
     *  close it if it's not (e.g. focus moved to our popup textarea). */
    this.boundFreezePassive = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    // ── Event listeners ───────────────────────────────────────────
    this.boundMouseMove = (e) => {
      if (this.highlightLocked) return;
      this.pendingMouseTarget = e.target;
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => {
          var _a, _b;
          this.rafId = null;
          if (this.highlightLocked) return;
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
      if (this.highlightLocked) return;
      (_a = this.highlight) == null ? void 0 : _a.hide();
    };
    this.boundClick = (e) => {
      var _a, _b, _c, _d;
      const target = e.target;
      if (this.isInstruckt(target)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const selectedText = ((_a = window.getSelection()) == null ? void 0 : _a.toString().trim()) || void 0;
      const elementPath = getElementSelector(target);
      const elementName = getElementName(target);
      const elementLabel = getElementLabel(target);
      const cssClasses = getCssClasses(target);
      const nearbyText = getNearbyText(target) || void 0;
      const boundingBox = getPageBoundingBox(target);
      const framework = (_b = this.detectFramework(target)) != null ? _b : void 0;
      const pending = {
        element: target,
        elementPath,
        elementName,
        elementLabel,
        cssClasses,
        boundingBox,
        x: e.clientX,
        y: e.clientY,
        selectedText,
        nearbyText,
        framework
      };
      (_c = this.highlight) == null ? void 0 : _c.show(target);
      this.highlightLocked = true;
      (_d = this.popup) == null ? void 0 : _d.showNew(pending, {
        onSubmit: (result) => {
          var _a2;
          this.highlightLocked = false;
          (_a2 = this.highlight) == null ? void 0 : _a2.hide();
          this.submitAnnotation(pending, result.comment);
        },
        onCancel: () => {
          var _a2;
          this.highlightLocked = false;
          (_a2 = this.highlight) == null ? void 0 : _a2.hide();
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
    this.init();
  }
  init() {
    injectGlobalStyles();
    if (this.config.theme !== "auto") {
      document.documentElement.setAttribute("data-instruckt-theme", this.config.theme);
    }
    this.toolbar = new Toolbar(this.config.position, {
      onToggleAnnotate: (active) => {
        this.setAnnotating(active);
      },
      onFreezeAnimations: (frozen) => {
        this.setFrozen(frozen);
      },
      onCopy: () => this.copyToClipboard(true),
      onClearPage: () => this.clearPage(),
      onClearAll: () => this.clearEverything(),
      onMinimize: (min) => this.onMinimize(min)
    });
    this.highlight = new ElementHighlight();
    this.popup = new AnnotationPopup();
    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation));
    document.addEventListener("keydown", this.boundKeydown);
    window.addEventListener("scroll", this.boundReposition, { passive: true });
    window.addEventListener("resize", this.boundReposition, { passive: true });
    document.addEventListener("livewire:navigated", () => this.reattach());
    document.addEventListener("inertia:navigate", () => this.syncMarkers());
    window.addEventListener("popstate", () => {
      setTimeout(() => this.reattach(), 0);
    });
    this.loadAnnotations();
    this.pollTimer = setInterval(() => this.pollForChanges(), 3e3);
    this.syncMarkers();
  }
  makeToolbarCallbacks() {
    return {
      onToggleAnnotate: (active) => {
        this.setAnnotating(active);
      },
      onFreezeAnimations: (frozen) => {
        this.setFrozen(frozen);
      },
      onCopy: () => this.copyToClipboard(true),
      onClearPage: () => this.clearPage(),
      onClearAll: () => this.clearEverything(),
      onMinimize: (min) => this.onMinimize(min)
    };
  }
  reattach() {
    var _a, _b;
    const wasAnnotating = this.isAnnotating;
    const wasFrozen = this.isFrozen;
    const wasMinimized = (_b = (_a = this.toolbar) == null ? void 0 : _a.isMinimized()) != null ? _b : false;
    if (this.isAnnotating) this.detachAnnotateListeners();
    if (this.isFrozen) this.setFrozen(false);
    this.isAnnotating = false;
    this.isFrozen = false;
    document.querySelectorAll("[data-instruckt]").forEach((el) => el.remove());
    this.toolbar = new Toolbar(this.config.position, this.makeToolbarCallbacks());
    if (wasMinimized) this.toolbar.minimize();
    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation));
    this.highlight = new ElementHighlight();
    if (wasMinimized) this.markers.setVisible(false);
    const existing = document.getElementById("instruckt-global");
    if (existing) existing.remove();
    injectGlobalStyles();
    this.syncMarkers();
    if (wasAnnotating && !wasMinimized) this.setAnnotating(true);
  }
  // ── Minimize ────────────────────────────────────────────────────
  onMinimize(minimized) {
    var _a, _b, _c, _d, _e;
    if (minimized) {
      if (this.isAnnotating) this.setAnnotating(false);
      if (this.isFrozen) this.setFrozen(false);
      (_a = this.toolbar) == null ? void 0 : _a.setAnnotateActive(false);
      (_b = this.toolbar) == null ? void 0 : _b.setFreezeActive(false);
      (_c = this.markers) == null ? void 0 : _c.setVisible(false);
      (_d = this.popup) == null ? void 0 : _d.destroy();
    } else {
      (_e = this.markers) == null ? void 0 : _e.setVisible(true);
    }
  }
  async loadAnnotations() {
    this.loadFromStorage();
    try {
      const remote = await this.api.getAnnotations();
      if (remote.length > 0) {
        const remoteIds = new Set(remote.map((a) => a.id));
        const localOnly = this.annotations.filter((a) => !remoteIds.has(a.id));
        this.annotations = [...remote, ...localOnly];
        this.saveToStorage();
      }
    } catch (e) {
    }
    this.syncMarkers();
  }
  saveToStorage() {
    try {
      localStorage.setItem(_Instruckt.STORAGE_KEY, JSON.stringify(this.annotations));
    } catch (e) {
    }
  }
  loadFromStorage() {
    try {
      const raw = localStorage.getItem(_Instruckt.STORAGE_KEY);
      if (raw) this.annotations = JSON.parse(raw);
    } catch (e) {
    }
  }
  /** Poll API for status changes (e.g. agent resolved via MCP) */
  async pollForChanges() {
    try {
      const remote = await this.api.getAnnotations();
      let changed = false;
      for (const r of remote) {
        const local = this.annotations.find((a) => a.id === r.id);
        if (local && local.status !== r.status) {
          local.status = r.status;
          local.resolvedAt = r.resolvedAt;
          local.resolvedBy = r.resolvedBy;
          changed = true;
        }
      }
      if (changed) {
        this.saveToStorage();
        this.syncMarkers();
      }
    } catch (e) {
    }
  }
  // ── Page-scoped markers ─────────────────────────────────────────
  syncMarkers() {
    var _a, _b, _c, _d;
    (_a = this.markers) == null ? void 0 : _a.clear();
    const current = pageKey();
    let idx = 0;
    for (const a of this.annotations) {
      if (a.status === "resolved" || a.status === "dismissed") continue;
      if (this.annotationPageKey(a) === current) {
        idx++;
        (_b = this.markers) == null ? void 0 : _b.upsert(a, idx);
      }
    }
    (_c = this.toolbar) == null ? void 0 : _c.setAnnotationCount(this.pageAnnotations().length);
    (_d = this.toolbar) == null ? void 0 : _d.setTotalCount(this.totalActiveCount());
  }
  annotationPageKey(a) {
    try {
      return new URL(a.url).pathname;
    } catch (e) {
      return a.url;
    }
  }
  pageAnnotations() {
    const current = pageKey();
    return this.annotations.filter(
      (a) => this.annotationPageKey(a) === current && a.status !== "resolved" && a.status !== "dismissed"
    );
  }
  totalActiveCount() {
    return this.annotations.filter((a) => a.status !== "resolved" && a.status !== "dismissed").length;
  }
  // ── Annotate mode ─────────────────────────────────────────────
  setAnnotating(active) {
    var _a, _b;
    this.isAnnotating = active;
    (_a = this.toolbar) == null ? void 0 : _a.setAnnotateActive(active);
    if (active) {
      this.attachAnnotateListeners();
    } else {
      this.detachAnnotateListeners();
      (_b = this.highlight) == null ? void 0 : _b.hide();
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
    this.updateFreezeStyles();
  }
  // ── Freeze mode ──────────────────────────────────────────────
  setFrozen(frozen) {
    var _a, _b;
    this.isFrozen = frozen;
    (_a = this.toolbar) == null ? void 0 : _a.setFreezeActive(frozen);
    if (frozen) {
      this.updateFreezeStyles();
      this.freezePopovers();
      for (const evt of this.freezeBlockEvents) {
        window.addEventListener(evt, this.boundFreezeClick, true);
      }
      window.addEventListener("submit", this.boundFreezeSubmit, true);
      for (const evt of this.freezePassiveEvents) {
        window.addEventListener(evt, this.boundFreezePassive, true);
      }
    } else {
      (_b = this.frozenStyleEl) == null ? void 0 : _b.remove();
      this.frozenStyleEl = null;
      this.unfreezePopovers();
      for (const evt of this.freezeBlockEvents) {
        window.removeEventListener(evt, this.boundFreezeClick, true);
      }
      window.removeEventListener("submit", this.boundFreezeSubmit, true);
      for (const evt of this.freezePassiveEvents) {
        window.removeEventListener(evt, this.boundFreezePassive, true);
      }
    }
  }
  /** Pull open popovers out of the top layer so the rest of the page is clickable */
  freezePopovers() {
    this.frozenPopovers = [];
    const openSelector = ":popover-open, .\\:popover-open";
    document.querySelectorAll("[popover]").forEach((el) => {
      var _a;
      const htmlEl = el;
      const val = (_a = htmlEl.getAttribute("popover")) != null ? _a : "";
      let isOpen = false;
      try {
        isOpen = htmlEl.matches(openSelector);
      } catch (e) {
        try {
          isOpen = htmlEl.matches(".\\:popover-open");
        } catch (e2) {
        }
      }
      if (!isOpen) return;
      const rect = htmlEl.getBoundingClientRect();
      this.frozenPopovers.push({ el: htmlEl, original: val });
      htmlEl.removeAttribute("popover");
      htmlEl.style.setProperty("display", "block", "important");
      htmlEl.style.setProperty("position", "fixed", "important");
      htmlEl.style.setProperty("z-index", "2147483644", "important");
      htmlEl.style.setProperty("top", `${rect.top}px`, "important");
      htmlEl.style.setProperty("left", `${rect.left}px`, "important");
      htmlEl.style.setProperty("width", `${rect.width}px`, "important");
      htmlEl.classList.add(":popover-open");
    });
  }
  /** Restore popover attributes */
  unfreezePopovers() {
    for (const { el, original } of this.frozenPopovers) {
      for (const prop of ["display", "position", "z-index", "top", "left", "width"]) {
        el.style.removeProperty(prop);
      }
      el.classList.remove(":popover-open");
      el.setAttribute("popover", original || "auto");
    }
    this.frozenPopovers = [];
  }
  /** Update freeze CSS — pointer-events only blocked when NOT annotating */
  updateFreezeStyles() {
    var _a;
    if (!this.isFrozen) return;
    (_a = this.frozenStyleEl) == null ? void 0 : _a.remove();
    this.frozenStyleEl = document.createElement("style");
    this.frozenStyleEl.id = "instruckt-freeze";
    const pointerBlock = this.isAnnotating ? "" : `
        a[href], a[wire\\:navigate], [wire\\:click], [wire\\:navigate],
        [x-on\\:click], [@click], [v-on\\:click], [onclick],
        button, input[type="submit"], select, [role="button"], [role="link"],
        [tabindex] {
          pointer-events: none !important;
          cursor: not-allowed !important;
        }
      `;
    this.frozenStyleEl.textContent = `
        *, *::before, *::after {
          animation-play-state: paused !important;
          transition: none !important;
        }
        video { filter: none !important; }
        ${pointerBlock}
      `;
    document.head.appendChild(this.frozenStyleEl);
  }
  attachAnnotateListeners() {
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseleave", this.boundMouseLeave);
    window.addEventListener("click", this.boundClick, true);
  }
  detachAnnotateListeners() {
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseleave", this.boundMouseLeave);
    window.removeEventListener("click", this.boundClick, true);
  }
  isInstruckt(el) {
    if (!el || !(el instanceof Element)) return false;
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
  async submitAnnotation(pending, comment) {
    var _a, _b;
    const payload = {
      x: pending.x / window.innerWidth * 100,
      y: pending.y + window.scrollY,
      comment,
      element: pending.elementName,
      elementPath: pending.elementPath,
      cssClasses: pending.cssClasses,
      boundingBox: pending.boundingBox,
      selectedText: pending.selectedText,
      nearbyText: pending.nearbyText,
      intent: "fix",
      severity: "important",
      framework: pending.framework,
      url: window.location.href
    };
    let annotation;
    try {
      annotation = await this.api.addAnnotation(payload);
    } catch (e) {
      annotation = __spreadProps(__spreadValues({}, payload), {
        id: crypto.randomUUID(),
        status: "pending",
        thread: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    this.annotations.push(annotation);
    this.saveToStorage();
    this.syncMarkers();
    (_b = (_a = this.config).onAnnotationAdd) == null ? void 0 : _b.call(_a, annotation);
    this.copyAnnotations();
  }
  // ── Marker click — edit or delete ─────────────────────────────
  onMarkerClick(annotation) {
    var _a;
    (_a = this.popup) == null ? void 0 : _a.showEdit(annotation, {
      onSave: async (a, newComment) => {
        try {
          const updated = await this.api.updateAnnotation(a.id, { comment: newComment });
          this.onAnnotationUpdated(updated);
        } catch (e) {
          this.onAnnotationUpdated(__spreadProps(__spreadValues({}, a), { comment: newComment, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }));
        }
      },
      onDelete: async (a) => {
        try {
          await this.api.updateAnnotation(a.id, { status: "dismissed" });
        } catch (e) {
        }
        this.removeAnnotation(a.id);
      }
    });
  }
  onAnnotationUpdated(updated) {
    const idx = this.annotations.findIndex((a) => a.id === updated.id);
    if (idx >= 0) {
      this.annotations[idx] = updated;
    }
    this.saveToStorage();
    this.syncMarkers();
  }
  removeAnnotation(id) {
    this.annotations = this.annotations.filter((a) => a.id !== id);
    this.saveToStorage();
    this.syncMarkers();
  }
  // ── Clear ───────────────────────────────────────────────────────
  async clearPage() {
    const page = this.pageAnnotations();
    for (const a of page) {
      try {
        await this.api.updateAnnotation(a.id, { status: "dismissed" });
      } catch (e) {
      }
    }
    this.annotations = this.annotations.filter((a) => !page.includes(a));
    this.saveToStorage();
    this.syncMarkers();
  }
  async clearEverything() {
    const active = this.annotations.filter((a) => a.status !== "resolved" && a.status !== "dismissed");
    for (const a of active) {
      try {
        await this.api.updateAnnotation(a.id, { status: "dismissed" });
      } catch (e) {
      }
    }
    this.annotations = [];
    this.saveToStorage();
    this.syncMarkers();
  }
  // ── Keyboard ──────────────────────────────────────────────────
  onKeydown(e) {
    var _a;
    if ((_a = this.toolbar) == null ? void 0 : _a.isMinimized()) return;
    const target = e.target;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
    if (target.closest('[contenteditable="true"]')) return;
    if (this.isInstruckt(target)) return;
    if (e.key === "a" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      this.setAnnotating(!this.isAnnotating);
    }
    if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      this.setFrozen(!this.isFrozen);
    }
    if (e.key === "x" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      this.clearPage();
    }
    if (e.key === "Escape") {
      if (this.isAnnotating) this.setAnnotating(false);
      if (this.isFrozen) this.setFrozen(false);
    }
  }
  // ── Copy / export ─────────────────────────────────────────────
  /** Auto-copy on annotation submit — only in secure contexts to avoid focus side-effects */
  copyAnnotations() {
    this.copyToClipboard(false);
  }
  /** Copy to clipboard. With fallback=true, uses execCommand for non-secure contexts (user-initiated only). */
  copyToClipboard(fallback) {
    const md = this.exportMarkdown();
    if (window.isSecureContext) {
      navigator.clipboard.writeText(md).catch(() => {
      });
    } else if (fallback) {
      try {
        const el = document.createElement("textarea");
        el.value = md;
        el.style.cssText = "position:fixed;left:-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        el.remove();
      } catch (e) {
      }
    }
  }
  exportMarkdown() {
    const pending = this.annotations.filter((a) => a.status !== "resolved" && a.status !== "dismissed");
    if (pending.length === 0) {
      return `# UI Feedback

No open annotations.`;
    }
    const byPage = /* @__PURE__ */ new Map();
    for (const a of pending) {
      const key = this.annotationPageKey(a);
      if (!byPage.has(key)) byPage.set(key, []);
      byPage.get(key).push(a);
    }
    const multiPage = byPage.size > 1;
    const lines = [];
    if (multiPage) {
      lines.push(`# UI Feedback`);
      lines.push("");
    }
    for (const [path, annotations] of byPage) {
      if (multiPage) {
        lines.push(`## ${path}`);
      } else {
        lines.push(`# UI Feedback: ${path}`);
      }
      lines.push("");
      const hPrefix = multiPage ? "###" : "##";
      annotations.forEach((a, i) => {
        var _a, _b, _c;
        const componentSuffix = ((_a = a.framework) == null ? void 0 : _a.component) ? ` in \`${a.framework.component}\`` : "";
        lines.push(`${hPrefix} ${i + 1}. ${a.comment}`);
        lines.push(`- Element: \`${a.element}\`${componentSuffix}`);
        if ((_c = (_b = a.framework) == null ? void 0 : _b.data) == null ? void 0 : _c.file) {
          lines.push(`- File: \`${a.framework.data.file}\``);
        }
        if (a.cssClasses) {
          lines.push(`- Classes: \`${a.cssClasses}\``);
        }
        if (a.selectedText) {
          lines.push(`- Text: "${a.selectedText}"`);
        } else if (a.nearbyText) {
          lines.push(`- Text: "${a.nearbyText.slice(0, 100)}"`);
        }
        lines.push("");
      });
    }
    return lines.join("\n").trim();
  }
  // ── Public API ────────────────────────────────────────────────
  getAnnotations() {
    return [...this.annotations];
  }
  destroy() {
    var _a, _b, _c, _d;
    this.setAnnotating(false);
    this.setFrozen(false);
    document.removeEventListener("keydown", this.boundKeydown);
    window.removeEventListener("scroll", this.boundReposition);
    window.removeEventListener("resize", this.boundReposition);
    (_a = this.toolbar) == null ? void 0 : _a.destroy();
    (_b = this.highlight) == null ? void 0 : _b.destroy();
    (_c = this.popup) == null ? void 0 : _c.destroy();
    (_d = this.markers) == null ? void 0 : _d.destroy();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.pollTimer !== null) clearInterval(this.pollTimer);
  }
};
// ── Persistence ─────────────────────────────────────────────────
_Instruckt.STORAGE_KEY = "instruckt:annotations";
var Instruckt = _Instruckt;

// src/index.ts
function init(config) {
  return new Instruckt(config);
}
//# sourceMappingURL=instruckt.cjs.js.map