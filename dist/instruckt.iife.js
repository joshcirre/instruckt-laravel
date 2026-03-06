/* instruckt v0.4.3 | MIT */
"use strict";var Instruckt=(()=>{var E=Object.defineProperty,X=Object.defineProperties,G=Object.getOwnPropertyDescriptor,Z=Object.getOwnPropertyDescriptors,Q=Object.getOwnPropertyNames,I=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,tt=Object.prototype.propertyIsEnumerable;var R=(i,t,e)=>t in i?E(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,A=(i,t)=>{for(var e in t||(t={}))O.call(t,e)&&R(i,e,t[e]);if(I)for(var e of I(t))tt.call(t,e)&&R(i,e,t[e]);return i},P=(i,t)=>X(i,Z(t));var et=(i,t)=>{for(var e in t)E(i,e,{get:t[e],enumerable:!0})},nt=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Q(t))!O.call(i,o)&&o!==e&&E(i,o,{get:()=>t[o],enumerable:!(n=G(t,o))||n.enumerable});return i};var ot=i=>nt(E({},"__esModule",{value:!0}),i);var kt={};et(kt,{Instruckt:()=>x,init:()=>bt});function it(){let i=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return i?decodeURIComponent(i[1]):""}function C(){let i={"Content-Type":"application/json",Accept:"application/json"},t=it();return t&&(i["X-XSRF-TOKEN"]=t),i}function f(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/_([a-z])/g,(s,r)=>r.toUpperCase());t[o]=Array.isArray(n)?n.map(s=>s&&typeof s=="object"&&!Array.isArray(s)?f(s):s):n&&typeof n=="object"&&!Array.isArray(n)?f(n):n}return t}function M(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/[A-Z]/g,s=>`_${s.toLowerCase()}`);t[o]=n&&typeof n=="object"&&!Array.isArray(n)?M(n):n}return t}var S=class{constructor(t){this.endpoint=t}async getAnnotations(){let t=await fetch(`${this.endpoint}/annotations`,{headers:C()});if(!t.ok)throw new Error(`instruckt: failed to load annotations (${t.status})`);return(await t.json()).map(n=>f(n))}async addAnnotation(t){let e=await fetch(`${this.endpoint}/annotations`,{method:"POST",headers:C(),body:JSON.stringify(M(t))});if(!e.ok)throw new Error(`instruckt: failed to add annotation (${e.status})`);return f(await e.json())}async updateAnnotation(t,e){let n=await fetch(`${this.endpoint}/annotations/${t}`,{method:"PATCH",headers:C(),body:JSON.stringify(M(e))});if(!n.ok)throw new Error(`instruckt: failed to update annotation (${n.status})`);return f(await n.json())}async addReply(t,e,n="human"){let o=await fetch(`${this.endpoint}/annotations/${t}/reply`,{method:"POST",headers:C(),body:JSON.stringify({role:n,content:e})});if(!o.ok)throw new Error(`instruckt: failed to add reply (${o.status})`);return f(await o.json())}};var st=`
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
`;function B(){if(document.getElementById("instruckt-global"))return;let i=document.createElement("style");i.id="instruckt-global",i.textContent=st+rt,document.head.appendChild(i)}var m={annotate:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',freeze:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',clear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',minimize:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>',logo:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>'},v=class{constructor(t,e){this.position=t;this.callbacks=e;this.fabBadge=null;this.annotateActive=!1;this.freezeActive=!1;this.minimized=!1;this.totalCount=0;this.dragging=!1;this.dragOffset={x:0,y:0};this.build(),this.setupDrag()}build(){var d;this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=_,this.shadow.appendChild(t),this.toolbarEl=document.createElement("div"),this.toolbarEl.className="toolbar",this.annotateBtn=this.makeBtn(m.annotate,"Annotate elements (A)",()=>{let l=!this.annotateActive;this.setAnnotateActive(l),this.callbacks.onToggleAnnotate(l)}),this.freezeBtn=this.makeBtn(m.freeze,"Freeze page (F)",()=>{let l=!this.freezeActive;this.setFreezeActive(l),this.callbacks.onFreezeAnimations(l)}),this.copyBtn=this.makeBtn(m.copy,"Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.innerHTML=m.check,setTimeout(()=>{this.copyBtn.innerHTML=m.copy},1200)});let e=document.createElement("div");e.className="clear-wrap";let n=this.makeBtn(m.clear,"Clear this page (X)",()=>{var l,c;(c=(l=this.callbacks).onClearPage)==null||c.call(l)});n.classList.add("danger-btn");let o=this.makeBtn('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',"Clear ALL annotations across every page",()=>{var l,c;return(c=(l=this.callbacks).onClearAll)==null?void 0:c.call(l)});o.classList.add("danger-btn","clear-all-btn"),e.appendChild(n),e.appendChild(o);let s=this.makeBtn(m.minimize,"Minimize toolbar",()=>{this.setMinimized(!0)});s.classList.add("minimize-btn");let r=()=>{let l=document.createElement("div");return l.className="divider",l};this.toolbarEl.append(this.annotateBtn,r(),this.freezeBtn,r(),this.copyBtn,e,r(),s),this.shadow.appendChild(this.toolbarEl),this.fab=document.createElement("button"),this.fab.className="fab",this.fab.title="Open instruckt toolbar",this.fab.setAttribute("aria-label","Open instruckt toolbar"),this.fab.innerHTML=m.logo,this.fab.style.display="none",this.fab.addEventListener("click",l=>{l.stopPropagation(),this.setMinimized(!1)}),this.shadow.appendChild(this.fab),this.host.addEventListener("click",l=>l.stopPropagation()),this.host.addEventListener("mousedown",l=>l.stopPropagation()),this.host.addEventListener("pointerdown",l=>l.stopPropagation()),this.applyPosition(),((d=document.getElementById("instruckt-root"))!=null?d:document.body).appendChild(this.host)}makeBtn(t,e,n){let o=document.createElement("button");return o.className="btn",o.title=e,o.setAttribute("aria-label",e),o.innerHTML=t,o.addEventListener("click",s=>{s.stopPropagation(),n()}),o}applyPosition(){let t="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?t:"auto",top:this.position.includes("top")?t:"auto",right:this.position.includes("right")?t:"auto",left:this.position.includes("left")?t:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",t=>{let e=t;if(e.target.closest(".btn")||e.target.closest(".fab"))return;this.dragging=!0;let n=this.host.getBoundingClientRect();this.dragOffset={x:e.clientX-n.left,y:e.clientY-n.top},e.preventDefault()}),document.addEventListener("mousemove",t=>{this.dragging&&Object.assign(this.host.style,{left:`${t.clientX-this.dragOffset.x}px`,top:`${t.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMinimized(t){var e,n;this.minimized=t,this.toolbarEl.style.display=t?"none":"",this.fab.style.display=t?"":"none",this.updateFabBadge(),(n=(e=this.callbacks).onMinimize)==null||n.call(e,t)}updateFabBadge(){var t;this.totalCount>0&&this.minimized?(this.fabBadge||(this.fabBadge=document.createElement("span"),this.fabBadge.className="fab-badge",this.fab.appendChild(this.fabBadge)),this.fabBadge.textContent=this.totalCount>99?"99+":String(this.totalCount)):((t=this.fabBadge)==null||t.remove(),this.fabBadge=null)}isMinimized(){return this.minimized}minimize(){this.minimized=!0,this.toolbarEl.style.display="none",this.fab.style.display="",this.updateFabBadge()}setAnnotateActive(t){this.annotateActive=t,this.annotateBtn.classList.toggle("active",t),document.body.classList.toggle("ik-annotating",t)}setFreezeActive(t){this.freezeActive=t,this.freezeBtn.classList.toggle("active",t)}setMode(t){this.setAnnotateActive(t==="annotating")}setAnnotationCount(t){let e=this.annotateBtn.querySelector(".badge");t>0?(e||(e=document.createElement("span"),e.className="badge",this.annotateBtn.appendChild(e)),e.textContent=t>99?"99+":String(t)):e==null||e.remove()}setTotalCount(t){this.totalCount=t,this.updateFabBadge()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var b=class{constructor(){var e;this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),((e=document.getElementById("instruckt-root"))!=null?e:document.body).appendChild(this.el)}show(t){let e=t.getBoundingClientRect();if(e.width===0&&e.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function g(i){return String(i!=null?i:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var z=class{constructor(){this.host=null;this.shadow=null;this.boundOutside=t=>{this.host&&!this.host.contains(t.target)&&this.destroy()}}showNew(t,e){var l;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=T,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let s=t.framework?`<div class="fw-badge">${g(t.framework.component)}</div>`:"",r=t.selectedText?`<div class="selected-text">"${g(t.selectedText.slice(0,80))}"</div>`:"";o.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${g(t.elementPath)}">${g(t.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${s}${r}
      <textarea placeholder="What needs to change here?" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `;let a=o.querySelector("textarea"),d=o.querySelector('[data-action="submit"]');a.addEventListener("input",()=>{d.disabled=a.value.trim().length===0}),a.addEventListener("keydown",c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),d.disabled||d.click()),c.key==="Escape"&&(e.onCancel(),this.destroy())}),o.querySelector('[data-action="cancel"]').addEventListener("click",()=>{e.onCancel(),this.destroy()}),o.querySelector(".close-btn").addEventListener("click",()=>{e.onCancel(),this.destroy()}),d.addEventListener("click",()=>{let c=a.value.trim();c&&(e.onSubmit({comment:c}),this.destroy())}),this.shadow.appendChild(o),((l=document.getElementById("instruckt-root"))!=null?l:document.body).appendChild(this.host),this.positionHost(t.x,t.y),this.setupOutsideClick(),a.focus()}showEdit(t,e){var h;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=T,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let s=t.framework?`<div class="fw-badge">${g(t.framework.component)}</div>`:"";o.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${g(t.elementPath)}">${g(t.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${s}
      <textarea rows="3">${g(t.comment)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `,o.querySelector(".close-btn").addEventListener("click",()=>this.destroy());let r=o.querySelector("textarea"),a=o.querySelector('[data-action="save"]'),d=o.querySelector('[data-action="delete"]');r.addEventListener("keydown",p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),a.click()),p.key==="Escape"&&this.destroy()}),a.addEventListener("click",()=>{let p=r.value.trim();p&&(e.onSave(t,p),this.destroy())}),d.addEventListener("click",()=>{e.onDelete(t),this.destroy()}),this.shadow.appendChild(o),((h=document.getElementById("instruckt-root"))!=null?h:document.body).appendChild(this.host);let l=t.x/100*window.innerWidth,c=t.y-window.scrollY;this.positionHost(l,c),this.setupOutsideClick(),r.focus(),r.setSelectionRange(r.value.length,r.value.length)}stopHostPropagation(t){for(let e of["click","mousedown","pointerdown"])t.addEventListener(e,n=>n.stopPropagation())}positionHost(t,e){if(this.host){this.host.setAttribute("popover","manual");try{this.host.showPopover()}catch(n){}Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var l,c;if(!this.host)return;let n=360,o=(c=(l=this.host.querySelector(".popup"))==null?void 0:l.getBoundingClientRect().height)!=null?c:300,s=window.innerWidth,r=window.innerHeight,a=Math.max(10,Math.min(t+10,s-n)),d=Math.max(10,Math.min(e+10,r-o-10));Object.assign(this.host.style,{left:`${a}px`,top:`${d}px`})})}}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var t;(t=this.host)==null||t.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var k=class{constructor(t){this.onClick=t;this.markers=new Map;var n;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),((n=document.getElementById("instruckt-root"))!=null?n:document.body).appendChild(this.container)}upsert(t,e){let n=this.markers.get(t.id);if(n){this.updateStyle(n.el,t);return}let o=document.createElement("div");o.className=`ik-marker ${this.statusClass(t.status)}`,o.textContent=String(e),o.title=t.comment.slice(0,60),o.style.pointerEvents="all",o.style.left=`${t.x/100*window.innerWidth}px`,o.style.top=`${t.y-window.scrollY}px`,o.addEventListener("click",s=>{s.stopPropagation(),this.onClick(t)}),this.container.appendChild(o),this.markers.set(t.id,{el:o,annotationId:t.id})}update(t){let e=this.markers.get(t.id);e&&this.updateStyle(e.el,t)}updateStyle(t,e){t.className=`ik-marker ${this.statusClass(e.status)}`,t.title=e.comment.slice(0,60)}statusClass(t){return t==="resolved"?"resolved":t==="dismissed"?"dismissed":t==="acknowledged"?"acknowledged":""}reposition(t){t.forEach(e=>{let n=this.markers.get(e.id);n&&(n.el.style.left=`${e.x/100*window.innerWidth}px`,n.el.style.top=`${e.y-window.scrollY}px`)})}remove(t){let e=this.markers.get(t);e&&(e.el.remove(),this.markers.delete(t))}setVisible(t){this.container.style.display=t?"":"none"}clear(){for(let{el:t}of this.markers.values())t.remove();this.markers.clear()}destroy(){this.container.remove(),this.markers.clear()}};function N(i){if(i.id)return`#${CSS.escape(i.id)}`;let t=[],e=i;for(;e&&e!==document.documentElement;){let n=e.tagName.toLowerCase(),o=e.parentElement;if(!o){t.unshift(n);break}let s=Array.from(e.classList).filter(a=>!a.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(s.length>0){let a=`${n}.${s.map(CSS.escape).join(".")}`;if(o.querySelectorAll(a).length===1){t.unshift(a);break}}let r=Array.from(o.children).filter(a=>a.tagName===e.tagName);if(r.length===1)t.unshift(n);else{let a=r.indexOf(e)+1;t.unshift(`${n}:nth-of-type(${a})`)}e=o}return t.join(" > ")}function j(i){let t=i.tagName.toLowerCase(),e=i.getAttribute("wire:model")||i.getAttribute("wire:click");if(e)return`${t}[wire:${e.split(".")[0]}]`;if(i.id)return`${t}#${i.id}`;let n=i.classList[0];return n?`${t}.${n}`:t}function H(i){let t=i.tagName.toLowerCase(),e=(i.textContent||"").trim().replace(/\s+/g," ").slice(0,40),n=[];i.id&&n.push(`id="${i.id}"`);let o=i.getAttribute("role");o&&n.push(`role="${o}"`);let s=i.getAttribute("wire:model")||i.getAttribute("wire:click");s&&n.push(`wire:${i.hasAttribute("wire:model")?"model":"click"}="${s}"`);let r=n.length?" "+n.join(" "):"",a=`<${t}${r}>`;return e?`${a} ${e}`:a}function K(i){return(i.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function U(i){return Array.from(i.classList).filter(t=>!t.match(/^(instruckt-)/)).join(" ")}function q(i){let t=i.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function at(){return typeof window.Livewire!="undefined"}function lt(i){let t=i;for(;t&&t!==document.documentElement;){if(t.getAttribute("wire:id"))return t;t=t.parentElement}return null}function D(i){var s,r;if(!at())return null;let t=lt(i);if(!t)return null;let e=t.getAttribute("wire:id"),n="Unknown",o=t.getAttribute("wire:snapshot");if(o)try{let a=JSON.parse(o);n=(r=(s=a==null?void 0:a.memo)==null?void 0:s.name)!=null?r:"Unknown"}catch(a){}return{framework:"livewire",component:n,wire_id:e}}function ct(i){var e;let t=i;for(;t&&t!==document.documentElement;){let n=(e=t.__vueParentComponent)!=null?e:t.__vue__;if(n)return n;t=t.parentElement}return null}function V(i){var o,s,r,a,d,l,c,h;let t=ct(i);if(!t)return null;let e=(h=(c=(d=(r=(o=t.$options)==null?void 0:o.name)!=null?r:(s=t.$options)==null?void 0:s.__name)!=null?d:(a=t.type)==null?void 0:a.name)!=null?c:(l=t.type)==null?void 0:l.__name)!=null?h:"Anonymous",n={};if(t.props&&Object.assign(n,t.props),t.setupState){for(let[p,u]of Object.entries(t.setupState))if(!p.startsWith("_")&&typeof u!="function")try{n[p]=JSON.parse(JSON.stringify(u))}catch(L){n[p]=String(u)}}return{framework:"vue",component:e,component_uid:t.uid!==void 0?String(t.uid):void 0,data:n}}function ht(i){let t=i;for(;t&&t!==document.documentElement;){if(t.__svelte_meta)return t.__svelte_meta;t=t.parentElement}return null}function Y(i){var o,s,r,a;let t=ht(i);if(!t)return null;let e=(s=(o=t.loc)==null?void 0:o.file)!=null?s:"";return{framework:"svelte",component:e&&(a=(r=e.split("/").pop())==null?void 0:r.replace(/\.svelte$/,""))!=null?a:"Unknown",data:e?{file:e}:void 0}}function mt(i){for(let t of Object.keys(i))if(t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$"))return t;return null}function gt(i){let t=i;for(;t;){let{type:e}=t;if(typeof e=="function"&&e.name){let n=e.name;if(n[0]===n[0].toUpperCase()&&n.length>1)return n}if(typeof e=="object"&&e!==null&&e.displayName)return e.displayName;t=t.return}return"Component"}function ft(i){var n,o;let t=(o=(n=i.memoizedProps)!=null?n:i.pendingProps)!=null?o:{},e={};for(let[s,r]of Object.entries(t))if(!(s==="children"||typeof r=="function"))try{e[s]=JSON.parse(JSON.stringify(r))}catch(a){e[s]=String(r)}return e}function W(i){let t=i;for(;t&&t!==document.documentElement;){let e=mt(t);if(e){let n=t[e];if(n){let o=gt(n),s=ft(n);return{framework:"react",component:o,data:s}}}t=t.parentElement}return null}function J(){return window.location.pathname}var y=class y{constructor(t){this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.frozenPopovers=[];this.rafId=null;this.pendingMouseTarget=null;this.highlightLocked=!1;this.pollTimer=null;this.boundReposition=()=>{var t;(t=this.markers)==null||t.reposition(this.annotations)};this.freezeBlockEvents=["click","mousedown","pointerdown","pointerup","mouseup","touchstart","touchend","auxclick"];this.freezePassiveEvents=["focusin","focusout","blur","pointerleave","mouseleave","mouseout"];this.boundFreezeClick=t=>{this.isInstruckt(t.target)||this.isAnnotating&&t.type==="click"||(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation())};this.boundFreezeSubmit=t=>{t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation()};this.boundFreezePassive=t=>{t.stopPropagation(),t.stopImmediatePropagation()};this.boundMouseMove=t=>{this.highlightLocked||(this.pendingMouseTarget=t.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var e,n;this.rafId=null,!this.highlightLocked&&(this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(e=this.highlight)==null||e.show(this.pendingMouseTarget):(n=this.highlight)==null||n.hide())})))};this.boundMouseLeave=()=>{var t;this.highlightLocked||(t=this.highlight)==null||t.hide()};this.boundClick=t=>{var p,u,L,F;let e=t.target;if(this.isInstruckt(e))return;t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation();let n=((p=window.getSelection())==null?void 0:p.toString().trim())||void 0,o=N(e),s=j(e),r=H(e),a=U(e),d=K(e)||void 0,l=q(e),c=(u=this.detectFramework(e))!=null?u:void 0,h={element:e,elementPath:o,elementName:s,elementLabel:r,cssClasses:a,boundingBox:l,x:t.clientX,y:t.clientY,selectedText:n,nearbyText:d,framework:c};(L=this.highlight)==null||L.show(e),this.highlightLocked=!0,(F=this.popup)==null||F.showNew(h,{onSubmit:w=>{var $;this.highlightLocked=!1,($=this.highlight)==null||$.hide(),this.submitAnnotation(h,w.comment)},onCancel:()=>{var w;this.highlightLocked=!1,(w=this.highlight)==null||w.hide()}})};this.config=A({adapters:["livewire","vue","svelte","react"],theme:"auto",position:"bottom-right"},t),this.api=new S(t.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.init()}init(){B(),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new v(this.config.position,{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onCopy:()=>this.copyAnnotations(),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:t=>this.onMinimize(t)}),this.highlight=new b,this.popup=new z,this.markers=new k(t=>this.onMarkerClick(t)),document.addEventListener("keydown",this.boundKeydown),window.addEventListener("scroll",this.boundReposition,{passive:!0}),window.addEventListener("resize",this.boundReposition,{passive:!0}),document.addEventListener("livewire:navigated",()=>this.reattach()),window.addEventListener("popstate",()=>{setTimeout(()=>this.reattach(),0)}),this.loadAnnotations(),this.pollTimer=setInterval(()=>this.pollForChanges(),3e3),this.syncMarkers()}makeToolbarCallbacks(){return{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onCopy:()=>this.copyAnnotations(),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:t=>this.onMinimize(t)}}reattach(){var s,r;let t=this.isAnnotating,e=this.isFrozen,n=(r=(s=this.toolbar)==null?void 0:s.isMinimized())!=null?r:!1;this.isAnnotating&&this.detachAnnotateListeners(),this.isFrozen&&this.setFrozen(!1),this.isAnnotating=!1,this.isFrozen=!1,document.querySelectorAll("[data-instruckt]").forEach(a=>a.remove()),this.toolbar=new v(this.config.position,this.makeToolbarCallbacks()),n&&this.toolbar.minimize(),this.markers=new k(a=>this.onMarkerClick(a)),this.highlight=new b,n&&this.markers.setVisible(!1);let o=document.getElementById("instruckt-global");o&&o.remove(),B(),this.syncMarkers(),t&&!n&&this.setAnnotating(!0)}onMinimize(t){var e,n,o,s,r;t?(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1),(e=this.toolbar)==null||e.setAnnotateActive(!1),(n=this.toolbar)==null||n.setFreezeActive(!1),(o=this.markers)==null||o.setVisible(!1),(s=this.popup)==null||s.destroy()):(r=this.markers)==null||r.setVisible(!0)}async loadAnnotations(){this.loadFromStorage();try{let t=await this.api.getAnnotations();if(t.length>0){let e=new Set(t.map(o=>o.id)),n=this.annotations.filter(o=>!e.has(o.id));this.annotations=[...t,...n],this.saveToStorage()}}catch(t){}this.syncMarkers()}saveToStorage(){try{localStorage.setItem(y.STORAGE_KEY,JSON.stringify(this.annotations))}catch(t){}}loadFromStorage(){try{let t=localStorage.getItem(y.STORAGE_KEY);t&&(this.annotations=JSON.parse(t))}catch(t){}}async pollForChanges(){try{let t=await this.api.getAnnotations(),e=!1;for(let n of t){let o=this.annotations.find(s=>s.id===n.id);o&&o.status!==n.status&&(o.status=n.status,o.resolvedAt=n.resolvedAt,o.resolvedBy=n.resolvedBy,e=!0)}e&&(this.saveToStorage(),this.syncMarkers())}catch(t){}}syncMarkers(){var n,o,s,r;(n=this.markers)==null||n.clear();let t=J(),e=0;for(let a of this.annotations)a.status==="resolved"||a.status==="dismissed"||this.annotationPageKey(a)===t&&(e++,(o=this.markers)==null||o.upsert(a,e));(s=this.toolbar)==null||s.setAnnotationCount(this.pageAnnotations().length),(r=this.toolbar)==null||r.setTotalCount(this.totalActiveCount())}annotationPageKey(t){try{return new URL(t.url).pathname}catch(e){return t.url}}pageAnnotations(){let t=J();return this.annotations.filter(e=>this.annotationPageKey(e)===t&&e.status!=="resolved"&&e.status!=="dismissed")}totalActiveCount(){return this.annotations.filter(t=>t.status!=="resolved"&&t.status!=="dismissed").length}setAnnotating(t){var e,n;this.isAnnotating=t,(e=this.toolbar)==null||e.setAnnotateActive(t),t?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(n=this.highlight)==null||n.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)),this.updateFreezeStyles()}setFrozen(t){var e,n;if(this.isFrozen=t,(e=this.toolbar)==null||e.setFreezeActive(t),t){this.updateFreezeStyles(),this.freezePopovers();for(let o of this.freezeBlockEvents)window.addEventListener(o,this.boundFreezeClick,!0);window.addEventListener("submit",this.boundFreezeSubmit,!0);for(let o of this.freezePassiveEvents)window.addEventListener(o,this.boundFreezePassive,!0)}else{(n=this.frozenStyleEl)==null||n.remove(),this.frozenStyleEl=null,this.unfreezePopovers();for(let o of this.freezeBlockEvents)window.removeEventListener(o,this.boundFreezeClick,!0);window.removeEventListener("submit",this.boundFreezeSubmit,!0);for(let o of this.freezePassiveEvents)window.removeEventListener(o,this.boundFreezePassive,!0)}}freezePopovers(){this.frozenPopovers=[];let t=":popover-open, .\\:popover-open";document.querySelectorAll("[popover]").forEach(e=>{var a;let n=e,o=(a=n.getAttribute("popover"))!=null?a:"",s=!1;try{s=n.matches(t)}catch(d){try{s=n.matches(".\\:popover-open")}catch(l){}}if(!s)return;let r=n.getBoundingClientRect();this.frozenPopovers.push({el:n,original:o}),n.removeAttribute("popover"),n.style.setProperty("display","block","important"),n.style.setProperty("position","fixed","important"),n.style.setProperty("z-index","2147483644","important"),n.style.setProperty("top",`${r.top}px`,"important"),n.style.setProperty("left",`${r.left}px`,"important"),n.style.setProperty("width",`${r.width}px`,"important"),n.classList.add(":popover-open")})}unfreezePopovers(){for(let{el:t,original:e}of this.frozenPopovers){for(let n of["display","position","z-index","top","left","width"])t.style.removeProperty(n);t.classList.remove(":popover-open"),t.setAttribute("popover",e||"auto")}this.frozenPopovers=[]}updateFreezeStyles(){var e;if(!this.isFrozen)return;(e=this.frozenStyleEl)==null||e.remove(),this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze";let t=this.isAnnotating?"":`
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
      `,document.head.appendChild(this.frozenStyleEl)}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave),window.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave),window.removeEventListener("click",this.boundClick,!0)}isInstruckt(t){return!t||!(t instanceof Element)?!1:t.closest("[data-instruckt]")!==null}detectFramework(t){var n;let e=(n=this.config.adapters)!=null?n:[];if(e.includes("livewire")){let o=D(t);if(o)return o}if(e.includes("vue")){let o=V(t);if(o)return o}if(e.includes("svelte")){let o=Y(t);if(o)return o}if(e.includes("react")){let o=W(t);if(o)return o}return null}async submitAnnotation(t,e){var s,r;let n={x:t.x/window.innerWidth*100,y:t.y+window.scrollY,comment:e,element:t.elementName,elementPath:t.elementPath,cssClasses:t.cssClasses,boundingBox:t.boundingBox,selectedText:t.selectedText,nearbyText:t.nearbyText,intent:"fix",severity:"important",framework:t.framework,url:window.location.href},o;try{o=await this.api.addAnnotation(n)}catch(a){o=P(A({},n),{id:crypto.randomUUID(),status:"pending",thread:[],createdAt:new Date().toISOString()})}this.annotations.push(o),this.saveToStorage(),this.syncMarkers(),(r=(s=this.config).onAnnotationAdd)==null||r.call(s,o),this.copyAnnotations()}onMarkerClick(t){var e;(e=this.popup)==null||e.showEdit(t,{onSave:async(n,o)=>{try{let s=await this.api.updateAnnotation(n.id,{comment:o});this.onAnnotationUpdated(s)}catch(s){this.onAnnotationUpdated(P(A({},n),{comment:o,updatedAt:new Date().toISOString()}))}},onDelete:async n=>{try{await this.api.updateAnnotation(n.id,{status:"dismissed"})}catch(o){}this.removeAnnotation(n.id)}})}onAnnotationUpdated(t){let e=this.annotations.findIndex(n=>n.id===t.id);e>=0&&(this.annotations[e]=t),this.saveToStorage(),this.syncMarkers()}removeAnnotation(t){this.annotations=this.annotations.filter(e=>e.id!==t),this.saveToStorage(),this.syncMarkers()}async clearPage(){let t=this.pageAnnotations();for(let e of t)try{await this.api.updateAnnotation(e.id,{status:"dismissed"})}catch(n){}this.annotations=this.annotations.filter(e=>!t.includes(e)),this.saveToStorage(),this.syncMarkers()}async clearEverything(){let t=this.annotations.filter(e=>e.status!=="resolved"&&e.status!=="dismissed");for(let e of t)try{await this.api.updateAnnotation(e.id,{status:"dismissed"})}catch(n){}this.annotations=[],this.saveToStorage(),this.syncMarkers()}onKeydown(t){var n;if((n=this.toolbar)!=null&&n.isMinimized())return;let e=t.target;["INPUT","TEXTAREA","SELECT"].includes(e.tagName)||e.closest('[contenteditable="true"]')||this.isInstruckt(e)||(t.key==="a"&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&this.setAnnotating(!this.isAnnotating),t.key==="f"&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&this.setFrozen(!this.isFrozen),t.key==="x"&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&this.clearPage(),t.key==="Escape"&&(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1)))}copyAnnotations(){let t=this.exportMarkdown();navigator.clipboard.writeText(t).catch(()=>{let e=document.createElement("textarea");e.value=t,e.style.cssText="position:fixed;left:-9999px",document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove()})}exportMarkdown(){let t=this.annotations.filter(s=>s.status!=="resolved"&&s.status!=="dismissed");if(t.length===0)return`# UI Feedback

No open annotations.`;let e=new Map;for(let s of t){let r=this.annotationPageKey(s);e.has(r)||e.set(r,[]),e.get(r).push(s)}let n=e.size>1,o=[];n&&(o.push("# UI Feedback"),o.push(""));for(let[s,r]of e){n?o.push(`## ${s}`):o.push(`# UI Feedback: ${s}`),o.push("");let a=n?"###":"##";r.forEach((d,l)=>{var h,p,u;let c=(h=d.framework)!=null&&h.component?` in \`${d.framework.component}\``:"";o.push(`${a} ${l+1}. ${d.comment}`),o.push(`- Element: \`${d.element}\`${c}`),(u=(p=d.framework)==null?void 0:p.data)!=null&&u.file&&o.push(`- File: \`${d.framework.data.file}\``),d.cssClasses&&o.push(`- Classes: \`${d.cssClasses}\``),d.selectedText?o.push(`- Text: "${d.selectedText}"`):d.nearbyText&&o.push(`- Text: "${d.nearbyText.slice(0,100)}"`),o.push("")})}return o.join(`
`).trim()}getAnnotations(){return[...this.annotations]}destroy(){var t,e,n,o;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),window.removeEventListener("scroll",this.boundReposition),window.removeEventListener("resize",this.boundReposition),(t=this.toolbar)==null||t.destroy(),(e=this.highlight)==null||e.destroy(),(n=this.popup)==null||n.destroy(),(o=this.markers)==null||o.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId),this.pollTimer!==null&&clearInterval(this.pollTimer)}};y.STORAGE_KEY="instruckt:annotations";var x=y;function bt(i){return new x(i)}return ot(kt);})();
//# sourceMappingURL=instruckt.iife.js.map