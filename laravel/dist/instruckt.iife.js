/* instruckt v0.4.2 | MIT */
"use strict";var Instruckt=(()=>{var E=Object.defineProperty,X=Object.defineProperties,G=Object.getOwnPropertyDescriptor,Z=Object.getOwnPropertyDescriptors,Q=Object.getOwnPropertyNames,I=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,tt=Object.prototype.propertyIsEnumerable;var R=(i,t,e)=>t in i?E(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,A=(i,t)=>{for(var e in t||(t={}))O.call(t,e)&&R(i,e,t[e]);if(I)for(var e of I(t))tt.call(t,e)&&R(i,e,t[e]);return i},M=(i,t)=>X(i,Z(t));var et=(i,t)=>{for(var e in t)E(i,e,{get:t[e],enumerable:!0})},nt=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Q(t))!O.call(i,o)&&o!==e&&E(i,o,{get:()=>t[o],enumerable:!(n=G(t,o))||n.enumerable});return i};var ot=i=>nt(E({},"__esModule",{value:!0}),i);var kt={};et(kt,{Instruckt:()=>x,init:()=>bt});function it(){let i=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return i?decodeURIComponent(i[1]):""}function C(){let i={"Content-Type":"application/json",Accept:"application/json"},t=it();return t&&(i["X-XSRF-TOKEN"]=t),i}function g(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/_([a-z])/g,(r,a)=>a.toUpperCase());t[o]=Array.isArray(n)?n.map(r=>r&&typeof r=="object"&&!Array.isArray(r)?g(r):r):n&&typeof n=="object"&&!Array.isArray(n)?g(n):n}return t}function P(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/[A-Z]/g,r=>`_${r.toLowerCase()}`);t[o]=n&&typeof n=="object"&&!Array.isArray(n)?P(n):n}return t}var S=class{constructor(t){this.endpoint=t}async getAnnotations(){let t=await fetch(`${this.endpoint}/annotations`,{headers:C()});if(!t.ok)throw new Error(`instruckt: failed to load annotations (${t.status})`);return(await t.json()).map(n=>g(n))}async addAnnotation(t){let e=await fetch(`${this.endpoint}/annotations`,{method:"POST",headers:C(),body:JSON.stringify(P(t))});if(!e.ok)throw new Error(`instruckt: failed to add annotation (${e.status})`);return g(await e.json())}async updateAnnotation(t,e){let n=await fetch(`${this.endpoint}/annotations/${t}`,{method:"PATCH",headers:C(),body:JSON.stringify(P(e))});if(!n.ok)throw new Error(`instruckt: failed to update annotation (${n.status})`);return g(await n.json())}async addReply(t,e,n="human"){let o=await fetch(`${this.endpoint}/annotations/${t}/reply`,{method:"POST",headers:C(),body:JSON.stringify({role:n,content:e})});if(!o.ok)throw new Error(`instruckt: failed to add reply (${o.status})`);return g(await o.json())}};var st=`
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`,_=`
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
`,T=`
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
`,rt=`
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
`;function B(){if(document.getElementById("instruckt-global"))return;let i=document.createElement("style");i.id="instruckt-global",i.textContent=st+rt,document.head.appendChild(i)}var m={annotate:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',freeze:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',clear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',minimize:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>',logo:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>'},v=class{constructor(t,e){this.position=t;this.callbacks=e;this.fabBadge=null;this.annotateActive=!1;this.freezeActive=!1;this.minimized=!1;this.totalCount=0;this.dragging=!1;this.dragOffset={x:0,y:0};this.build(),this.setupDrag()}build(){var a;this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=_,this.shadow.appendChild(t),this.toolbarEl=document.createElement("div"),this.toolbarEl.className="toolbar",this.annotateBtn=this.makeBtn(m.annotate,"Annotate elements (A)",()=>{let s=!this.annotateActive;this.setAnnotateActive(s),this.callbacks.onToggleAnnotate(s)}),this.freezeBtn=this.makeBtn(m.freeze,"Freeze page (F)",()=>{let s=!this.freezeActive;this.setFreezeActive(s),this.callbacks.onFreezeAnimations(s)}),this.copyBtn=this.makeBtn(m.copy,"Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.innerHTML=m.check,setTimeout(()=>{this.copyBtn.innerHTML=m.copy},1200)});let e=this.makeBtn(m.clear,"Clear all annotations on this page",()=>{var s,l;(l=(s=this.callbacks).onClearAll)==null||l.call(s)});e.classList.add("danger-btn");let n=this.makeBtn(m.minimize,"Minimize toolbar",()=>{this.setMinimized(!0)});n.classList.add("minimize-btn");let o=()=>{let s=document.createElement("div");return s.className="divider",s};this.toolbarEl.append(this.annotateBtn,o(),this.freezeBtn,o(),this.copyBtn,e,o(),n),this.shadow.appendChild(this.toolbarEl),this.fab=document.createElement("button"),this.fab.className="fab",this.fab.title="Open instruckt toolbar",this.fab.setAttribute("aria-label","Open instruckt toolbar"),this.fab.innerHTML=m.logo,this.fab.style.display="none",this.fab.addEventListener("click",s=>{s.stopPropagation(),this.setMinimized(!1)}),this.shadow.appendChild(this.fab),this.host.addEventListener("click",s=>s.stopPropagation()),this.host.addEventListener("mousedown",s=>s.stopPropagation()),this.host.addEventListener("pointerdown",s=>s.stopPropagation()),this.applyPosition(),((a=document.getElementById("instruckt-root"))!=null?a:document.body).appendChild(this.host)}makeBtn(t,e,n){let o=document.createElement("button");return o.className="btn",o.title=e,o.setAttribute("aria-label",e),o.innerHTML=t,o.addEventListener("click",r=>{r.stopPropagation(),n()}),o}applyPosition(){let t="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?t:"auto",top:this.position.includes("top")?t:"auto",right:this.position.includes("right")?t:"auto",left:this.position.includes("left")?t:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",t=>{let e=t;if(e.target.closest(".btn")||e.target.closest(".fab"))return;this.dragging=!0;let n=this.host.getBoundingClientRect();this.dragOffset={x:e.clientX-n.left,y:e.clientY-n.top},e.preventDefault()}),document.addEventListener("mousemove",t=>{this.dragging&&Object.assign(this.host.style,{left:`${t.clientX-this.dragOffset.x}px`,top:`${t.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMinimized(t){var e,n;this.minimized=t,this.toolbarEl.style.display=t?"none":"",this.fab.style.display=t?"":"none",this.updateFabBadge(),(n=(e=this.callbacks).onMinimize)==null||n.call(e,t)}updateFabBadge(){var t;this.totalCount>0&&this.minimized?(this.fabBadge||(this.fabBadge=document.createElement("span"),this.fabBadge.className="fab-badge",this.fab.appendChild(this.fabBadge)),this.fabBadge.textContent=this.totalCount>99?"99+":String(this.totalCount)):((t=this.fabBadge)==null||t.remove(),this.fabBadge=null)}isMinimized(){return this.minimized}minimize(){this.minimized=!0,this.toolbarEl.style.display="none",this.fab.style.display="",this.updateFabBadge()}setAnnotateActive(t){this.annotateActive=t,this.annotateBtn.classList.toggle("active",t),document.body.classList.toggle("ik-annotating",t)}setFreezeActive(t){this.freezeActive=t,this.freezeBtn.classList.toggle("active",t)}setMode(t){this.setAnnotateActive(t==="annotating")}setAnnotationCount(t){let e=this.annotateBtn.querySelector(".badge");t>0?(e||(e=document.createElement("span"),e.className="badge",this.annotateBtn.appendChild(e)),e.textContent=t>99?"99+":String(t)):e==null||e.remove()}setTotalCount(t){this.totalCount=t,this.updateFabBadge()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var b=class{constructor(){var e;this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),((e=document.getElementById("instruckt-root"))!=null?e:document.body).appendChild(this.el)}show(t){let e=t.getBoundingClientRect();if(e.width===0&&e.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function f(i){return String(i!=null?i:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var z=class{constructor(){this.host=null;this.shadow=null;this.boundOutside=t=>{this.host&&!this.host.contains(t.target)&&this.destroy()}}showNew(t,e){var p;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=T,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let r=t.framework?`<div class="fw-badge">${f(t.framework.component)}</div>`:"",a=t.selectedText?`<div class="selected-text">"${f(t.selectedText.slice(0,80))}"</div>`:"";o.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${f(t.elementPath)}">${f(t.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${r}${a}
      <textarea placeholder="What needs to change here?" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `;let s=o.querySelector("textarea"),l=o.querySelector('[data-action="submit"]');s.addEventListener("input",()=>{l.disabled=s.value.trim().length===0}),s.addEventListener("keydown",d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),l.disabled||l.click()),d.key==="Escape"&&(e.onCancel(),this.destroy())}),o.querySelector('[data-action="cancel"]').addEventListener("click",()=>{e.onCancel(),this.destroy()}),o.querySelector(".close-btn").addEventListener("click",()=>{e.onCancel(),this.destroy()}),l.addEventListener("click",()=>{let d=s.value.trim();d&&(e.onSubmit({comment:d}),this.destroy())}),this.shadow.appendChild(o),((p=document.getElementById("instruckt-root"))!=null?p:document.body).appendChild(this.host),this.positionHost(t.x,t.y),this.setupOutsideClick(),s.focus()}showEdit(t,e){var u;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=T,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let r=t.framework?`<div class="fw-badge">${f(t.framework.component)}</div>`:"";o.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${f(t.elementPath)}">${f(t.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${r}
      <textarea rows="3">${f(t.comment)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `,o.querySelector(".close-btn").addEventListener("click",()=>this.destroy());let a=o.querySelector("textarea"),s=o.querySelector('[data-action="save"]'),l=o.querySelector('[data-action="delete"]');a.addEventListener("keydown",c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),s.click()),c.key==="Escape"&&this.destroy()}),s.addEventListener("click",()=>{let c=a.value.trim();c&&(e.onSave(t,c),this.destroy())}),l.addEventListener("click",()=>{e.onDelete(t),this.destroy()}),this.shadow.appendChild(o),((u=document.getElementById("instruckt-root"))!=null?u:document.body).appendChild(this.host);let p=t.x/100*window.innerWidth,d=t.y-window.scrollY;this.positionHost(p,d),this.setupOutsideClick(),a.focus(),a.setSelectionRange(a.value.length,a.value.length)}stopHostPropagation(t){for(let e of["click","mousedown","pointerdown"])t.addEventListener(e,n=>n.stopPropagation())}positionHost(t,e){if(this.host){this.host.setAttribute("popover","manual");try{this.host.showPopover()}catch(n){}Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var p,d;if(!this.host)return;let n=360,o=(d=(p=this.host.querySelector(".popup"))==null?void 0:p.getBoundingClientRect().height)!=null?d:300,r=window.innerWidth,a=window.innerHeight,s=Math.max(10,Math.min(t+10,r-n)),l=Math.max(10,Math.min(e+10,a-o-10));Object.assign(this.host.style,{left:`${s}px`,top:`${l}px`})})}}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var t;(t=this.host)==null||t.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var k=class{constructor(t){this.onClick=t;this.markers=new Map;var n;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),((n=document.getElementById("instruckt-root"))!=null?n:document.body).appendChild(this.container)}upsert(t,e){let n=this.markers.get(t.id);if(n){this.updateStyle(n.el,t);return}let o=document.createElement("div");o.className=`ik-marker ${this.statusClass(t.status)}`,o.textContent=String(e),o.title=t.comment.slice(0,60),o.style.pointerEvents="all",o.style.left=`${t.x/100*window.innerWidth}px`,o.style.top=`${t.y-window.scrollY}px`,o.addEventListener("click",r=>{r.stopPropagation(),this.onClick(t)}),this.container.appendChild(o),this.markers.set(t.id,{el:o,annotationId:t.id})}update(t){let e=this.markers.get(t.id);e&&this.updateStyle(e.el,t)}updateStyle(t,e){t.className=`ik-marker ${this.statusClass(e.status)}`,t.title=e.comment.slice(0,60)}statusClass(t){return t==="resolved"?"resolved":t==="dismissed"?"dismissed":t==="acknowledged"?"acknowledged":""}reposition(t){t.forEach(e=>{let n=this.markers.get(e.id);n&&(n.el.style.left=`${e.x/100*window.innerWidth}px`,n.el.style.top=`${e.y-window.scrollY}px`)})}remove(t){let e=this.markers.get(t);e&&(e.el.remove(),this.markers.delete(t))}setVisible(t){this.container.style.display=t?"":"none"}clear(){for(let{el:t}of this.markers.values())t.remove();this.markers.clear()}destroy(){this.container.remove(),this.markers.clear()}};function N(i){if(i.id)return`#${CSS.escape(i.id)}`;let t=[],e=i;for(;e&&e!==document.documentElement;){let n=e.tagName.toLowerCase(),o=e.parentElement;if(!o){t.unshift(n);break}let r=Array.from(e.classList).filter(s=>!s.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(r.length>0){let s=`${n}.${r.map(CSS.escape).join(".")}`;if(o.querySelectorAll(s).length===1){t.unshift(s);break}}let a=Array.from(o.children).filter(s=>s.tagName===e.tagName);if(a.length===1)t.unshift(n);else{let s=a.indexOf(e)+1;t.unshift(`${n}:nth-of-type(${s})`)}e=o}return t.join(" > ")}function j(i){let t=i.tagName.toLowerCase(),e=i.getAttribute("wire:model")||i.getAttribute("wire:click");if(e)return`${t}[wire:${e.split(".")[0]}]`;if(i.id)return`${t}#${i.id}`;let n=i.classList[0];return n?`${t}.${n}`:t}function H(i){let t=i.tagName.toLowerCase(),e=(i.textContent||"").trim().replace(/\s+/g," ").slice(0,40),n=[];i.id&&n.push(`id="${i.id}"`);let o=i.getAttribute("role");o&&n.push(`role="${o}"`);let r=i.getAttribute("wire:model")||i.getAttribute("wire:click");r&&n.push(`wire:${i.hasAttribute("wire:model")?"model":"click"}="${r}"`);let a=n.length?" "+n.join(" "):"",s=`<${t}${a}>`;return e?`${s} ${e}`:s}function K(i){return(i.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function U(i){return Array.from(i.classList).filter(t=>!t.match(/^(instruckt-)/)).join(" ")}function q(i){let t=i.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function at(){return typeof window.Livewire!="undefined"}function lt(i){let t=i;for(;t&&t!==document.documentElement;){if(t.getAttribute("wire:id"))return t;t=t.parentElement}return null}function D(i){var r,a;if(!at())return null;let t=lt(i);if(!t)return null;let e=t.getAttribute("wire:id"),n="Unknown",o=t.getAttribute("wire:snapshot");if(o)try{let s=JSON.parse(o);n=(a=(r=s==null?void 0:s.memo)==null?void 0:r.name)!=null?a:"Unknown"}catch(s){}return{framework:"livewire",component:n,wire_id:e}}function ct(i){var e;let t=i;for(;t&&t!==document.documentElement;){let n=(e=t.__vueParentComponent)!=null?e:t.__vue__;if(n)return n;t=t.parentElement}return null}function V(i){var o,r,a,s,l,p,d,u;let t=ct(i);if(!t)return null;let e=(u=(d=(l=(a=(o=t.$options)==null?void 0:o.name)!=null?a:(r=t.$options)==null?void 0:r.__name)!=null?l:(s=t.type)==null?void 0:s.name)!=null?d:(p=t.type)==null?void 0:p.__name)!=null?u:"Anonymous",n={};if(t.props&&Object.assign(n,t.props),t.setupState){for(let[c,h]of Object.entries(t.setupState))if(!c.startsWith("_")&&typeof h!="function")try{n[c]=JSON.parse(JSON.stringify(h))}catch(L){n[c]=String(h)}}return{framework:"vue",component:e,component_uid:t.uid!==void 0?String(t.uid):void 0,data:n}}function ut(i){let t=i;for(;t&&t!==document.documentElement;){if(t.__svelte_meta)return t.__svelte_meta;t=t.parentElement}return null}function Y(i){var o,r,a,s;let t=ut(i);if(!t)return null;let e=(r=(o=t.loc)==null?void 0:o.file)!=null?r:"";return{framework:"svelte",component:e&&(s=(a=e.split("/").pop())==null?void 0:a.replace(/\.svelte$/,""))!=null?s:"Unknown",data:e?{file:e}:void 0}}function mt(i){for(let t of Object.keys(i))if(t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$"))return t;return null}function ft(i){let t=i;for(;t;){let{type:e}=t;if(typeof e=="function"&&e.name){let n=e.name;if(n[0]===n[0].toUpperCase()&&n.length>1)return n}if(typeof e=="object"&&e!==null&&e.displayName)return e.displayName;t=t.return}return"Component"}function gt(i){var n,o;let t=(o=(n=i.memoizedProps)!=null?n:i.pendingProps)!=null?o:{},e={};for(let[r,a]of Object.entries(t))if(!(r==="children"||typeof a=="function"))try{e[r]=JSON.parse(JSON.stringify(a))}catch(s){e[r]=String(a)}return e}function J(i){let t=i;for(;t&&t!==document.documentElement;){let e=mt(t);if(e){let n=t[e];if(n){let o=ft(n),r=gt(n);return{framework:"react",component:o,data:r}}}t=t.parentElement}return null}function W(){return window.location.pathname}var y=class y{constructor(t){this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.frozenPopovers=[];this.rafId=null;this.pendingMouseTarget=null;this.highlightLocked=!1;this.freezeBlockEvents=["click","mousedown","pointerdown","pointerup","mouseup","touchstart","touchend","auxclick"];this.freezePassiveEvents=["focusin","focusout","blur","pointerleave","mouseleave","mouseout"];this.boundFreezeClick=t=>{this.isInstruckt(t.target)||this.isAnnotating&&t.type==="click"||(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation())};this.boundFreezeSubmit=t=>{t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation()};this.boundFreezePassive=t=>{t.stopPropagation(),t.stopImmediatePropagation()};this.boundMouseMove=t=>{this.highlightLocked||(this.pendingMouseTarget=t.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var e,n;this.rafId=null,!this.highlightLocked&&(this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(e=this.highlight)==null||e.show(this.pendingMouseTarget):(n=this.highlight)==null||n.hide())})))};this.boundMouseLeave=()=>{var t;this.highlightLocked||(t=this.highlight)==null||t.hide()};this.boundClick=t=>{var c,h,L,F;let e=t.target;if(this.isInstruckt(e))return;t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation();let n=((c=window.getSelection())==null?void 0:c.toString().trim())||void 0,o=N(e),r=j(e),a=H(e),s=U(e),l=K(e)||void 0,p=q(e),d=(h=this.detectFramework(e))!=null?h:void 0,u={element:e,elementPath:o,elementName:r,elementLabel:a,cssClasses:s,boundingBox:p,x:t.clientX,y:t.clientY,selectedText:n,nearbyText:l,framework:d};(L=this.highlight)==null||L.show(e),this.highlightLocked=!0,(F=this.popup)==null||F.showNew(u,{onSubmit:w=>{var $;this.highlightLocked=!1,($=this.highlight)==null||$.hide(),this.submitAnnotation(u,w.comment)},onCancel:()=>{var w;this.highlightLocked=!1,(w=this.highlight)==null||w.hide()}})};this.config=A({adapters:["livewire","vue","svelte","react"],theme:"auto",position:"bottom-right"},t),this.api=new S(t.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.init()}init(){B(),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new v(this.config.position,{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onCopy:()=>this.copyAnnotations(),onClearAll:()=>this.clearAll(),onMinimize:t=>this.onMinimize(t)}),this.highlight=new b,this.popup=new z,this.markers=new k(t=>this.onMarkerClick(t)),document.addEventListener("keydown",this.boundKeydown),document.addEventListener("livewire:navigated",()=>this.reattach()),window.addEventListener("popstate",()=>{setTimeout(()=>this.reattach(),0)}),this.loadAnnotations(),this.syncMarkers()}makeToolbarCallbacks(){return{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onCopy:()=>this.copyAnnotations(),onClearAll:()=>this.clearAll(),onMinimize:t=>this.onMinimize(t)}}reattach(){var r,a;let t=this.isAnnotating,e=this.isFrozen,n=(a=(r=this.toolbar)==null?void 0:r.isMinimized())!=null?a:!1;this.isAnnotating&&this.detachAnnotateListeners(),this.isFrozen&&this.setFrozen(!1),this.isAnnotating=!1,this.isFrozen=!1,document.querySelectorAll("[data-instruckt]").forEach(s=>s.remove()),this.toolbar=new v(this.config.position,this.makeToolbarCallbacks()),n&&this.toolbar.minimize(),this.markers=new k(s=>this.onMarkerClick(s)),this.highlight=new b,n&&this.markers.setVisible(!1);let o=document.getElementById("instruckt-global");o&&o.remove(),B(),this.syncMarkers(),t&&!n&&this.setAnnotating(!0)}onMinimize(t){var e,n,o,r,a;t?(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1),(e=this.toolbar)==null||e.setAnnotateActive(!1),(n=this.toolbar)==null||n.setFreezeActive(!1),(o=this.markers)==null||o.setVisible(!1),(r=this.popup)==null||r.destroy()):(a=this.markers)==null||a.setVisible(!0)}async loadAnnotations(){try{let t=await this.api.getAnnotations();this.annotations=t,this.saveToStorage()}catch(t){this.loadFromStorage()}this.syncMarkers()}saveToStorage(){try{localStorage.setItem(y.STORAGE_KEY,JSON.stringify(this.annotations))}catch(t){}}loadFromStorage(){try{let t=localStorage.getItem(y.STORAGE_KEY);t&&(this.annotations=JSON.parse(t))}catch(t){}}syncMarkers(){var n,o,r,a;(n=this.markers)==null||n.clear();let t=W(),e=0;for(let s of this.annotations)s.status==="resolved"||s.status==="dismissed"||this.annotationPageKey(s)===t&&(e++,(o=this.markers)==null||o.upsert(s,e));(r=this.toolbar)==null||r.setAnnotationCount(this.pageAnnotations().length),(a=this.toolbar)==null||a.setTotalCount(this.totalActiveCount())}annotationPageKey(t){try{return new URL(t.url).pathname}catch(e){return t.url}}pageAnnotations(){let t=W();return this.annotations.filter(e=>this.annotationPageKey(e)===t&&e.status!=="resolved"&&e.status!=="dismissed")}totalActiveCount(){return this.annotations.filter(t=>t.status!=="resolved"&&t.status!=="dismissed").length}setAnnotating(t){var e,n;this.isAnnotating=t,(e=this.toolbar)==null||e.setAnnotateActive(t),t?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(n=this.highlight)==null||n.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)),this.updateFreezeStyles()}setFrozen(t){var e,n;if(this.isFrozen=t,(e=this.toolbar)==null||e.setFreezeActive(t),t){this.updateFreezeStyles(),this.freezePopovers();for(let o of this.freezeBlockEvents)window.addEventListener(o,this.boundFreezeClick,!0);window.addEventListener("submit",this.boundFreezeSubmit,!0);for(let o of this.freezePassiveEvents)window.addEventListener(o,this.boundFreezePassive,!0)}else{(n=this.frozenStyleEl)==null||n.remove(),this.frozenStyleEl=null,this.unfreezePopovers();for(let o of this.freezeBlockEvents)window.removeEventListener(o,this.boundFreezeClick,!0);window.removeEventListener("submit",this.boundFreezeSubmit,!0);for(let o of this.freezePassiveEvents)window.removeEventListener(o,this.boundFreezePassive,!0)}}freezePopovers(){this.frozenPopovers=[];let t=":popover-open, .\\:popover-open";document.querySelectorAll("[popover]").forEach(e=>{var s;let n=e,o=(s=n.getAttribute("popover"))!=null?s:"",r=!1;try{r=n.matches(t)}catch(l){try{r=n.matches(".\\:popover-open")}catch(p){}}if(!r)return;let a=n.getBoundingClientRect();this.frozenPopovers.push({el:n,original:o}),n.removeAttribute("popover"),n.style.setProperty("display","block","important"),n.style.setProperty("position","fixed","important"),n.style.setProperty("z-index","2147483644","important"),n.style.setProperty("top",`${a.top}px`,"important"),n.style.setProperty("left",`${a.left}px`,"important"),n.style.setProperty("width",`${a.width}px`,"important"),n.classList.add(":popover-open")})}unfreezePopovers(){for(let{el:t,original:e}of this.frozenPopovers){for(let n of["display","position","z-index","top","left","width"])t.style.removeProperty(n);t.classList.remove(":popover-open"),t.setAttribute("popover",e||"auto")}this.frozenPopovers=[]}updateFreezeStyles(){var e;if(!this.isFrozen)return;(e=this.frozenStyleEl)==null||e.remove(),this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze";let t=this.isAnnotating?"":`
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
        ${t}
      `,document.head.appendChild(this.frozenStyleEl)}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave),window.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave),window.removeEventListener("click",this.boundClick,!0)}isInstruckt(t){return!t||!(t instanceof Element)?!1:t.closest("[data-instruckt]")!==null}detectFramework(t){var n;let e=(n=this.config.adapters)!=null?n:[];if(e.includes("livewire")){let o=D(t);if(o)return o}if(e.includes("vue")){let o=V(t);if(o)return o}if(e.includes("svelte")){let o=Y(t);if(o)return o}if(e.includes("react")){let o=J(t);if(o)return o}return null}async submitAnnotation(t,e){var r,a;let n={x:t.x/window.innerWidth*100,y:t.y+window.scrollY,comment:e,element:t.elementName,elementPath:t.elementPath,cssClasses:t.cssClasses,boundingBox:t.boundingBox,selectedText:t.selectedText,nearbyText:t.nearbyText,intent:"fix",severity:"important",framework:t.framework,url:window.location.href},o;try{o=await this.api.addAnnotation(n)}catch(s){o=M(A({},n),{id:crypto.randomUUID(),status:"pending",thread:[],createdAt:new Date().toISOString()})}this.annotations.push(o),this.saveToStorage(),this.syncMarkers(),(a=(r=this.config).onAnnotationAdd)==null||a.call(r,o),this.copyAnnotations()}onMarkerClick(t){var e;(e=this.popup)==null||e.showEdit(t,{onSave:async(n,o)=>{try{let r=await this.api.updateAnnotation(n.id,{comment:o});this.onAnnotationUpdated(r)}catch(r){this.onAnnotationUpdated(M(A({},n),{comment:o,updatedAt:new Date().toISOString()}))}},onDelete:async n=>{try{await this.api.updateAnnotation(n.id,{status:"dismissed"})}catch(o){}this.removeAnnotation(n.id)}})}onAnnotationUpdated(t){let e=this.annotations.findIndex(n=>n.id===t.id);e>=0&&(this.annotations[e]=t),this.saveToStorage(),this.syncMarkers()}removeAnnotation(t){this.annotations=this.annotations.filter(e=>e.id!==t),this.saveToStorage(),this.syncMarkers()}async clearAll(){let t=this.pageAnnotations();for(let e of t)try{await this.api.updateAnnotation(e.id,{status:"dismissed"})}catch(n){}this.annotations=this.annotations.filter(e=>!t.includes(e)),this.saveToStorage(),this.syncMarkers()}onKeydown(t){var n;if((n=this.toolbar)!=null&&n.isMinimized())return;let e=t.target;["INPUT","TEXTAREA","SELECT"].includes(e.tagName)||e.closest('[contenteditable="true"]')||this.isInstruckt(e)||(t.key==="a"&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&this.setAnnotating(!this.isAnnotating),t.key==="f"&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&this.setFrozen(!this.isFrozen),t.key==="Escape"&&(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1)))}copyAnnotations(){let t=this.exportMarkdown();navigator.clipboard.writeText(t).catch(()=>{let e=document.createElement("textarea");e.value=t,e.style.cssText="position:fixed;left:-9999px",document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove()})}exportMarkdown(){let t=this.annotations.filter(r=>r.status!=="resolved"&&r.status!=="dismissed");if(t.length===0)return`# UI Feedback

No open annotations.`;let e=new Map;for(let r of t){let a=this.annotationPageKey(r);e.has(a)||e.set(a,[]),e.get(a).push(r)}let n=e.size>1,o=[];n&&(o.push("# UI Feedback"),o.push(""));for(let[r,a]of e){n?o.push(`## ${r}`):o.push(`# UI Feedback: ${r}`),o.push("");let s=n?"###":"##";a.forEach((l,p)=>{var u,c,h;let d=(u=l.framework)!=null&&u.component?` in \`${l.framework.component}\``:"";o.push(`${s} ${p+1}. ${l.comment}`),o.push(`- Element: \`${l.element}\`${d}`),(h=(c=l.framework)==null?void 0:c.data)!=null&&h.file&&o.push(`- File: \`${l.framework.data.file}\``),l.cssClasses&&o.push(`- Classes: \`${l.cssClasses}\``),l.selectedText?o.push(`- Text: "${l.selectedText}"`):l.nearbyText&&o.push(`- Text: "${l.nearbyText.slice(0,100)}"`),o.push("")})}return o.join(`
`).trim()}getAnnotations(){return[...this.annotations]}destroy(){var t,e,n,o;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),(t=this.toolbar)==null||t.destroy(),(e=this.highlight)==null||e.destroy(),(n=this.popup)==null||n.destroy(),(o=this.markers)==null||o.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId)}};y.STORAGE_KEY="instruckt:annotations";var x=y;function bt(i){return new x(i)}return ot(kt);})();
//# sourceMappingURL=instruckt.iife.js.map