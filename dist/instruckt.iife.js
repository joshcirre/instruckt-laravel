/* instruckt v0.3.1 | MIT */
"use strict";var Instruckt=(()=>{var v=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var q=Object.getOwnPropertyNames,L=Object.getOwnPropertySymbols;var $=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable;var T=(i,t,e)=>t in i?v(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,z=(i,t)=>{for(var e in t||(t={}))$.call(t,e)&&T(i,e,t[e]);if(L)for(var e of L(t))Y.call(t,e)&&T(i,e,t[e]);return i};var V=(i,t)=>{for(var e in t)v(i,e,{get:t[e],enumerable:!0})},W=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of q(t))!$.call(i,o)&&o!==e&&v(i,o,{get:()=>t[o],enumerable:!(n=U(t,o))||n.enumerable});return i};var J=i=>W(v({},"__esModule",{value:!0}),i);var ct={};V(ct,{Instruckt:()=>b,init:()=>dt});function X(){let i=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return i?decodeURIComponent(i[1]):""}function A(){let i={"Content-Type":"application/json",Accept:"application/json"},t=X();return t&&(i["X-XSRF-TOKEN"]=t),i}function g(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/_([a-z])/g,(r,s)=>s.toUpperCase());t[o]=Array.isArray(n)?n.map(r=>r&&typeof r=="object"&&!Array.isArray(r)?g(r):r):n&&typeof n=="object"&&!Array.isArray(n)?g(n):n}return t}function C(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/[A-Z]/g,r=>`_${r.toLowerCase()}`);t[o]=n&&typeof n=="object"&&!Array.isArray(n)?C(n):n}return t}var k=class{constructor(t){this.endpoint=t}async addAnnotation(t){let e=await fetch(`${this.endpoint}/annotations`,{method:"POST",headers:A(),body:JSON.stringify(C(t))});if(!e.ok)throw new Error(`instruckt: failed to add annotation (${e.status})`);return g(await e.json())}async updateAnnotation(t,e){let n=await fetch(`${this.endpoint}/annotations/${t}`,{method:"PATCH",headers:A(),body:JSON.stringify(C(e))});if(!n.ok)throw new Error(`instruckt: failed to update annotation (${n.status})`);return g(await n.json())}async addReply(t,e,n="human"){let o=await fetch(`${this.endpoint}/annotations/${t}/reply`,{method:"POST",headers:A(),body:JSON.stringify({role:n,content:e})});if(!o.ok)throw new Error(`instruckt: failed to add reply (${o.status})`);return g(await o.json())}};var D=`
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`,R=`
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
`,S=`
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
`,G=`
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
`;function P(){if(document.getElementById("instruckt-global"))return;let i=document.createElement("style");i.id="instruckt-global",i.textContent=D+G,document.head.appendChild(i)}var f={annotate:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',freeze:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'},x=class{constructor(t,e){this.position=t;this.callbacks=e;this.mode="idle";this.dragging=!1;this.dragOffset={x:0,y:0};this.build(),this.setupDrag()}build(){this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=R,this.shadow.appendChild(t);let e=document.createElement("div");e.className="toolbar",this.annotateBtn=this.makeBtn(f.annotate,"Annotate elements (A)",()=>{let r=this.mode!=="annotating";this.setMode(r?"annotating":"idle"),this.callbacks.onToggleAnnotate(r)}),this.freezeBtn=this.makeBtn(f.freeze,"Freeze animations (F)",()=>{let r=this.mode!=="frozen";this.setMode(r?"frozen":"idle"),this.callbacks.onFreezeAnimations(r)}),this.copyBtn=this.makeBtn(f.copy,"Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.innerHTML=f.check,setTimeout(()=>{this.copyBtn.innerHTML=f.copy},1200)});let n=document.createElement("div");n.className="divider";let o=document.createElement("div");o.className="divider",e.append(this.annotateBtn,n,this.freezeBtn,o,this.copyBtn),this.shadow.appendChild(e),this.applyPosition(),document.body.appendChild(this.host)}makeBtn(t,e,n){let o=document.createElement("button");return o.className="btn",o.title=e,o.setAttribute("aria-label",e),o.innerHTML=t,o.addEventListener("click",r=>{r.stopPropagation(),n()}),o}applyPosition(){let t="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?t:"auto",top:this.position.includes("top")?t:"auto",right:this.position.includes("right")?t:"auto",left:this.position.includes("left")?t:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",t=>{if(t.target.closest(".btn"))return;this.dragging=!0;let e=this.host.getBoundingClientRect();this.dragOffset={x:t.clientX-e.left,y:t.clientY-e.top},t.preventDefault()}),document.addEventListener("mousemove",t=>{this.dragging&&Object.assign(this.host.style,{left:`${t.clientX-this.dragOffset.x}px`,top:`${t.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMode(t){this.mode=t,this.annotateBtn.classList.toggle("active",t==="annotating"),this.freezeBtn.classList.toggle("active",t==="frozen"),document.body.classList.toggle("ik-annotating",t==="annotating")}setAnnotationCount(t){let e=this.annotateBtn.querySelector(".badge");t>0?(e||(e=document.createElement("span"),e.className="badge",this.annotateBtn.appendChild(e)),e.textContent=t>99?"99+":String(t)):e==null||e.remove()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var y=class{constructor(){this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),document.body.appendChild(this.el)}show(t){let e=t.getBoundingClientRect();if(e.width===0&&e.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function p(i){return String(i!=null?i:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var w=class{constructor(){this.host=null;this.shadow=null;this.boundOutside=t=>{this.host&&!this.host.contains(t.target)&&this.destroy()}}showNew(t,e){this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=S,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let r=t.framework?`<div class="fw-badge">${p(t.framework.component)}</div>`:"",s=t.selectedText?`<div class="selected-text">"${p(t.selectedText.slice(0,80))}"</div>`:"";o.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${p(t.elementPath)}">${p(t.elementName)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${r}${s}
      <textarea placeholder="What needs to change here?" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `;let a=o.querySelector("textarea"),d=o.querySelector('[data-action="submit"]');a.addEventListener("input",()=>{d.disabled=a.value.trim().length===0}),a.addEventListener("keydown",l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),d.disabled||d.click()),l.key==="Escape"&&(e.onCancel(),this.destroy())}),o.querySelector('[data-action="cancel"]').addEventListener("click",()=>{e.onCancel(),this.destroy()}),o.querySelector(".close-btn").addEventListener("click",()=>{e.onCancel(),this.destroy()}),d.addEventListener("click",()=>{let l=a.value.trim();l&&(e.onSubmit({comment:l}),this.destroy())}),this.shadow.appendChild(o),document.body.appendChild(this.host),this.positionHost(t.x,t.y),this.setupOutsideClick(),a.focus()}showThread(t,e){var d;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=S,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let r=l=>`<span class="status-badge ${p(l)}">${p(l)}</span>`,s=((d=t.thread)!=null?d:[]).map(l=>`
      <div class="msg">
        <div class="msg-role ${p(l.role)}">${l.role==="agent"?"\u{1F916} Agent":"\u{1F464} You"}</div>
        <div class="msg-content">${p(l.content)}</div>
      </div>
    `).join(""),a=["pending","acknowledged"].includes(t.status);if(o.innerHTML=`
      <div class="header">
        <span class="element-tag">${p(t.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${r(t.status)}
      <div class="selected-text" style="margin-top:8px;">${p(t.comment)}</div>
      ${s?`<div class="thread">${s}</div>`:""}
      ${a?`
        <div class="thread" style="margin-top:8px;">
          <textarea placeholder="Add a reply\u2026" rows="2"></textarea>
          <div class="actions" style="margin-top:6px;">
            <button class="btn-secondary" data-action="resolve">Mark resolved</button>
            <button class="btn-primary" data-action="reply" disabled>Reply</button>
          </div>
        </div>
      `:""}
    `,o.querySelector(".close-btn").addEventListener("click",()=>this.destroy()),a){let l=o.querySelector("textarea"),c=o.querySelector('[data-action="reply"]');l.addEventListener("input",()=>{c.disabled=l.value.trim().length===0}),c.addEventListener("click",()=>{let u=l.value.trim();u&&(e.onReply(t,u),this.destroy())}),o.querySelector('[data-action="resolve"]').addEventListener("click",()=>{e.onResolve(t),this.destroy()})}this.shadow.appendChild(o),document.body.appendChild(this.host),this.positionHost(window.innerWidth/2-170,window.innerHeight/2-150),this.setupOutsideClick()}positionHost(t,e){this.host&&(Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var l,c;if(!this.host)return;let n=360,o=(c=(l=this.host.querySelector(".popup"))==null?void 0:l.getBoundingClientRect().height)!=null?c:300,r=window.innerWidth,s=window.innerHeight,a=Math.max(10,Math.min(t+10,r-n)),d=Math.max(10,Math.min(e+10,s-o-10));Object.assign(this.host.style,{left:`${a}px`,top:`${d}px`})}))}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var t;(t=this.host)==null||t.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var E=class{constructor(t){this.onClick=t;this.markers=new Map;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),document.body.appendChild(this.container)}upsert(t,e){let n=this.markers.get(t.id);if(n){this.updateStyle(n.el,t);return}let o=document.createElement("div");o.className=`ik-marker ${this.statusClass(t.status)}`,o.textContent=String(e),o.title=t.comment.slice(0,60),o.style.pointerEvents="all",o.style.left=`${t.x/100*window.innerWidth}px`,o.style.top=`${t.y-window.scrollY}px`,o.addEventListener("click",r=>{r.stopPropagation(),this.onClick(t)}),this.container.appendChild(o),this.markers.set(t.id,{el:o,annotationId:t.id})}update(t){let e=this.markers.get(t.id);e&&this.updateStyle(e.el,t)}updateStyle(t,e){t.className=`ik-marker ${this.statusClass(e.status)}`,t.title=e.comment.slice(0,60)}statusClass(t){return t==="resolved"?"resolved":t==="dismissed"?"dismissed":t==="acknowledged"?"acknowledged":""}reposition(t){t.forEach(e=>{let n=this.markers.get(e.id);n&&(n.el.style.left=`${e.x/100*window.innerWidth}px`,n.el.style.top=`${e.y-window.scrollY}px`)})}remove(t){let e=this.markers.get(t);e&&(e.el.remove(),this.markers.delete(t))}destroy(){this.container.remove(),this.markers.clear()}};function B(i){if(i.id)return`#${CSS.escape(i.id)}`;let t=[],e=i;for(;e&&e!==document.documentElement;){let n=e.tagName.toLowerCase(),o=e.parentElement;if(!o){t.unshift(n);break}let r=Array.from(e.classList).filter(a=>!a.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(r.length>0){let a=`${n}.${r.map(CSS.escape).join(".")}`;if(o.querySelectorAll(a).length===1){t.unshift(a);break}}let s=Array.from(o.children).filter(a=>a.tagName===e.tagName);if(s.length===1)t.unshift(n);else{let a=s.indexOf(e)+1;t.unshift(`${n}:nth-of-type(${a})`)}e=o}return t.join(" > ")}function F(i){let t=i.getAttribute("wire:model")||i.getAttribute("wire:click");if(t)return`wire:${t.split(".")[0]}`;let e=i.getAttribute("aria-label");if(e)return e;let n=i.id;if(n)return`#${n}`;let o=i.tagName.toLowerCase(),r=i.getAttribute("role");if(r)return`${o}[${r}]`;let s=i.classList[0];return s?`${o}.${s}`:o}function I(i){return(i.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function _(i){return Array.from(i.classList).filter(t=>!t.match(/^(instruckt-)/)).join(" ")}function O(i){let t=i.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function Z(){return typeof window.Livewire!="undefined"}function Q(i){let t=i;for(;t&&t!==document.documentElement;){if(t.getAttribute("wire:id"))return t;t=t.parentElement}return null}function N(i){var r,s;if(!Z())return null;let t=Q(i);if(!t)return null;let e=t.getAttribute("wire:id"),n="Unknown",o=t.getAttribute("wire:snapshot");if(o)try{let a=JSON.parse(o);n=(s=(r=a==null?void 0:a.memo)==null?void 0:r.name)!=null?s:"Unknown"}catch(a){}return{framework:"livewire",component:n,wire_id:e}}function et(i){var e;let t=i;for(;t&&t!==document.documentElement;){let n=(e=t.__vueParentComponent)!=null?e:t.__vue__;if(n)return n;t=t.parentElement}return null}function j(i){var o,r,s,a,d,l,c,u;let t=et(i);if(!t)return null;let e=(u=(c=(d=(s=(o=t.$options)==null?void 0:o.name)!=null?s:(r=t.$options)==null?void 0:r.__name)!=null?d:(a=t.type)==null?void 0:a.name)!=null?c:(l=t.type)==null?void 0:l.__name)!=null?u:"Anonymous",n={};if(t.props&&Object.assign(n,t.props),t.setupState){for(let[h,m]of Object.entries(t.setupState))if(!h.startsWith("_")&&typeof m!="function")try{n[h]=JSON.parse(JSON.stringify(m))}catch(M){n[h]=String(m)}}return{framework:"vue",component:e,component_uid:t.uid!==void 0?String(t.uid):void 0,data:n}}function ot(i){let t=i;for(;t&&t!==document.documentElement;){if(t.__svelte_meta)return t.__svelte_meta;t=t.parentElement}return null}function H(i){var o,r,s,a;let t=ot(i);if(!t)return null;let e=(r=(o=t.loc)==null?void 0:o.file)!=null?r:"";return{framework:"svelte",component:e&&(a=(s=e.split("/").pop())==null?void 0:s.replace(/\.svelte$/,""))!=null?a:"Unknown",data:e?{file:e}:void 0}}function rt(i){for(let t of Object.keys(i))if(t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$"))return t;return null}function st(i){let t=i;for(;t;){let{type:e}=t;if(typeof e=="function"&&e.name){let n=e.name;if(n[0]===n[0].toUpperCase()&&n.length>1)return n}if(typeof e=="object"&&e!==null&&e.displayName)return e.displayName;t=t.return}return"Component"}function at(i){var n,o;let t=(o=(n=i.memoizedProps)!=null?n:i.pendingProps)!=null?o:{},e={};for(let[r,s]of Object.entries(t))if(!(r==="children"||typeof s=="function"))try{e[r]=JSON.parse(JSON.stringify(s))}catch(a){e[r]=String(s)}return e}function K(i){let t=i;for(;t&&t!==document.documentElement;){let e=rt(t);if(e){let n=t[e];if(n){let o=st(n),r=at(n);return{framework:"react",component:o,data:r}}}t=t.parentElement}return null}var b=class{constructor(t){this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.rafId=null;this.pendingMouseTarget=null;this.boundMouseMove=t=>{this.pendingMouseTarget=t.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var e,n;this.rafId=null,this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(e=this.highlight)==null||e.show(this.pendingMouseTarget):(n=this.highlight)==null||n.hide()}))};this.boundMouseLeave=()=>{var t;(t=this.highlight)==null||t.hide()};this.boundClick=t=>{var u,h,m;let e=t.target;if(this.isInstruckt(e))return;t.preventDefault(),t.stopPropagation();let n=((u=window.getSelection())==null?void 0:u.toString().trim())||void 0,o=B(e),r=F(e),s=_(e),a=I(e)||void 0,d=O(e),l=(h=this.detectFramework(e))!=null?h:void 0,c={element:e,elementPath:o,elementName:r,cssClasses:s,boundingBox:d,x:t.clientX,y:t.clientY,selectedText:n,nearbyText:a,framework:l};(m=this.popup)==null||m.showNew(c,{onSubmit:M=>this.submitAnnotation(c,M.comment),onCancel:()=>{}})};this.config=z({adapters:["livewire","vue","svelte","react"],theme:"auto",position:"bottom-right"},t),this.api=new k(t.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.init()}init(){P(),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new x(this.config.position,{onToggleAnnotate:t=>this.setAnnotating(t),onFreezeAnimations:t=>this.setFrozen(t),onCopy:()=>this.copyAnnotations()}),this.highlight=new y,this.popup=new w,this.markers=new E(t=>this.onMarkerClick(t)),document.addEventListener("keydown",this.boundKeydown)}setAnnotating(t){var e;t&&this.isFrozen&&this.setFrozen(!1),this.isAnnotating=t,t?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(e=this.highlight)==null||e.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null))}setFrozen(t){var e,n;t&&this.isAnnotating&&(this.setAnnotating(!1),(e=this.toolbar)==null||e.setMode("idle")),this.isFrozen=t,t?(this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze",this.frozenStyleEl.textContent=`
        *, *::before, *::after { animation-play-state: paused !important; transition: none !important; }
        video { filter: none !important; }
      `,document.head.appendChild(this.frozenStyleEl)):((n=this.frozenStyleEl)==null||n.remove(),this.frozenStyleEl=null)}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave),document.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave),document.removeEventListener("click",this.boundClick,!0)}isInstruckt(t){return t.closest("[data-instruckt]")!==null}detectFramework(t){var n;let e=(n=this.config.adapters)!=null?n:[];if(e.includes("livewire")){let o=N(t);if(o)return o}if(e.includes("vue")){let o=j(t);if(o)return o}if(e.includes("svelte")){let o=H(t);if(o)return o}if(e.includes("react")){let o=K(t);if(o)return o}return null}async submitAnnotation(t,e){var o,r,s,a;let n={x:t.x/window.innerWidth*100,y:t.y+window.scrollY,comment:e,element:t.elementName,elementPath:t.elementPath,cssClasses:t.cssClasses,boundingBox:t.boundingBox,selectedText:t.selectedText,nearbyText:t.nearbyText,intent:"fix",severity:"important",framework:t.framework,url:window.location.href};try{let d=await this.api.addAnnotation(n);this.annotations.push(d),(o=this.markers)==null||o.upsert(d,this.annotations.length),(r=this.toolbar)==null||r.setAnnotationCount(this.pendingCount()),(a=(s=this.config).onAnnotationAdd)==null||a.call(s,d),this.copyAnnotations()}catch(d){console.error("[instruckt] Failed to save annotation:",d)}}onMarkerClick(t){var e;(e=this.popup)==null||e.showThread(t,{onResolve:async n=>{try{let o=await this.api.updateAnnotation(n.id,{status:"resolved"});this.onAnnotationUpdated(o)}catch(o){console.error("[instruckt] Failed to resolve annotation:",o)}},onReply:async(n,o)=>{try{let r=await this.api.addReply(n.id,o,"human");this.onAnnotationUpdated(r)}catch(r){console.error("[instruckt] Failed to add reply:",r)}}})}onAnnotationUpdated(t){var n,o,r;let e=this.annotations.findIndex(s=>s.id===t.id);e>=0?(this.annotations[e]=t,(n=this.markers)==null||n.update(t)):(this.annotations.push(t),(o=this.markers)==null||o.upsert(t,this.annotations.length)),(r=this.toolbar)==null||r.setAnnotationCount(this.pendingCount())}onKeydown(t){var n,o,r;let e=t.target;if(!["INPUT","TEXTAREA","SELECT"].includes(e.tagName)&&!e.closest('[contenteditable="true"]')){if(t.key==="a"&&!t.metaKey&&!t.ctrlKey&&!t.altKey){let s=!this.isAnnotating;(n=this.toolbar)==null||n.setMode(s?"annotating":"idle"),this.setAnnotating(s)}if(t.key==="f"&&!t.metaKey&&!t.ctrlKey&&!t.altKey){let s=!this.isFrozen;(o=this.toolbar)==null||o.setMode(s?"frozen":"idle"),this.setFrozen(s)}t.key==="Escape"&&this.isAnnotating&&((r=this.toolbar)==null||r.setMode("idle"),this.setAnnotating(!1))}}pendingCount(){return this.annotations.filter(t=>t.status==="pending"||t.status==="acknowledged").length}copyAnnotations(){let t=this.exportMarkdown();navigator.clipboard.writeText(t).catch(()=>{let e=document.createElement("textarea");e.value=t,e.style.cssText="position:fixed;left:-9999px",document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove()})}exportMarkdown(){let t=this.annotations.filter(n=>n.status==="pending"||n.status==="acknowledged");if(t.length===0)return`## Instruckt Feedback \u2014 ${window.location.href}

No open annotations.`;let e=[`## Instruckt Feedback \u2014 ${window.location.href}`,`> ${t.length} open annotation${t.length===1?"":"s"}`,""];return t.forEach((n,o)=>{e.push(`### ${o+1}. ${n.element}`),e.push(""),e.push(n.comment),e.push(""),e.push(`**Selector**: \`${n.elementPath}\``),n.framework&&e.push(`**Component**: ${n.framework.component}`),n.selectedText&&e.push(`**Selected text**: "${n.selectedText}"`),n.thread&&n.thread.length>0&&(e.push(""),e.push("**Thread:**"),n.thread.forEach(r=>{e.push(`- **${r.role==="agent"?"Agent":"You"}**: ${r.content}`)})),e.push(""),e.push("---"),e.push("")}),e.join(`
`)}getAnnotations(){return[...this.annotations]}destroy(){var t,e,n,o;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),(t=this.toolbar)==null||t.destroy(),(e=this.highlight)==null||e.destroy(),(n=this.popup)==null||n.destroy(),(o=this.markers)==null||o.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId)}};function dt(i){return new b(i)}return J(ct);})();
//# sourceMappingURL=instruckt.iife.js.map