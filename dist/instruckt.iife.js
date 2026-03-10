/* instruckt v0.4.25 | MIT */
"use strict";var Instruckt=(()=>{var V=Object.defineProperty,dt=Object.defineProperties,ut=Object.getOwnPropertyDescriptor,ht=Object.getOwnPropertyDescriptors,pt=Object.getOwnPropertyNames,q=Object.getOwnPropertySymbols;var Q=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable;var ke=(t,e,n)=>e in t?V(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,E=(t,e)=>{for(var n in e||(e={}))Q.call(e,n)&&ke(t,n,e[n]);if(q)for(var n of q(e))xe.call(e,n)&&ke(t,n,e[n]);return t},L=(t,e)=>dt(t,ht(e));var Ee=(t,e)=>{var n={};for(var o in t)Q.call(t,o)&&e.indexOf(o)<0&&(n[o]=t[o]);if(t!=null&&q)for(var o of q(t))e.indexOf(o)<0&&xe.call(t,o)&&(n[o]=t[o]);return n};var mt=(t,e)=>{for(var n in e)V(t,n,{get:e[n],enumerable:!0})},ft=(t,e,n,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of pt(e))!Q.call(t,r)&&r!==n&&V(t,r,{get:()=>e[r],enumerable:!(o=ut(e,r))||o.enumerable});return t};var gt=t=>ft(V({},"__esModule",{value:!0}),t);var oo={};mt(oo,{Instruckt:()=>H,init:()=>no});function bt(){let t=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return t?decodeURIComponent(t[1]):""}function ee(){let t={"Content-Type":"application/json",Accept:"application/json","X-Requested-With":"XMLHttpRequest"},e=bt();return e&&(t["X-XSRF-TOKEN"]=e),t}function R(t){let e={};for(let[n,o]of Object.entries(t)){let r=n.replace(/_([a-z])/g,(i,s)=>s.toUpperCase());e[r]=Array.isArray(o)?o.map(i=>i&&typeof i=="object"&&!Array.isArray(i)?R(i):i):o&&typeof o=="object"&&!Array.isArray(o)?R(o):o}return e}function te(t){let e={};for(let[n,o]of Object.entries(t)){let r=n.replace(/[A-Z]/g,i=>`_${i.toLowerCase()}`);e[r]=o&&typeof o=="object"&&!Array.isArray(o)?te(o):o}return e}var W=class{constructor(e){this.endpoint=e}async getAnnotations(){let e=await fetch(`${this.endpoint}/annotations`,{headers:ee()});if(!e.ok)throw new Error(`instruckt: failed to load annotations (${e.status})`);return(await e.json()).map(o=>R(o))}async addAnnotation(e){let n=await fetch(`${this.endpoint}/annotations`,{method:"POST",headers:ee(),body:JSON.stringify(te(e))});if(!n.ok)throw new Error(`instruckt: failed to add annotation (${n.status})`);return R(await n.json())}async updateAnnotation(e,n){let o=await fetch(`${this.endpoint}/annotations/${e}`,{method:"PATCH",headers:ee(),body:JSON.stringify(te(n))});if(!o.ok)throw new Error(`instruckt: failed to update annotation (${o.status})`);return R(await o.json())}};var vt=`
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`,Se=`
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
.btn[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  right: calc(100% + 8px);
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
  transition: opacity .1s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.btn[data-tooltip]:hover::before { opacity: 1; }
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
/* clear-all tooltip inherits from .btn[data-tooltip]::before */
/* Invisible bridge so hover doesn't break crossing the gap */
.clear-all-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 100%;
  width: 6px;
  height: 100%;
}
/* Clear-page tooltip shows above-left so it doesn't cover the clear-all button */
.clear-wrap > .btn:first-child[data-tooltip]::before {
  right: 0;
  left: auto;
  top: auto;
  bottom: calc(100% + 8px);
  transform: none;
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
`,ne=`
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

.screenshot-slot { margin-bottom: 10px; }

.btn-capture {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 10px;
  border: 1px dashed var(--ik-border);
  border-radius: 6px;
  background: var(--ik-bg2);
  color: var(--ik-muted);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color .15s, color .15s;
}
.btn-capture:hover {
  border-color: var(--ik-accent);
  color: var(--ik-accent);
}
.btn-capture svg { flex-shrink: 0; }

.screenshot-preview {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--ik-border);
  margin-bottom: 10px;
}
.screenshot-preview img {
  display: block;
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  background: var(--ik-bg2);
}
.screenshot-remove {
  position: absolute;
  top: 4px; right: 4px;
  width: 20px; height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,.6);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.screenshot-remove:hover { background: #ef4444; }

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
.status-badge.resolved     { background:rgba(34,197,94,.15); color:#22c55e; }
.status-badge.dismissed    { background:var(--ik-bg2); color:var(--ik-muted); }
`,wt=`
.ik-marker {
  position: absolute;
  z-index: 2147483645;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--ik-marker-default, #6366f1);
  color: #fff;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--ik-marker-default, #6366f1) 40%, transparent);
  transition: transform .15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  pointer-events: all;
  user-select: none;
}
.ik-marker:hover { transform: scale(1.15); }
.ik-marker.has-screenshot { background: var(--ik-marker-screenshot, #22c55e); box-shadow: 0 2px 8px color-mix(in srgb, var(--ik-marker-screenshot, #22c55e) 40%, transparent); }
.ik-marker.dismissed { background: var(--ik-marker-dismissed, #71717a); box-shadow: 0 2px 8px rgba(0,0,0,.2); }
`;function oe(t){if(document.getElementById("instruckt-global"))return;let e=t?`:root {${t.default?` --ik-marker-default: ${t.default};`:""}${t.screenshot?` --ik-marker-screenshot: ${t.screenshot};`:""}${t.dismissed?` --ik-marker-dismissed: ${t.dismissed};`:""} }
`:"",n=document.createElement("style");n.id="instruckt-global",n.textContent=e+vt+wt,document.head.appendChild(n)}var C={annotate:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',freeze:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',clear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',minimize:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>',screenshot:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',logo:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>'},$=class{constructor(e,n,o){this.position=e;this.callbacks=n;this.fabBadge=null;this.annotateActive=!1;this.freezeActive=!1;this.minimized=!1;this.totalCount=0;this.dragging=!1;this.dragOffset={x:0,y:0};this.keys=o!=null?o:{},this.build(),this.setupDrag()}build(){var l,u,h,f,g;this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Se,this.shadow.appendChild(e),this.toolbarEl=document.createElement("div"),this.toolbarEl.className="toolbar";let n=this.keys;this.annotateBtn=this.makeBtn(C.annotate,`Annotate elements (${((l=n.annotate)!=null?l:"A").toUpperCase()})`,()=>{let p=!this.annotateActive;this.setAnnotateActive(p),this.callbacks.onToggleAnnotate(p)}),this.freezeBtn=this.makeBtn(C.freeze,`Freeze page (${((u=n.freeze)!=null?u:"F").toUpperCase()})`,()=>{let p=!this.freezeActive;this.setFreezeActive(p),this.callbacks.onFreezeAnimations(p)});let o=this.makeBtn(C.screenshot,`Screenshot region (${((h=n.screenshot)!=null?h:"C").toUpperCase()})`,()=>{this.callbacks.onScreenshot()});this.copyBtn=this.makeBtn(C.copy,"Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.innerHTML=C.check,setTimeout(()=>{this.copyBtn.innerHTML=C.copy},1200)});let r=document.createElement("div");r.className="clear-wrap";let i=this.makeBtn(C.clear,`Clear this page (${((f=n.clearPage)!=null?f:"X").toUpperCase()})`,()=>{var p,m;(m=(p=this.callbacks).onClearPage)==null||m.call(p)});i.classList.add("danger-btn");let s=this.makeBtn('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',"Delete all instructions.",()=>{var p,m;return(m=(p=this.callbacks).onClearAll)==null?void 0:m.call(p)});s.classList.add("danger-btn","clear-all-btn"),r.appendChild(i),r.appendChild(s);let a=this.makeBtn(C.minimize,"Minimize toolbar",()=>{this.setMinimized(!0)});a.classList.add("minimize-btn");let c=()=>{let p=document.createElement("div");return p.className="divider",p};this.toolbarEl.append(this.annotateBtn,o,c(),this.freezeBtn,c(),this.copyBtn,r,c(),a),this.shadow.appendChild(this.toolbarEl),this.fab=document.createElement("button"),this.fab.className="fab",this.fab.title="Open instruckt toolbar",this.fab.setAttribute("aria-label","Open instruckt toolbar"),this.fab.innerHTML=C.logo,this.fab.style.display="none",this.fab.addEventListener("click",p=>{p.stopPropagation(),this.setMinimized(!1)}),this.shadow.appendChild(this.fab),this.host.addEventListener("click",p=>p.stopPropagation()),this.host.addEventListener("mousedown",p=>p.stopPropagation()),this.host.addEventListener("pointerdown",p=>p.stopPropagation()),this.applyPosition(),((g=document.getElementById("instruckt-root"))!=null?g:document.body).appendChild(this.host)}makeBtn(e,n,o){let r=document.createElement("button");return r.className="btn",r.setAttribute("data-tooltip",n),r.setAttribute("aria-label",n),r.innerHTML=e,r.addEventListener("click",i=>{i.stopPropagation(),o()}),r}applyPosition(){let e="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?e:"auto",top:this.position.includes("top")?e:"auto",right:this.position.includes("right")?e:"auto",left:this.position.includes("left")?e:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",e=>{let n=e;if(n.target.closest(".btn")||n.target.closest(".fab"))return;this.dragging=!0;let o=this.host.getBoundingClientRect();this.dragOffset={x:n.clientX-o.left,y:n.clientY-o.top},n.preventDefault()}),document.addEventListener("mousemove",e=>{this.dragging&&Object.assign(this.host.style,{left:`${e.clientX-this.dragOffset.x}px`,top:`${e.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMinimized(e){var n,o;this.minimized=e,this.toolbarEl.style.display=e?"none":"",this.fab.style.display=e?"":"none",this.updateFabBadge(),(o=(n=this.callbacks).onMinimize)==null||o.call(n,e)}updateFabBadge(){var e;this.totalCount>0&&this.minimized?(this.fabBadge||(this.fabBadge=document.createElement("span"),this.fabBadge.className="fab-badge",this.fab.appendChild(this.fabBadge)),this.fabBadge.textContent=this.totalCount>99?"99+":String(this.totalCount)):((e=this.fabBadge)==null||e.remove(),this.fabBadge=null)}isMinimized(){return this.minimized}minimize(){this.minimized=!0,this.toolbarEl.style.display="none",this.fab.style.display="",this.updateFabBadge()}setAnnotateActive(e){this.annotateActive=e,this.annotateBtn.classList.toggle("active",e),document.body.classList.toggle("ik-annotating",e)}setFreezeActive(e){this.freezeActive=e,this.freezeBtn.classList.toggle("active",e)}setMode(e){this.setAnnotateActive(e==="annotating")}setAnnotationCount(e){let n=this.annotateBtn.querySelector(".badge");e>0?(n||(n=document.createElement("span"),n.className="badge",this.annotateBtn.appendChild(n)),n.textContent=e>99?"99+":String(e)):n==null||n.remove()}setTotalCount(e){this.totalCount=e,this.updateFabBadge()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var F=class{constructor(){var n;this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),((n=document.getElementById("instruckt-root"))!=null?n:document.body).appendChild(this.el)}show(e){let n=e.getBoundingClientRect();if(n.width===0&&n.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function yt(t,e){return t[13]=1,t[14]=e>>8,t[15]=e&255,t[16]=e>>8,t[17]=e&255,t}var ze=112,Be=72,Re=89,$e=115,re;function kt(){let t=new Int32Array(256);for(let e=0;e<256;e++){let n=e;for(let o=0;o<8;o++)n=n&1?3988292384^n>>>1:n>>>1;t[e]=n}return t}function xt(t){let e=-1;re||(re=kt());for(let n=0;n<t.length;n++)e=re[(e^t[n])&255]^e>>>8;return e^-1}function Et(t){let e=t.length-1;for(let n=e;n>=4;n--)if(t[n-4]===9&&t[n-3]===ze&&t[n-2]===Be&&t[n-1]===Re&&t[n]===$e)return n-3;return 0}function St(t,e,n=!1){let o=new Uint8Array(13);e*=39.3701,o[0]=ze,o[1]=Be,o[2]=Re,o[3]=$e,o[4]=e>>>24,o[5]=e>>>16,o[6]=e>>>8,o[7]=e&255,o[8]=o[4],o[9]=o[5],o[10]=o[6],o[11]=o[7],o[12]=1;let r=xt(o),i=new Uint8Array(4);if(i[0]=r>>>24,i[1]=r>>>16,i[2]=r>>>8,i[3]=r&255,n){let s=Et(t);return t.set(o,s),t.set(i,s+13),t}else{let s=new Uint8Array(4);s[0]=0,s[1]=0,s[2]=0,s[3]=9;let a=new Uint8Array(54);return a.set(t,0),a.set(s,33),a.set(o,37),a.set(i,50),a}}var Ct="AAlwSFlz",At="AAAJcEhZ",Tt="AAAACXBI";function Pt(t){let e=t.indexOf(Ct);return e===-1&&(e=t.indexOf(At)),e===-1&&(e=t.indexOf(Tt)),e}var Fe="[modern-screenshot]",A=typeof window!="undefined",Mt=A&&"Worker"in window,Lt=A&&"atob"in window,It=A&&"btoa"in window,Ie,ae=A?(Ie=window.navigator)==null?void 0:Ie.userAgent:"",Ne=ae.includes("Chrome"),K=ae.includes("AppleWebKit")&&!Ne,le=ae.includes("Firefox"),zt=t=>t&&"__CONTEXT__"in t,Bt=t=>t.constructor.name==="CSSFontFaceRule",Rt=t=>t.constructor.name==="CSSImportRule",$t=t=>t.constructor.name==="CSSLayerBlockRule",S=t=>t.nodeType===1,D=t=>typeof t.className=="object",_e=t=>t.tagName==="image",Ft=t=>t.tagName==="use",N=t=>S(t)&&typeof t.style!="undefined"&&!D(t),Nt=t=>t.nodeType===8,_t=t=>t.nodeType===3,B=t=>t.tagName==="IMG",X=t=>t.tagName==="VIDEO",Ot=t=>t.tagName==="CANVAS",Dt=t=>t.tagName==="TEXTAREA",Ut=t=>t.tagName==="INPUT",jt=t=>t.tagName==="STYLE",Ht=t=>t.tagName==="SCRIPT",qt=t=>t.tagName==="SELECT",Vt=t=>t.tagName==="SLOT",Wt=t=>t.tagName==="IFRAME",Kt=(...t)=>console.warn(Fe,...t);function Xt(t){var n;let e=(n=t==null?void 0:t.createElement)==null?void 0:n.call(t,"canvas");return e&&(e.height=e.width=1),!!e&&"toDataURL"in e&&!!e.toDataURL("image/webp").includes("image/webp")}var ie=t=>t.startsWith("data:");function Oe(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(A&&t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i)||!A)return t;let n=Y().implementation.createHTMLDocument(),o=n.createElement("base"),r=n.createElement("a");return n.head.appendChild(o),n.body.appendChild(r),e&&(o.href=e),r.href=t,r.href}function Y(t){var e;return(e=t&&S(t)?t==null?void 0:t.ownerDocument:t)!=null?e:window.document}var J="http://www.w3.org/2000/svg";function Yt(t,e,n){let o=Y(n).createElementNS(J,"svg");return o.setAttributeNS(null,"width",t.toString()),o.setAttributeNS(null,"height",e.toString()),o.setAttributeNS(null,"viewBox",`0 0 ${t} ${e}`),o}function Jt(t,e){let n=new XMLSerializer().serializeToString(t);return e&&(n=n.replace(/[\u0000-\u0008\v\f\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/gu,"")),`data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`}function Gt(t,e){return new Promise((n,o)=>{let r=new FileReader;r.onload=()=>n(r.result),r.onerror=()=>o(r.error),r.onabort=()=>o(new Error(`Failed read blob to ${e}`)),e==="dataUrl"?r.readAsDataURL(t):e==="arrayBuffer"&&r.readAsArrayBuffer(t)})}var Zt=t=>Gt(t,"dataUrl");function z(t,e){let n=Y(e).createElement("img");return n.decoding="sync",n.loading="eager",n.src=t,n}function _(t,e){return new Promise(n=>{let{timeout:o,ownerDocument:r,onError:i,onWarn:s}=e!=null?e:{},a=typeof t=="string"?z(t,Y(r)):t,c=null,d=null;function l(){n(a),c&&clearTimeout(c),d==null||d()}if(o&&(c=setTimeout(l,o)),X(a)){let u=a.currentSrc||a.src;if(!u)return a.poster?_(a.poster,e).then(n):l();if(a.readyState>=2)return l();let h=l,f=g=>{s==null||s("Failed video load",u,g),i==null||i(g),l()};d=()=>{a.removeEventListener("loadeddata",h),a.removeEventListener("error",f)},a.addEventListener("loadeddata",h,{once:!0}),a.addEventListener("error",f,{once:!0})}else{let u=_e(a)?a.href.baseVal:a.currentSrc||a.src;if(!u)return l();let h=async()=>{if(B(a)&&"decode"in a)try{await a.decode()}catch(g){s==null||s("Failed to decode image, trying to render anyway",a.dataset.originalSrc||u,g)}l()},f=g=>{s==null||s("Failed image load",a.dataset.originalSrc||u,g),l()};if(B(a)&&a.complete)return h();d=()=>{a.removeEventListener("load",h),a.removeEventListener("error",f)},a.addEventListener("load",h,{once:!0}),a.addEventListener("error",f,{once:!0})}})}async function Qt(t,e){N(t)&&(B(t)||X(t)?await _(t,e):await Promise.all(["img","video"].flatMap(n=>Array.from(t.querySelectorAll(n)).map(o=>_(o,e)))))}var De=(function(){let e=0,n=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(e+=1,`u${n()}${e}`)})();function Ue(t){return t==null?void 0:t.split(",").map(e=>e.trim().replace(/"|'/g,"").toLowerCase()).filter(Boolean)}var Ce=0;function en(t){let e=`${Fe}[#${Ce}]`;return Ce++,{time:n=>t&&console.time(`${e} ${n}`),timeEnd:n=>t&&console.timeEnd(`${e} ${n}`),warn:(...n)=>t&&Kt(...n)}}function tn(t){return{cache:t?"no-cache":"force-cache"}}async function G(t,e){return zt(t)?t:nn(t,L(E({},e),{autoDestruct:!0}))}async function nn(t,e){var f,g,p,m,b;let{scale:n=1,workerUrl:o,workerNumber:r=1}=e||{},i=!!(e!=null&&e.debug),s=(f=e==null?void 0:e.features)!=null?f:!0,a=(g=t.ownerDocument)!=null?g:A?window.document:void 0,c=(m=(p=t.ownerDocument)==null?void 0:p.defaultView)!=null?m:A?window:void 0,d=new Map,l=L(E({width:0,height:0,quality:1,type:"image/png",scale:n,backgroundColor:null,style:null,filter:null,maximumCanvasSize:0,timeout:3e4,progress:null,debug:i,fetch:E({requestInit:tn((b=e==null?void 0:e.fetch)==null?void 0:b.bypassingCache),placeholderImage:"data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",bypassingCache:!1},e==null?void 0:e.fetch),fetchFn:null,font:{},drawImageInterval:100,workerUrl:null,workerNumber:r,onCloneEachNode:null,onCloneNode:null,onEmbedNode:null,onCreateForeignObjectSvg:null,includeStyleProperties:null,autoDestruct:!1},e),{__CONTEXT__:!0,log:en(i),node:t,ownerDocument:a,ownerWindow:c,dpi:n===1?null:96*n,svgStyleElement:je(a),svgDefsElement:a==null?void 0:a.createElementNS(J,"defs"),svgStyles:new Map,defaultComputedStyles:new Map,workers:[...Array.from({length:Mt&&o&&r?r:0})].map(()=>{try{let w=new Worker(o);return w.onmessage=async v=>{var x,P,M,ye;let{url:y,result:k}=v.data;k?(P=(x=d.get(y))==null?void 0:x.resolve)==null||P.call(x,k):(ye=(M=d.get(y))==null?void 0:M.reject)==null||ye.call(M,new Error(`Error receiving message from worker: ${y}`))},w.onmessageerror=v=>{var k,x;let{url:y}=v.data;(x=(k=d.get(y))==null?void 0:k.reject)==null||x.call(k,new Error(`Error receiving message from worker: ${y}`))},w}catch(w){return l.log.warn("Failed to new Worker",w),null}}).filter(Boolean),fontFamilies:new Map,fontCssTexts:new Map,acceptOfImage:`${[Xt(a)&&"image/webp","image/svg+xml","image/*","*/*"].filter(Boolean).join(",")};q=0.8`,requests:d,drawImageCount:0,tasks:[],features:s,isEnable:w=>{var v,y;return w==="restoreScrollPosition"?typeof s=="boolean"?!1:(v=s[w])!=null?v:!1:typeof s=="boolean"?s:(y=s[w])!=null?y:!0},shadowRoots:[]});l.log.time("wait until load"),await Qt(t,{timeout:l.timeout,onWarn:l.log.warn}),l.log.timeEnd("wait until load");let{width:u,height:h}=on(t,l);return l.width=u,l.height=h,l}function je(t){if(!t)return;let e=t.createElement("style"),n=e.ownerDocument.createTextNode(`
.______background-clip--text {
  background-clip: text;
  -webkit-background-clip: text;
}
`);return e.appendChild(n),e}function on(t,e){let{width:n,height:o}=e;if(S(t)&&(!n||!o)){let r=t.getBoundingClientRect();n=n||r.width||Number(t.getAttribute("width"))||0,o=o||r.height||Number(t.getAttribute("height"))||0}return{width:n,height:o}}async function rn(t,e){let{log:n,timeout:o,drawImageCount:r,drawImageInterval:i}=e;n.time("image to canvas");let s=await _(t,{timeout:o,onWarn:e.log.warn}),{canvas:a,context2d:c}=sn(t.ownerDocument,e),d=()=>{try{c==null||c.drawImage(s,0,0,a.width,a.height)}catch(l){e.log.warn("Failed to drawImage",l)}};if(d(),e.isEnable("fixSvgXmlDecode"))for(let l=0;l<r;l++)await new Promise(u=>{setTimeout(()=>{c==null||c.clearRect(0,0,a.width,a.height),d(),u()},l+i)});return e.drawImageCount=0,n.timeEnd("image to canvas"),a}function sn(t,e){let{width:n,height:o,scale:r,backgroundColor:i,maximumCanvasSize:s}=e,a=t.createElement("canvas");a.width=Math.floor(n*r),a.height=Math.floor(o*r),a.style.width=`${n}px`,a.style.height=`${o}px`,s&&(a.width>s||a.height>s)&&(a.width>s&&a.height>s?a.width>a.height?(a.height*=s/a.width,a.width=s):(a.width*=s/a.height,a.height=s):a.width>s?(a.height*=s/a.width,a.width=s):(a.width*=s/a.height,a.height=s));let c=a.getContext("2d");return c&&i&&(c.fillStyle=i,c.fillRect(0,0,a.width,a.height)),{canvas:a,context2d:c}}function He(t,e){if(t.ownerDocument)try{let i=t.toDataURL();if(i!=="data:,")return z(i,t.ownerDocument)}catch(i){e.log.warn("Failed to clone canvas",i)}let n=t.cloneNode(!1),o=t.getContext("2d"),r=n.getContext("2d");try{return o&&r&&r.putImageData(o.getImageData(0,0,t.width,t.height),0,0),n}catch(i){e.log.warn("Failed to clone canvas",i)}return n}function an(t,e){var n;try{if((n=t==null?void 0:t.contentDocument)!=null&&n.body)return ce(t.contentDocument.body,e)}catch(o){e.log.warn("Failed to clone iframe",o)}return t.cloneNode(!1)}function ln(t){let e=t.cloneNode(!1);return t.currentSrc&&t.currentSrc!==t.src&&(e.src=t.currentSrc,e.srcset=""),e.loading==="lazy"&&(e.loading="eager"),e}async function cn(t,e){if(t.ownerDocument&&!t.currentSrc&&t.poster)return z(t.poster,t.ownerDocument);let n=t.cloneNode(!1);n.crossOrigin="anonymous",t.currentSrc&&t.currentSrc!==t.src&&(n.src=t.currentSrc);let o=n.ownerDocument;if(o){let r=!0;if(await _(n,{onError:()=>r=!1,onWarn:e.log.warn}),!r)return t.poster?z(t.poster,t.ownerDocument):n;n.currentTime=t.currentTime,await new Promise(s=>{n.addEventListener("seeked",s,{once:!0})});let i=o.createElement("canvas");i.width=t.offsetWidth,i.height=t.offsetHeight;try{let s=i.getContext("2d");s&&s.drawImage(n,0,0,i.width,i.height)}catch(s){return e.log.warn("Failed to clone video",s),t.poster?z(t.poster,t.ownerDocument):n}return He(i,e)}return n}function dn(t,e){return Ot(t)?He(t,e):Wt(t)?an(t,e):B(t)?ln(t):X(t)?cn(t,e):t.cloneNode(!1)}function un(t){let e=t.sandbox;if(!e){let{ownerDocument:n}=t;try{n&&(e=n.createElement("iframe"),e.id=`__SANDBOX__${De()}`,e.width="0",e.height="0",e.style.visibility="hidden",e.style.position="fixed",n.body.appendChild(e),e.srcdoc='<!DOCTYPE html><meta charset="UTF-8"><title></title><body>',t.sandbox=e)}catch(o){t.log.warn("Failed to getSandBox",o)}}return e}var hn=["width","height","-webkit-text-fill-color"],pn=["stroke","fill"];function qe(t,e,n){let{defaultComputedStyles:o}=n,r=t.nodeName.toLowerCase(),i=D(t)&&r!=="svg",s=i?pn.map(p=>[p,t.getAttribute(p)]).filter(([,p])=>p!==null):[],a=[i&&"svg",r,s.map((p,m)=>`${p}=${m}`).join(","),e].filter(Boolean).join(":");if(o.has(a))return o.get(a);let c=un(n),d=c==null?void 0:c.contentWindow;if(!d)return new Map;let l=d==null?void 0:d.document,u,h;i?(u=l.createElementNS(J,"svg"),h=u.ownerDocument.createElementNS(u.namespaceURI,r),s.forEach(([p,m])=>{h.setAttributeNS(null,p,m)}),u.appendChild(h)):u=h=l.createElement(r),h.textContent=" ",l.body.appendChild(u);let f=d.getComputedStyle(h,e),g=new Map;for(let p=f.length,m=0;m<p;m++){let b=f.item(m);hn.includes(b)||g.set(b,f.getPropertyValue(b))}return l.body.removeChild(u),o.set(a,g),g}function Ve(t,e,n){var a;let o=new Map,r=[],i=new Map;if(n)for(let c of n)s(c);else for(let c=t.length,d=0;d<c;d++){let l=t.item(d);s(l)}for(let c=r.length,d=0;d<c;d++)(a=i.get(r[d]))==null||a.forEach((l,u)=>o.set(u,l));function s(c){let d=t.getPropertyValue(c),l=t.getPropertyPriority(c),u=c.lastIndexOf("-"),h=u>-1?c.substring(0,u):void 0;if(h){let f=i.get(h);f||(f=new Map,i.set(h,f)),f.set(c,[d,l])}e.get(c)===d&&!l||(h?r.push(h):o.set(c,[d,l]))}return o}function mn(t,e,n,o){var u,h,f,g;let{ownerWindow:r,includeStyleProperties:i,currentParentNodeStyle:s}=o,a=e.style,c=r.getComputedStyle(t),d=qe(t,null,o);s==null||s.forEach((p,m)=>{d.delete(m)});let l=Ve(c,d,i);l.delete("transition-property"),l.delete("all"),l.delete("d"),l.delete("content"),n&&(l.delete("margin-top"),l.delete("margin-right"),l.delete("margin-bottom"),l.delete("margin-left"),l.delete("margin-block-start"),l.delete("margin-block-end"),l.delete("margin-inline-start"),l.delete("margin-inline-end"),l.set("box-sizing",["border-box",""])),((u=l.get("background-clip"))==null?void 0:u[0])==="text"&&e.classList.add("______background-clip--text"),Ne&&(l.has("font-kerning")||l.set("font-kerning",["normal",""]),(((h=l.get("overflow-x"))==null?void 0:h[0])==="hidden"||((f=l.get("overflow-y"))==null?void 0:f[0])==="hidden")&&((g=l.get("text-overflow"))==null?void 0:g[0])==="ellipsis"&&t.scrollWidth===t.clientWidth&&l.set("text-overflow",["clip",""]));for(let p=a.length,m=0;m<p;m++)a.removeProperty(a.item(m));return l.forEach(([p,m],b)=>{a.setProperty(b,p,m)}),l}function fn(t,e){(Dt(t)||Ut(t)||qt(t))&&e.setAttribute("value",t.value)}var gn=["::before","::after"],bn=["::-webkit-scrollbar","::-webkit-scrollbar-button","::-webkit-scrollbar-thumb","::-webkit-scrollbar-track","::-webkit-scrollbar-track-piece","::-webkit-scrollbar-corner","::-webkit-resizer"];function vn(t,e,n,o,r){let{ownerWindow:i,svgStyleElement:s,svgStyles:a,currentNodeStyle:c}=o;if(!s||!i)return;function d(l){var v;let u=i.getComputedStyle(t,l),h=u.getPropertyValue("content");if(!h||h==="none")return;r==null||r(h),h=h.replace(/(')|(")|(counter\(.+\))/g,"");let f=[De()],g=qe(t,l,o);c==null||c.forEach((y,k)=>{g.delete(k)});let p=Ve(u,g,o.includeStyleProperties);p.delete("content"),p.delete("-webkit-locale"),((v=p.get("background-clip"))==null?void 0:v[0])==="text"&&e.classList.add("______background-clip--text");let m=[`content: '${h}';`];if(p.forEach(([y,k],x)=>{m.push(`${x}: ${y}${k?" !important":""};`)}),m.length===1)return;try{e.className=[e.className,...f].join(" ")}catch(y){o.log.warn("Failed to copyPseudoClass",y);return}let b=m.join(`
  `),w=a.get(b);w||(w=[],a.set(b,w)),w.push(`.${f[0]}${l}`)}gn.forEach(d),n&&bn.forEach(d)}var Ae=new Set(["symbol"]);async function Te(t,e,n,o,r){if(S(n)&&(jt(n)||Ht(n))||o.filter&&!o.filter(n))return;Ae.has(e.nodeName)||Ae.has(n.nodeName)?o.currentParentNodeStyle=void 0:o.currentParentNodeStyle=o.currentNodeStyle;let i=await ce(n,o,!1,r);o.isEnable("restoreScrollPosition")&&wn(t,i),e.appendChild(i)}async function Pe(t,e,n,o){var i;let r=t.firstChild;S(t)&&t.shadowRoot&&(r=(i=t.shadowRoot)==null?void 0:i.firstChild,n.shadowRoots.push(t.shadowRoot));for(let s=r;s;s=s.nextSibling)if(!Nt(s))if(S(s)&&Vt(s)&&typeof s.assignedNodes=="function"){let a=s.assignedNodes();for(let c=0;c<a.length;c++)await Te(t,e,a[c],n,o)}else await Te(t,e,s,n,o)}function wn(t,e){if(!N(t)||!N(e))return;let{scrollTop:n,scrollLeft:o}=t;if(!n&&!o)return;let{transform:r}=e.style,i=new DOMMatrix(r),{a:s,b:a,c,d}=i;i.a=1,i.b=0,i.c=0,i.d=1,i.translateSelf(-o,-n),i.a=s,i.b=a,i.c=c,i.d=d,e.style.transform=i.toString()}function yn(t,e){let{backgroundColor:n,width:o,height:r,style:i}=e,s=t.style;if(n&&s.setProperty("background-color",n,"important"),o&&s.setProperty("width",`${o}px`,"important"),r&&s.setProperty("height",`${r}px`,"important"),i)for(let a in i)s[a]=i[a]}var kn=/^[\w-:]+$/;async function ce(t,e,n=!1,o){var d,l,u,h;let{ownerDocument:r,ownerWindow:i,fontFamilies:s,onCloneEachNode:a}=e;if(r&&_t(t))return o&&/\S/.test(t.data)&&o(t.data),r.createTextNode(t.data);if(r&&i&&S(t)&&(N(t)||D(t))){let f=await dn(t,e);if(e.isEnable("removeAbnormalAttributes")){let v=f.getAttributeNames();for(let y=v.length,k=0;k<y;k++){let x=v[k];kn.test(x)||f.removeAttribute(x)}}let g=e.currentNodeStyle=mn(t,f,n,e);n&&yn(f,e);let p=!1;if(e.isEnable("copyScrollbar")){let v=[(d=g.get("overflow-x"))==null?void 0:d[0],(l=g.get("overflow-y"))==null?void 0:l[0]];p=v.includes("scroll")||(v.includes("auto")||v.includes("overlay"))&&(t.scrollHeight>t.clientHeight||t.scrollWidth>t.clientWidth)}let m=(u=g.get("text-transform"))==null?void 0:u[0],b=Ue((h=g.get("font-family"))==null?void 0:h[0]),w=b?v=>{m==="uppercase"?v=v.toUpperCase():m==="lowercase"?v=v.toLowerCase():m==="capitalize"&&(v=v[0].toUpperCase()+v.substring(1)),b.forEach(y=>{let k=s.get(y);k||s.set(y,k=new Set),v.split("").forEach(x=>k.add(x))})}:void 0;return vn(t,f,p,e,w),fn(t,f),X(t)||await Pe(t,f,e,w),await(a==null?void 0:a(f)),f}let c=t.cloneNode(!1);return await Pe(t,c,e),await(a==null?void 0:a(c)),c}function xn(t){if(t.ownerDocument=void 0,t.ownerWindow=void 0,t.svgStyleElement=void 0,t.svgDefsElement=void 0,t.svgStyles.clear(),t.defaultComputedStyles.clear(),t.sandbox){try{t.sandbox.remove()}catch(e){t.log.warn("Failed to destroyContext",e)}t.sandbox=void 0}t.workers=[],t.fontFamilies.clear(),t.fontCssTexts.clear(),t.requests.clear(),t.tasks=[],t.shadowRoots=[]}function En(t){let a=t,{url:e,timeout:n,responseType:o}=a,r=Ee(a,["url","timeout","responseType"]),i=new AbortController,s=n?setTimeout(()=>i.abort(),n):void 0;return fetch(e,E({signal:i.signal},r)).then(c=>{if(!c.ok)throw new Error("Failed fetch, not 2xx response",{cause:c});switch(o){case"arrayBuffer":return c.arrayBuffer();case"dataUrl":return c.blob().then(Zt);default:return c.text()}}).finally(()=>clearTimeout(s))}function O(t,e){let{url:n,requestType:o="text",responseType:r="text",imageDom:i}=e,s=n,{timeout:a,acceptOfImage:c,requests:d,fetchFn:l,fetch:{requestInit:u,bypassingCache:h,placeholderImage:f},font:g,workers:p,fontFamilies:m}=t;o==="image"&&(K||le)&&t.drawImageCount++;let b=d.get(n);if(!b){h&&h instanceof RegExp&&h.test(s)&&(s+=(/\?/.test(s)?"&":"?")+new Date().getTime());let w=o.startsWith("font")&&g&&g.minify,v=new Set;w&&o.split(";")[1].split(",").forEach(P=>{m.has(P)&&m.get(P).forEach(M=>v.add(M))});let y=w&&v.size,k=E({url:s,timeout:a,responseType:y?"arrayBuffer":r,headers:o==="image"?{accept:c}:void 0},u);b={type:o,resolve:void 0,reject:void 0,response:null},b.response=(async()=>{if(l&&o==="image"){let x=await l(n);if(x)return x}return!K&&n.startsWith("http")&&p.length?new Promise((x,P)=>{p[d.size&p.length-1].postMessage(E({rawUrl:n},k)),b.resolve=x,b.reject=P}):En(k)})().catch(x=>{if(d.delete(n),o==="image"&&f)return t.log.warn("Failed to fetch image base64, trying to use placeholder image",s),typeof f=="string"?f:f(i);throw x}),d.set(n,b)}return b.response}async function We(t,e,n,o){if(!Ke(t))return t;for(let[r,i]of Sn(t,e))try{let s=await O(n,{url:i,requestType:o?"image":"text",responseType:"dataUrl"});t=t.replace(Cn(r),`$1${s}$3`)}catch(s){n.log.warn("Failed to fetch css data url",r,s)}return t}function Ke(t){return/url\((['"]?)([^'"]+?)\1\)/.test(t)}var Xe=/url\((['"]?)([^'"]+?)\1\)/g;function Sn(t,e){let n=[];return t.replace(Xe,(o,r,i)=>(n.push([i,Oe(i,e)]),o)),n.filter(([o])=>!ie(o))}function Cn(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}var An=["background-image","border-image-source","-webkit-border-image","-webkit-mask-image","list-style-image"];function Tn(t,e){return An.map(n=>{let o=t.getPropertyValue(n);return!o||o==="none"?null:((K||le)&&e.drawImageCount++,We(o,null,e,!0).then(r=>{!r||o===r||t.setProperty(n,r,t.getPropertyPriority(n))}))}).filter(Boolean)}function Pn(t,e){if(B(t)){let n=t.currentSrc||t.src;if(!ie(n))return[O(e,{url:n,imageDom:t,requestType:"image",responseType:"dataUrl"}).then(o=>{o&&(t.srcset="",t.dataset.originalSrc=n,t.src=o||"")})];(K||le)&&e.drawImageCount++}else if(D(t)&&!ie(t.href.baseVal)){let n=t.href.baseVal;return[O(e,{url:n,imageDom:t,requestType:"image",responseType:"dataUrl"}).then(o=>{o&&(t.dataset.originalSrc=n,t.href.baseVal=o||"")})]}return[]}function Mn(t,e){var a;let{ownerDocument:n,svgDefsElement:o}=e,r=(a=t.getAttribute("href"))!=null?a:t.getAttribute("xlink:href");if(!r)return[];let[i,s]=r.split("#");if(s){let c=`#${s}`,d=e.shadowRoots.reduce((l,u)=>l!=null?l:u.querySelector(`svg ${c}`),n==null?void 0:n.querySelector(`svg ${c}`));if(i&&t.setAttribute("href",c),o!=null&&o.querySelector(c))return[];if(d)return o==null||o.appendChild(d.cloneNode(!0)),[];if(i)return[O(e,{url:i,responseType:"text"}).then(l=>{o==null||o.insertAdjacentHTML("beforeend",l)})]}return[]}function Ye(t,e){let{tasks:n}=e;S(t)&&((B(t)||_e(t))&&n.push(...Pn(t,e)),Ft(t)&&n.push(...Mn(t,e))),N(t)&&n.push(...Tn(t.style,e)),t.childNodes.forEach(o=>{Ye(o,e)})}async function Ln(t,e){let{ownerDocument:n,svgStyleElement:o,fontFamilies:r,fontCssTexts:i,tasks:s,font:a}=e;if(!(!n||!o||!r.size))if(a&&a.cssText){let c=Le(a.cssText,e);o.appendChild(n.createTextNode(`${c}
`))}else{let c=Array.from(n.styleSheets).filter(l=>{try{return"cssRules"in l&&!!l.cssRules.length}catch(u){return e.log.warn(`Error while reading CSS rules from ${l.href}`,u),!1}});await Promise.all(c.flatMap(l=>Array.from(l.cssRules).map(async(u,h)=>{if(Rt(u)){let f=h+1,g=u.href,p="";try{p=await O(e,{url:g,requestType:"text",responseType:"text"})}catch(b){e.log.warn(`Error fetch remote css import from ${g}`,b)}let m=p.replace(Xe,(b,w,v)=>b.replace(v,Oe(v,g)));for(let b of zn(m))try{l.insertRule(b,b.startsWith("@import")?f+=1:l.cssRules.length)}catch(w){e.log.warn("Error inserting rule from remote css import",{rule:b,error:w})}}})));let d=[];c.forEach(l=>{se(l.cssRules,d)}),d.filter(l=>{var u;return Bt(l)&&Ke(l.style.getPropertyValue("src"))&&((u=Ue(l.style.getPropertyValue("font-family")))==null?void 0:u.some(h=>r.has(h)))}).forEach(l=>{let u=l,h=i.get(u.cssText);h?o.appendChild(n.createTextNode(`${h}
`)):s.push(We(u.cssText,u.parentStyleSheet?u.parentStyleSheet.href:null,e).then(f=>{f=Le(f,e),i.set(u.cssText,f),o.appendChild(n.createTextNode(`${f}
`))}))})}}var In=/(\/\*[\s\S]*?\*\/)/g,Me=/((@.*?keyframes [\s\S]*?){([\s\S]*?}\s*?)})/gi;function zn(t){if(t==null)return[];let e=[],n=t.replace(In,"");for(;;){let i=Me.exec(n);if(!i)break;e.push(i[0])}n=n.replace(Me,"");let o=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,r=new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})","gi");for(;;){let i=o.exec(n);if(i)r.lastIndex=o.lastIndex;else if(i=r.exec(n),i)o.lastIndex=r.lastIndex;else break;e.push(i[0])}return e}var Bn=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Rn=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Le(t,e){let{font:n}=e,o=n?n==null?void 0:n.preferredFormat:void 0;return o?t.replace(Rn,r=>{for(;;){let[i,,s]=Bn.exec(r)||[];if(!s)return"";if(s===o)return`src: ${i};`}}):t}function se(t,e=[]){for(let n of Array.from(t))$t(n)?e.push(...se(n.cssRules)):"cssRules"in n?se(n.cssRules,e):e.push(n);return e}async function $n(t,e){let n=await G(t,e);if(S(n.node)&&D(n.node))return n.node;let{ownerDocument:o,log:r,tasks:i,svgStyleElement:s,svgDefsElement:a,svgStyles:c,font:d,progress:l,autoDestruct:u,onCloneNode:h,onEmbedNode:f,onCreateForeignObjectSvg:g}=n;r.time("clone node");let p=await ce(n.node,n,!0);if(s&&o){let y="";c.forEach((k,x)=>{y+=`${k.join(`,
`)} {
  ${x}
}
`}),s.appendChild(o.createTextNode(y))}r.timeEnd("clone node"),await(h==null?void 0:h(p)),d!==!1&&S(p)&&(r.time("embed web font"),await Ln(p,n),r.timeEnd("embed web font")),r.time("embed node"),Ye(p,n);let m=i.length,b=0,w=async()=>{for(;;){let y=i.pop();if(!y)break;try{await y}catch(k){n.log.warn("Failed to run task",k)}l==null||l(++b,m)}};l==null||l(b,m),await Promise.all([...Array.from({length:4})].map(w)),r.timeEnd("embed node"),await(f==null?void 0:f(p));let v=Fn(p,n);return a&&v.insertBefore(a,v.children[0]),s&&v.insertBefore(s,v.children[0]),u&&xn(n),await(g==null?void 0:g(v)),v}function Fn(t,e){let{width:n,height:o}=e,r=Yt(n,o,t.ownerDocument),i=r.ownerDocument.createElementNS(r.namespaceURI,"foreignObject");return i.setAttributeNS(null,"x","0%"),i.setAttributeNS(null,"y","0%"),i.setAttributeNS(null,"width","100%"),i.setAttributeNS(null,"height","100%"),i.append(t),r.appendChild(i),r}async function Nn(t,e){var s;let n=await G(t,e),o=await $n(n),r=Jt(o,n.isEnable("removeControlCharacter"));n.autoDestruct||(n.svgStyleElement=je(n.ownerDocument),n.svgDefsElement=(s=n.ownerDocument)==null?void 0:s.createElementNS(J,"defs"),n.svgStyles.clear());let i=z(r,o.ownerDocument);return await rn(i,n)}async function _n(t,e){let n=await G(t,e),{log:o,quality:r,type:i,dpi:s}=n,a=await Nn(n);o.time("canvas to data url");let c=a.toDataURL(i,r);if(["image/png","image/jpeg"].includes(i)&&s&&Lt&&It){let[d,l]=c.split(","),u=0,h=!1;if(i==="image/png"){let v=Pt(l);v>=0?(u=Math.ceil((v+28)/3)*4,h=!0):u=33/3*4}else i==="image/jpeg"&&(u=18/3*4);let f=l.substring(0,u),g=l.substring(u),p=window.atob(f),m=new Uint8Array(p.length);for(let v=0;v<m.length;v++)m[v]=p.charCodeAt(v);let b=i==="image/png"?St(m,s,h):yt(m,s),w=window.btoa(String.fromCharCode(...b));c=[d,",",w,g].join("")}return o.timeEnd("canvas to data url"),c}async function de(t,e){return _n(await G(t,L(E({},e),{type:"image/png"})))}function Je(t){var e;return!((e=t.getAttribute)!=null&&e.call(t,"data-instruckt"))}var I=null;async function Ge(){return I&&I.active||(I=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser"},preferCurrentTab:!0}),I.getVideoTracks()[0].addEventListener("ended",()=>{I=null})),I}async function On(t){let e=document.createElement("video");e.srcObject=t,e.muted=!0,await e.play(),await new Promise(o=>requestAnimationFrame(()=>requestAnimationFrame(o)));let n=await createImageBitmap(e);return e.pause(),e.srcObject=null,n}function Ze(t,e){return On(t).then(n=>{let o=window.devicePixelRatio||1,r=document.createElement("canvas");return r.width=e.width*o,r.height=e.height*o,r.getContext("2d").drawImage(n,e.x*o,e.y*o,e.width*o,e.height*o,0,0,r.width,r.height),n.close(),r.toDataURL("image/png")})}var ue=!1;function Qe(t){ue=t}async function et(t){if(!ue)try{let e=await de(t,{scale:2,filter:Je});if(e)return e}catch(e){}try{let e=await Ge();return await Ze(e,t.getBoundingClientRect())}catch(e){return console.warn("[instruckt] captureElement failed:",e),null}}async function tt(t){if(!ue)try{let e=await de(document.body,{scale:2,filter:Je});if(e)return await Dn(e,t)}catch(e){}try{let e=await Ge();return await Ze(e,t)}catch(e){return console.warn("[instruckt] captureRegion failed:",e),null}}function Dn(t,e){return new Promise((n,o)=>{let r=new Image;r.onload=()=>{let s=document.createElement("canvas");s.width=e.width*2,s.height=e.height*2,s.getContext("2d").drawImage(r,e.x*2,e.y*2,e.width*2,e.height*2,0,0,e.width*2,e.height*2),n(s.toDataURL("image/png"))},r.onerror=o,r.src=t})}function nt(){return new Promise(t=>{let e=document.createElement("div");Object.assign(e.style,{position:"fixed",inset:"0",zIndex:"2147483647",cursor:"crosshair",background:"rgba(0,0,0,0.1)"}),e.setAttribute("data-instruckt","region-select");let n=document.createElement("div");Object.assign(n.style,{position:"fixed",border:"2px dashed #6366f1",background:"rgba(99,102,241,0.08)",borderRadius:"4px",display:"none",pointerEvents:"none"}),e.appendChild(n);let o=0,r=0,i=!1,s=h=>{o=h.clientX,r=h.clientY,i=!0,n.style.display="block",c(h)},a=h=>{i&&c(h)},c=h=>{let f=Math.min(o,h.clientX),g=Math.min(r,h.clientY),p=Math.abs(h.clientX-o),m=Math.abs(h.clientY-r);Object.assign(n.style,{left:`${f}px`,top:`${g}px`,width:`${p}px`,height:`${m}px`})},d=h=>{if(!i)return;i=!1;let f=Math.min(o,h.clientX),g=Math.min(r,h.clientY),p=Math.abs(h.clientX-o),m=Math.abs(h.clientY-r);u(),p<10||m<10?t(null):t(new DOMRect(f,g,p,m))},l=h=>{h.key==="Escape"&&(u(),t(null))},u=()=>{e.remove(),document.removeEventListener("keydown",l,!0)};e.addEventListener("mousedown",s),e.addEventListener("mousemove",a),e.addEventListener("mouseup",d),document.addEventListener("keydown",l,!0),document.body.appendChild(e)})}function Un(t,e){return t?t.startsWith("data:")?t:`${e!=null?e:"/instruckt"}/${t}`:null}function T(t){return String(t!=null?t:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Z=class{constructor(){this.host=null;this.shadow=null;this.boundOutside=e=>{this.host&&!this.host.contains(e.target)&&this.destroy()}}showNew(e,n){var g,p;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let o=document.createElement("style");o.textContent=ne,this.shadow.appendChild(o);let r=document.createElement("div");r.className="popup";let i=e.framework?`<div class="fw-badge">${T(e.framework.component)}</div>`:"",s=e.selectedText?`<div class="selected-text">"${T(e.selectedText.slice(0,80))}"</div>`:"",a=!!e.screenshot;r.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${T(e.elementPath)}">${T(e.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${i}${s}
      <div class="screenshot-slot">${a?`<div class="screenshot-preview"><img src="${e.screenshot}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`:'<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>'}</div>
      <textarea placeholder="${a?"Add a note (optional)":"What needs to change here?"}" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" ${a?"":"disabled"}>Add note</button>
      </div>
    `;let c=(g=e.screenshot)!=null?g:null,d=r.querySelector("textarea"),l=r.querySelector('[data-action="submit"]'),u=r.querySelector(".screenshot-slot"),h=()=>{l.disabled=!c&&d.value.trim().length===0},f=()=>{let m=u.querySelector('[data-action="capture"]');m==null||m.addEventListener("click",async()=>{m.textContent="Capturing...";let w=await et(e.element);w?(c=w,u.innerHTML=`<div class="screenshot-preview"><img src="${w}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`,d.placeholder="Add a note (optional)",f(),h()):(m.textContent="Capture failed",setTimeout(()=>{m.parentElement&&(m.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot')},1500))});let b=u.querySelector(".screenshot-remove");b==null||b.addEventListener("click",()=>{c=null,u.innerHTML='<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>',d.placeholder="What needs to change here?",f(),h()})};f(),d.addEventListener("input",h),d.addEventListener("keydown",m=>{m.stopPropagation(),m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),l.disabled||l.click()),m.key==="Escape"&&(n.onCancel(),this.destroy())}),r.querySelector('[data-action="cancel"]').addEventListener("click",()=>{n.onCancel(),this.destroy()}),r.querySelector(".close-btn").addEventListener("click",()=>{n.onCancel(),this.destroy()}),l.addEventListener("click",()=>{let m=d.value.trim();!m&&!c||(n.onSubmit({comment:m||"(screenshot)",screenshot:c!=null?c:void 0}),this.destroy())}),this.shadow.appendChild(r),((p=document.getElementById("instruckt-root"))!=null?p:document.body).appendChild(this.host),this.positionHost(e.x,e.y),this.setupOutsideClick(),d.focus()}showEdit(e,n,o){var m;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let r=document.createElement("style");r.textContent=ne,this.shadow.appendChild(r);let i=document.createElement("div");i.className="popup";let s=e.framework?`<div class="fw-badge">${T(e.framework.component)}</div>`:"",a=Un(e.screenshot,o),c=a?`<div class="screenshot-preview screenshot-slot"><img src="${a}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`:"",d=e.comment==="(screenshot)"?"":e.comment;i.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${T(e.elementPath)}">${T(e.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${s}${c}
      <textarea rows="3">${T(d)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `,i.querySelector(".close-btn").addEventListener("click",()=>this.destroy());let l=i.querySelector(".screenshot-remove");l==null||l.addEventListener("click",()=>{n.onSave(e,e.comment);let b=i.querySelector(".screenshot-slot");b&&b.remove()});let u=i.querySelector("textarea"),h=i.querySelector('[data-action="save"]'),f=i.querySelector('[data-action="delete"]');u.addEventListener("keydown",b=>{b.stopPropagation(),b.key==="Enter"&&!b.shiftKey&&(b.preventDefault(),h.click()),b.key==="Escape"&&this.destroy()}),h.addEventListener("click",()=>{let b=u.value.trim();b&&(n.onSave(e,b),this.destroy())}),f.addEventListener("click",()=>{n.onDelete(e),this.destroy()}),this.shadow.appendChild(i),((m=document.getElementById("instruckt-root"))!=null?m:document.body).appendChild(this.host);let g=e.x/100*window.innerWidth,p=e.y-window.scrollY;this.positionHost(g,p),this.setupOutsideClick(),u.focus(),u.setSelectionRange(u.value.length,u.value.length)}stopHostPropagation(e){for(let n of["click","mousedown","pointerdown","keydown","keyup","keypress","submit"])e.addEventListener(n,o=>o.stopPropagation())}positionHost(e,n){if(this.host){this.host.setAttribute("popover","manual");try{this.host.showPopover()}catch(o){}Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var d,l;if(!this.host)return;let o=360,r=(l=(d=this.host.querySelector(".popup"))==null?void 0:d.getBoundingClientRect().height)!=null?l:300,i=window.innerWidth,s=window.innerHeight,a=Math.max(10,Math.min(e+10,i-o)),c=Math.max(10,Math.min(n+10,s-r-10));Object.assign(this.host.style,{left:`${a}px`,top:`${c}px`})})}}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var e;(e=this.host)==null||e.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var U=class{constructor(e){this.onClick=e;this.markers=new Map;var o;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),((o=document.getElementById("instruckt-root"))!=null?o:document.body).appendChild(this.container)}upsert(e,n){let o=this.markers.get(e.id);if(o){this.updateStyle(o.el,e);return}let r=document.createElement("div"),i=e.screenshot?" has-screenshot":"";r.className=`ik-marker ${this.statusClass(e.status)}${i}`,r.textContent=String(n),r.title=e.comment==="(screenshot)"?"Screenshot":e.comment.slice(0,60),r.style.pointerEvents="all",r.style.left=`${e.x/100*window.innerWidth}px`,r.style.top=`${e.y-window.scrollY}px`,r.addEventListener("click",s=>{s.stopPropagation(),this.onClick(e)}),this.container.appendChild(r),this.markers.set(e.id,{el:r,annotationId:e.id})}update(e){let n=this.markers.get(e.id);n&&this.updateStyle(n.el,e)}updateStyle(e,n){let o=n.screenshot?" has-screenshot":"";e.className=`ik-marker ${this.statusClass(n.status)}${o}`,e.title=n.comment==="(screenshot)"?"Screenshot":n.comment.slice(0,60)}statusClass(e){return e==="resolved"?"resolved":e==="dismissed"?"dismissed":""}reposition(e){e.forEach(n=>{let o=this.markers.get(n.id);o&&(o.el.style.left=`${n.x/100*window.innerWidth}px`,o.el.style.top=`${n.y-window.scrollY}px`)})}remove(e){let n=this.markers.get(e);n&&(n.el.remove(),this.markers.delete(e))}setVisible(e){this.container.style.display=e?"":"none"}clear(){for(let{el:e}of this.markers.values())e.remove();this.markers.clear()}destroy(){this.container.remove(),this.markers.clear()}};function he(t){if(t.id)return`#${CSS.escape(t.id)}`;let e=[],n=t;for(;n&&n!==document.documentElement;){let o=n.tagName.toLowerCase(),r=n.parentElement;if(!r){e.unshift(o);break}let i=Array.from(n.classList).filter(a=>!a.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(i.length>0){let a=`${o}.${i.map(CSS.escape).join(".")}`;if(r.querySelectorAll(a).length===1){e.unshift(a);break}}let s=Array.from(r.children).filter(a=>a.tagName===n.tagName);if(s.length===1)e.unshift(o);else{let a=s.indexOf(n)+1;e.unshift(`${o}:nth-of-type(${a})`)}n=r}return e.join(" > ")}function pe(t){let e=t.tagName.toLowerCase(),n=t.getAttribute("wire:model")||t.getAttribute("wire:click");if(n)return`${e}[wire:${n.split(".")[0]}]`;if(t.id)return`${e}#${t.id}`;let o=t.classList[0];return o?`${e}.${o}`:e}function me(t){let e=t.tagName.toLowerCase(),n=(t.textContent||"").trim().replace(/\s+/g," ").slice(0,40),o=[];t.id&&o.push(`id="${t.id}"`);let r=t.getAttribute("role");r&&o.push(`role="${r}"`);let i=t.getAttribute("wire:model")||t.getAttribute("wire:click");i&&o.push(`wire:${t.hasAttribute("wire:model")?"model":"click"}="${i}"`);let s=o.length?" "+o.join(" "):"",a=`<${e}${s}>`;return n?`${a} ${n}`:a}function fe(t){return(t.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function ge(t){return Array.from(t.classList).filter(e=>!e.match(/^(instruckt-)/)).join(" ")}function be(t){let e=t.getBoundingClientRect();return{x:e.left+window.scrollX,y:e.top+window.scrollY,width:e.width,height:e.height}}function ve(){return typeof window.Livewire!="undefined"}function jn(t){let e=t;for(;e&&e!==document.documentElement;){if(e.getAttribute("wire:id"))return e;e=e.parentElement}return null}function ot(t){var s,a,c,d,l;if(!ve())return null;let e=jn(t);if(!e)return null;let n=e.getAttribute("wire:id"),o="Unknown",r,i=e.getAttribute("wire:snapshot");if(i)try{let u=JSON.parse(i);o=(a=(s=u==null?void 0:u.memo)==null?void 0:s.name)!=null?a:"Unknown",r=(l=(c=u==null?void 0:u.memo)==null?void 0:c.path)!=null?l:(d=u==null?void 0:u.memo)==null?void 0:d.name}catch(u){}return{framework:"livewire",component:o,wire_id:n,class_name:r}}function rt(t){return t?!t.includes("node_modules"):!1}function we(t){var e,n,o;return(o=(e=t.type)==null?void 0:e.__file)!=null?o:(n=t.$options)==null?void 0:n.__file}function qn(t){var e,n,o,r,i,s,a,c;return(c=(a=(i=(o=(e=t.$options)==null?void 0:e.name)!=null?o:(n=t.$options)==null?void 0:n.__name)!=null?i:(r=t.type)==null?void 0:r.name)!=null?a:(s=t.type)==null?void 0:s.__name)!=null?c:"Anonymous"}function Vn(t){var o;let e=null,n=t;for(;n&&n!==document.documentElement;){let r=(o=n.__vueParentComponent)!=null?o:n.__vue__;if(r){let i=we(r);if(rt(i))return r;e||(e=r)}n=n.parentElement}if(e!=null&&e.parent){let r=e.parent;for(;r;){let i=we(r);if(rt(i))return r;r=r.parent}}return e}function it(t){let e=Vn(t);if(!e)return null;let n=qn(e),o={};if(e.props&&Object.assign(o,e.props),e.setupState){for(let[i,s]of Object.entries(e.setupState))if(!i.startsWith("_")&&typeof s!="function")try{o[i]=JSON.parse(JSON.stringify(s))}catch(a){o[i]=String(s)}}let r=we(e);return{framework:"vue",component:n,source_file:r,component_uid:e.uid!==void 0?String(e.uid):void 0,data:o}}function Kn(t){let e=t;for(;e&&e!==document.documentElement;){if(e.__svelte_meta)return e.__svelte_meta;e=e.parentElement}return null}function st(t){var r,i,s,a;let e=Kn(t);if(!e)return null;let n=(i=(r=e.loc)==null?void 0:r.file)!=null?i:"";return{framework:"svelte",component:n&&(a=(s=n.split("/").pop())==null?void 0:s.replace(/\.svelte$/,""))!=null?a:"Unknown",source_file:n||void 0,data:n?{file:n}:void 0}}function Yn(t){for(let e of Object.keys(t))if(e.startsWith("__reactFiber$")||e.startsWith("__reactInternalInstance$"))return e;return null}function Jn(t){return t?!t.fileName.includes("node_modules"):!1}function Gn(t){let e=null,n=t;for(;n;){let{type:o}=n,r=null;if(typeof o=="function"&&o.name){let i=o.name;i[0]===i[0].toUpperCase()&&i.length>1&&(r=i)}if(!r&&typeof o=="object"&&o!==null&&o.displayName&&(r=o.displayName),r){let i={name:r,source:n._debugSource};if(Jn(n._debugSource))return i;e||(e=i)}n=n.return}return e!=null?e:{name:"Component"}}function Zn(t){var o,r;let e=(r=(o=t.memoizedProps)!=null?o:t.pendingProps)!=null?r:{},n={};for(let[i,s]of Object.entries(e))if(!(i==="children"||typeof s=="function"))try{n[i]=JSON.parse(JSON.stringify(s))}catch(a){n[i]=String(s)}return n}function at(t){let e=t;for(;e&&e!==document.documentElement;){let n=Yn(e);if(n){let o=e[n];if(o){let{name:r,source:i}=Gn(o),s=Zn(o);return{framework:"react",component:r,source_file:i==null?void 0:i.fileName,source_line:i==null?void 0:i.lineNumber,data:s}}}e=e.parentElement}return null}function eo(){var e;let t=document.getElementById("instruckt-views");if(!t)return[];try{return JSON.parse((e=t.textContent)!=null?e:"[]")}catch(n){return[]}}function lt(t){var o;let e=eo();if(e.length===0)return null;let n=e.length>1?(o=e.find(r=>!r.name.startsWith("layouts.")&&!r.name.startsWith("components.")))!=null?o:e[e.length-1]:e[0];return{framework:"blade",component:n.name,source_file:n.file,data:{views:e.map(r=>r.file)}}}function ct(){return window.location.pathname}var j=class j{constructor(e){this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.frozenPopovers=[];this.rafId=null;this.pendingMouseTarget=null;this.highlightLocked=!1;this.pollTimer=null;this.initialLoadDone=!1;this.boundReposition=()=>{var e;(e=this.markers)==null||e.reposition(this.annotations)};this.freezeBlockEvents=["click","mousedown","pointerdown","pointerup","mouseup","touchstart","touchend","auxclick"];this.freezePassiveEvents=["focusin","focusout","blur","pointerleave","mouseleave","mouseout"];this.boundFreezeClick=e=>{this.isInstruckt(e.target)||this.isAnnotating&&e.type==="click"||(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation())};this.boundFreezeSubmit=e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()};this.boundFreezePassive=e=>{e.stopPropagation(),e.stopImmediatePropagation()};this.boundMouseMove=e=>{this.highlightLocked||(this.pendingMouseTarget=e.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var n,o;this.rafId=null,!this.highlightLocked&&(this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(n=this.highlight)==null||n.show(this.pendingMouseTarget):(o=this.highlight)==null||o.hide())})))};this.boundMouseLeave=()=>{var e;this.highlightLocked||(e=this.highlight)==null||e.hide()};this.boundAnnotateBlock=e=>{this.isInstruckt(e.target)||(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation())};this.boundClick=e=>{var h,f,g;let n=e.target;if(this.isInstruckt(n))return;e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation();let o=((h=window.getSelection())==null?void 0:h.toString().trim())||void 0,r=he(n),i=pe(n),s=me(n),a=ge(n),c=fe(n)||void 0,d=be(n),l=(f=this.detectFramework(n))!=null?f:void 0;(g=this.highlight)==null||g.show(n),this.highlightLocked=!0;let u={element:n,elementPath:r,elementName:i,elementLabel:s,cssClasses:a,boundingBox:d,x:e.clientX,y:e.clientY,selectedText:o,nearbyText:c,framework:l};this.showAnnotationPopup(u)};this.config=E({adapters:["livewire","vue","svelte","react","blade"],theme:"auto",position:"bottom-right"},e),this.api=new W(e.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.init()}init(){var n;oe(this.config.colors),((n=this.config.adapters)!=null?n:[]).includes("livewire")&&ve()&&Qe(!0),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new $(this.config.position,{onToggleAnnotate:o=>{this.setAnnotating(o)},onFreezeAnimations:o=>{this.setFrozen(o)},onScreenshot:()=>this.startRegionCapture(),onCopy:()=>this.copyToClipboard(!0),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:o=>this.onMinimize(o)},this.config.keys),this.highlight=new F,this.popup=new Z,this.markers=new U(o=>this.onMarkerClick(o)),document.addEventListener("keydown",this.boundKeydown),window.addEventListener("scroll",this.boundReposition,{passive:!0}),window.addEventListener("resize",this.boundReposition,{passive:!0}),document.addEventListener("livewire:navigated",()=>this.reattach()),document.addEventListener("inertia:navigate",()=>this.syncMarkers()),window.addEventListener("popstate",()=>{setTimeout(()=>this.reattach(),0)}),this.loadAnnotations()}makeToolbarCallbacks(){return{onToggleAnnotate:e=>{this.setAnnotating(e)},onFreezeAnimations:e=>{this.setFrozen(e)},onScreenshot:()=>this.startRegionCapture(),onCopy:()=>this.copyToClipboard(!0),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:e=>this.onMinimize(e)}}reattach(){var i,s;let e=this.isAnnotating,n=this.isFrozen,o=(s=(i=this.toolbar)==null?void 0:i.isMinimized())!=null?s:!1;this.isAnnotating&&this.detachAnnotateListeners(),this.isFrozen&&this.setFrozen(!1),this.isAnnotating=!1,this.isFrozen=!1,document.querySelectorAll("[data-instruckt]").forEach(a=>a.remove()),this.toolbar=new $(this.config.position,this.makeToolbarCallbacks()),o&&this.toolbar.minimize(),this.markers=new U(a=>this.onMarkerClick(a)),this.highlight=new F,o&&this.markers.setVisible(!1);let r=document.getElementById("instruckt-global");r&&r.remove(),oe(this.config.colors),this.syncMarkers(),e&&!o&&this.setAnnotating(!0)}onMinimize(e){var n,o,r,i,s;e?(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1),(n=this.toolbar)==null||n.setAnnotateActive(!1),(o=this.toolbar)==null||o.setFreezeActive(!1),(r=this.markers)==null||r.setVisible(!1),(i=this.popup)==null||i.destroy()):(s=this.markers)==null||s.setVisible(!0)}async loadAnnotations(){this.loadFromStorage();try{let e=await this.api.getAnnotations(),n=new Set(e.map(r=>r.id)),o=this.annotations.filter(r=>!n.has(r.id));this.annotations=[...e,...o],this.saveToStorage()}catch(e){}this.initialLoadDone=!0,this.syncMarkers()}saveToStorage(){try{localStorage.setItem(j.STORAGE_KEY,JSON.stringify(this.annotations))}catch(e){}}loadFromStorage(){try{let e=localStorage.getItem(j.STORAGE_KEY);e&&(this.annotations=JSON.parse(e))}catch(e){}}updatePolling(){if(!this.initialLoadDone)return;let e=this.totalActiveCount()>0;e&&!this.pollTimer?this.pollTimer=setInterval(()=>this.pollForChanges(),3e3):!e&&this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}async pollForChanges(){try{let e=await this.api.getAnnotations(),n=!1;for(let o of e){let r=this.annotations.find(i=>i.id===o.id);r&&r.status!==o.status&&(r.status=o.status,r.resolvedAt=o.resolvedAt,r.resolvedBy=o.resolvedBy,n=!0)}n&&this.saveToStorage(),this.syncMarkers()}catch(e){}}syncMarkers(){var o,r,i,s;(o=this.markers)==null||o.clear();let e=ct(),n=0;for(let a of this.annotations)a.status==="resolved"||a.status==="dismissed"||this.annotationPageKey(a)===e&&(n++,(r=this.markers)==null||r.upsert(a,n));(i=this.toolbar)==null||i.setAnnotationCount(this.pageAnnotations().length),(s=this.toolbar)==null||s.setTotalCount(this.totalActiveCount()),this.updatePolling()}annotationPageKey(e){try{return new URL(e.url).pathname}catch(n){return e.url}}pageAnnotations(){let e=ct();return this.annotations.filter(n=>this.annotationPageKey(n)===e&&n.status!=="resolved"&&n.status!=="dismissed")}totalActiveCount(){return this.annotations.filter(e=>e.status!=="resolved"&&e.status!=="dismissed").length}setAnnotating(e){var n,o;this.isAnnotating=e,(n=this.toolbar)==null||n.setAnnotateActive(e),e?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(o=this.highlight)==null||o.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)),this.updateFreezeStyles()}setFrozen(e){var n,o;if(this.isFrozen=e,(n=this.toolbar)==null||n.setFreezeActive(e),e){this.updateFreezeStyles(),this.freezePopovers();for(let r of this.freezeBlockEvents)window.addEventListener(r,this.boundFreezeClick,!0);window.addEventListener("submit",this.boundFreezeSubmit,!0);for(let r of this.freezePassiveEvents)window.addEventListener(r,this.boundFreezePassive,!0)}else{(o=this.frozenStyleEl)==null||o.remove(),this.frozenStyleEl=null,this.unfreezePopovers();for(let r of this.freezeBlockEvents)window.removeEventListener(r,this.boundFreezeClick,!0);window.removeEventListener("submit",this.boundFreezeSubmit,!0);for(let r of this.freezePassiveEvents)window.removeEventListener(r,this.boundFreezePassive,!0)}}freezePopovers(){this.frozenPopovers=[];let e=":popover-open, .\\:popover-open";document.querySelectorAll("[popover]").forEach(n=>{var a;let o=n,r=(a=o.getAttribute("popover"))!=null?a:"",i=!1;try{i=o.matches(e)}catch(c){try{i=o.matches(".\\:popover-open")}catch(d){}}if(!i)return;let s=o.getBoundingClientRect();this.frozenPopovers.push({el:o,original:r}),o.removeAttribute("popover"),o.style.setProperty("display","block","important"),o.style.setProperty("position","fixed","important"),o.style.setProperty("z-index","2147483644","important"),o.style.setProperty("top",`${s.top}px`,"important"),o.style.setProperty("left",`${s.left}px`,"important"),o.style.setProperty("width",`${s.width}px`,"important"),o.classList.add(":popover-open")})}unfreezePopovers(){for(let{el:e,original:n}of this.frozenPopovers){for(let o of["display","position","z-index","top","left","width"])e.style.removeProperty(o);e.classList.remove(":popover-open"),e.setAttribute("popover",n||"auto")}this.frozenPopovers=[]}updateFreezeStyles(){var n;if(!this.isFrozen)return;(n=this.frozenStyleEl)==null||n.remove(),this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze";let e=this.isAnnotating?"":`
        a[href], a[wire\\:navigate], [wire\\:click], [wire\\:navigate],
        [x-on\\:click], [@click], [v-on\\:click], [onclick],
        button, input[type="submit"], select, [role="button"], [role="link"],
        [tabindex] {
          pointer-events: none !important;
          cursor: not-allowed !important;
        }
      `;this.frozenStyleEl.textContent=`
        *, *::before, *::after {
          animation-play-state: paused !important;
          transition: none !important;
        }
        video { filter: none !important; }
        ${e}
      `,document.head.appendChild(this.frozenStyleEl)}showAnnotationPopup(e){var n;(n=this.popup)==null||n.showNew(e,{onSubmit:o=>{var r;this.highlightLocked=!1,(r=this.highlight)==null||r.hide(),this.submitAnnotation(e,o.comment,o.screenshot)},onCancel:()=>{var o;this.highlightLocked=!1,(o=this.highlight)==null||o.hide()}})}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave);for(let e of["mousedown","pointerdown"])window.addEventListener(e,this.boundAnnotateBlock,!0);window.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave);for(let e of["mousedown","pointerdown"])window.removeEventListener(e,this.boundAnnotateBlock,!0);window.removeEventListener("click",this.boundClick,!0)}isInstruckt(e){return!e||!(e instanceof Element)?!1:e.closest("[data-instruckt]")!==null}async startRegionCapture(){var c,d;let e=this.isAnnotating;e&&this.setAnnotating(!1);let n=await nt();if(!n){e&&this.setAnnotating(!0);return}let o=await tt(n);if(!o){e&&this.setAnnotating(!0);return}let r=n.x+n.width/2,i=n.y+n.height/2,s=(c=document.elementFromPoint(r,i))!=null?c:document.body,a={element:s,elementPath:he(s),elementName:pe(s),elementLabel:me(s),cssClasses:ge(s),boundingBox:be(s),x:r,y:i,nearbyText:fe(s)||void 0,screenshot:o,framework:(d=this.detectFramework(s))!=null?d:void 0};this.showAnnotationPopup(a)}detectFramework(e){var o;let n=(o=this.config.adapters)!=null?o:[];if(n.includes("livewire")){let r=ot(e);if(r)return r}if(n.includes("vue")){let r=it(e);if(r)return r}if(n.includes("svelte")){let r=st(e);if(r)return r}if(n.includes("react")){let r=at(e);if(r)return r}if(n.includes("blade")){let r=lt(e);if(r)return r}return null}async submitAnnotation(e,n,o){var s,a;let r={x:e.x/window.innerWidth*100,y:e.y+window.scrollY,comment:n,element:e.elementName,elementPath:e.elementPath,cssClasses:e.cssClasses,boundingBox:e.boundingBox,selectedText:e.selectedText,nearbyText:e.nearbyText,screenshot:o,intent:"fix",severity:"important",framework:e.framework,url:window.location.href},i;try{i=await this.api.addAnnotation(r)}catch(c){i=L(E({},r),{id:crypto.randomUUID(),status:"pending",createdAt:new Date().toISOString()})}this.annotations.push(i),this.saveToStorage(),this.syncMarkers(),(a=(s=this.config).onAnnotationAdd)==null||a.call(s,i),this.copyAnnotations()}onMarkerClick(e){var n;(n=this.popup)==null||n.showEdit(e,{onSave:async(o,r)=>{try{let i=await this.api.updateAnnotation(o.id,{comment:r});this.onAnnotationUpdated(i)}catch(i){this.onAnnotationUpdated(L(E({},o),{comment:r,updatedAt:new Date().toISOString()}))}},onDelete:async o=>{try{await this.api.updateAnnotation(o.id,{status:"dismissed"})}catch(r){}this.removeAnnotation(o.id)}},this.config.endpoint)}onAnnotationUpdated(e){let n=this.annotations.findIndex(o=>o.id===e.id);n>=0&&(this.annotations[n]=e),this.saveToStorage(),this.syncMarkers()}removeAnnotation(e){this.annotations=this.annotations.filter(n=>n.id!==e),this.saveToStorage(),this.syncMarkers()}async clearPage(){let e=this.pageAnnotations();for(let n of e)try{await this.api.updateAnnotation(n.id,{status:"dismissed"})}catch(o){}this.annotations=this.annotations.filter(n=>!e.includes(n)),this.saveToStorage(),this.syncMarkers()}async clearEverything(){let e=this.annotations.filter(n=>n.status!=="resolved"&&n.status!=="dismissed");for(let n of e)try{await this.api.updateAnnotation(n.id,{status:"dismissed"})}catch(o){}this.annotations=[],this.saveToStorage(),this.syncMarkers()}onKeydown(e){var i,s,a,c,d,l;if((i=this.toolbar)!=null&&i.isMinimized())return;let n=e.target;if(["INPUT","TEXTAREA","SELECT"].includes(n.tagName)||n.closest('[contenteditable="true"]')||this.isInstruckt(n))return;let o=(s=this.config.keys)!=null?s:{},r=!e.metaKey&&!e.ctrlKey&&!e.altKey;e.key===((a=o.annotate)!=null?a:"a")&&r&&this.setAnnotating(!this.isAnnotating),e.key===((c=o.freeze)!=null?c:"f")&&r&&this.setFrozen(!this.isFrozen),e.key===((d=o.screenshot)!=null?d:"c")&&r&&this.startRegionCapture(),e.key===((l=o.clearPage)!=null?l:"x")&&r&&this.clearPage(),e.key==="Escape"&&(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1))}copyAnnotations(){this.copyToClipboard(!1)}copyToClipboard(e){let n=this.exportMarkdown();if(window.isSecureContext)navigator.clipboard.writeText(n).catch(()=>{});else if(e)try{let o=document.createElement("textarea");o.value=n,o.style.cssText="position:fixed;left:-9999px",document.body.appendChild(o),o.select(),document.execCommand("copy"),o.remove()}catch(o){}}exportMarkdown(){let e=this.annotations.filter(s=>s.status!=="resolved"&&s.status!=="dismissed");if(e.length===0)return`# UI Feedback

No open annotations.`;let n=new Map;for(let s of e){let a=this.annotationPageKey(s);n.has(a)||n.set(a,[]),n.get(a).push(s)}let o=n.size>1,r=[];o&&(r.push("# UI Feedback"),r.push(""));for(let[s,a]of n){o?r.push(`## ${s}`):r.push(`# UI Feedback: ${s}`),r.push("");let c=o?"###":"##";a.forEach((d,l)=>{var h,f,g,p;let u=(h=d.framework)!=null&&h.component?` in \`${d.framework.component}\``:"";if(r.push(`${c} ${l+1}. ${d.comment}`),r.push(`- ID: \`${d.id}\``),r.push(`- Element: \`${d.element}\`${u}`),(f=d.framework)!=null&&f.source_file){let m=d.framework.source_line?`${d.framework.source_file}:${d.framework.source_line}`:d.framework.source_file;r.push(`- Source: \`${m}\``)}else(p=(g=d.framework)==null?void 0:g.data)!=null&&p.file&&r.push(`- File: \`${d.framework.data.file}\``);d.cssClasses&&r.push(`- Classes: \`${d.cssClasses}\``),d.selectedText?r.push(`- Text: "${d.selectedText}"`):d.nearbyText&&r.push(`- Text: "${d.nearbyText.slice(0,100)}"`),d.screenshot&&(d.screenshot.startsWith("data:")?r.push("- Screenshot: attached"):r.push(`- Screenshot: \`storage/app/_instruckt/${d.screenshot}\``)),r.push("")})}let i=e.some(s=>s.screenshot&&!s.screenshot.startsWith("data:"));return r.push("---"),r.push(""),i?r.push("Use the `instruckt.get_screenshot` MCP tool to view screenshots. After making changes, use `instruckt.resolve` to mark each annotation as resolved."):r.push("After making changes, use the `instruckt.resolve` MCP tool to mark each annotation as resolved."),r.join(`
`).trim()}getAnnotations(){return[...this.annotations]}destroy(){var e,n,o,r;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),window.removeEventListener("scroll",this.boundReposition),window.removeEventListener("resize",this.boundReposition),(e=this.toolbar)==null||e.destroy(),(n=this.highlight)==null||n.destroy(),(o=this.popup)==null||o.destroy(),(r=this.markers)==null||r.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId),this.pollTimer!==null&&clearInterval(this.pollTimer)}};j.STORAGE_KEY=`instruckt:${window.location.origin}:annotations`;var H=j;function no(t){return new H(t)}return gt(oo);})();
//# sourceMappingURL=instruckt.iife.js.map