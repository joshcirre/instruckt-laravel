/* instruckt v0.3.1 | MIT */
"use strict";var Instruckt=(()=>{var b=Object.defineProperty;var V=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames,T=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,W=Object.prototype.propertyIsEnumerable;var z=(i,t,e)=>t in i?b(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,P=(i,t)=>{for(var e in t||(t={}))R.call(t,e)&&z(i,e,t[e]);if(T)for(var e of T(t))W.call(t,e)&&z(i,e,t[e]);return i};var X=(i,t)=>{for(var e in t)b(i,e,{get:t[e],enumerable:!0})},D=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of J(t))!R.call(i,o)&&o!==e&&b(i,o,{get:()=>t[o],enumerable:!(n=V(t,o))||n.enumerable});return i};var G=i=>D(b({},"__esModule",{value:!0}),i);var ht={};X(ht,{Instruckt:()=>v,init:()=>ut});function Q(){let i=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return i?decodeURIComponent(i[1]):""}function k(){let i={"Content-Type":"application/json",Accept:"application/json"},t=Q();return t&&(i["X-XSRF-TOKEN"]=t),i}function I(i){return h(i)}function h(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/_([a-z])/g,(s,r)=>r.toUpperCase());t[o]=Array.isArray(n)?n.map(s=>s&&typeof s=="object"&&!Array.isArray(s)?h(s):s):n&&typeof n=="object"&&!Array.isArray(n)?h(n):n}return t}function C(i){let t={};for(let[e,n]of Object.entries(i)){let o=e.replace(/[A-Z]/g,s=>`_${s.toLowerCase()}`);t[o]=n&&typeof n=="object"&&!Array.isArray(n)?C(n):n}return t}var y=class{constructor(t){this.endpoint=t}async createSession(t){let e=await fetch(`${this.endpoint}/sessions`,{method:"POST",headers:k(),body:JSON.stringify({url:t})});if(!e.ok)throw new Error(`instruckt: failed to create session (${e.status})`);return h(await e.json())}async getSession(t){let e=await fetch(`${this.endpoint}/sessions/${t}`,{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`instruckt: failed to get session (${e.status})`);return h(await e.json())}async addAnnotation(t,e){let n=await fetch(`${this.endpoint}/sessions/${t}/annotations`,{method:"POST",headers:k(),body:JSON.stringify(C(e))});if(!n.ok)throw new Error(`instruckt: failed to add annotation (${n.status})`);return h(await n.json())}async updateAnnotation(t,e){let n=await fetch(`${this.endpoint}/annotations/${t}`,{method:"PATCH",headers:k(),body:JSON.stringify(C(e))});if(!n.ok)throw new Error(`instruckt: failed to update annotation (${n.status})`);return h(await n.json())}async addReply(t,e,n="human"){let o=await fetch(`${this.endpoint}/annotations/${t}/reply`,{method:"POST",headers:k(),body:JSON.stringify({role:n,content:e})});if(!o.ok)throw new Error(`instruckt: failed to add reply (${o.status})`);return h(await o.json())}};var x=class{constructor(t,e,n){this.endpoint=t;this.sessionId=e;this.onUpdate=n;this.source=null}connect(){this.source||(this.source=new EventSource(`${this.endpoint}/sessions/${this.sessionId}/events`),this.source.addEventListener("annotation.updated",t=>{try{let e=JSON.parse(t.data),n=I(e);this.onUpdate(n)}catch(e){}}),this.source.onerror=()=>{})}disconnect(){var t;(t=this.source)==null||t.close(),this.source=null}};var Z=`
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`,O=`
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
`,M=`
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
`,tt=`
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
`;function B(){if(document.getElementById("instruckt-global"))return;let i=document.createElement("style");i.id="instruckt-global",i.textContent=Z+tt,document.head.appendChild(i)}var f={annotate:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',freeze:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'},w=class{constructor(t,e){this.position=t;this.callbacks=e;this.mode="idle";this.dragging=!1;this.dragOffset={x:0,y:0};this.build(),this.setupDrag()}build(){this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=O,this.shadow.appendChild(t);let e=document.createElement("div");e.className="toolbar",this.annotateBtn=this.makeBtn(f.annotate,"Annotate elements (A)",()=>{let s=this.mode!=="annotating";this.setMode(s?"annotating":"idle"),this.callbacks.onToggleAnnotate(s)}),this.freezeBtn=this.makeBtn(f.freeze,"Freeze animations (F)",()=>{let s=this.mode!=="frozen";this.setMode(s?"frozen":"idle"),this.callbacks.onFreezeAnimations(s)}),this.copyBtn=this.makeBtn(f.copy,"Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.innerHTML=f.check,setTimeout(()=>{this.copyBtn.innerHTML=f.copy},1200)});let n=document.createElement("div");n.className="divider";let o=document.createElement("div");o.className="divider",e.append(this.annotateBtn,n,this.freezeBtn,o,this.copyBtn),this.shadow.appendChild(e),this.applyPosition(),document.body.appendChild(this.host)}makeBtn(t,e,n){let o=document.createElement("button");return o.className="btn",o.title=e,o.setAttribute("aria-label",e),o.innerHTML=t,o.addEventListener("click",s=>{s.stopPropagation(),n()}),o}applyPosition(){let t="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?t:"auto",top:this.position.includes("top")?t:"auto",right:this.position.includes("right")?t:"auto",left:this.position.includes("left")?t:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",t=>{if(t.target.closest(".btn"))return;this.dragging=!0;let e=this.host.getBoundingClientRect();this.dragOffset={x:t.clientX-e.left,y:t.clientY-e.top},t.preventDefault()}),document.addEventListener("mousemove",t=>{this.dragging&&Object.assign(this.host.style,{left:`${t.clientX-this.dragOffset.x}px`,top:`${t.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMode(t){this.mode=t,this.annotateBtn.classList.toggle("active",t==="annotating"),this.freezeBtn.classList.toggle("active",t==="frozen"),document.body.classList.toggle("ik-annotating",t==="annotating")}setAnnotationCount(t){let e=this.annotateBtn.querySelector(".badge");t>0?(e||(e=document.createElement("span"),e.className="badge",this.annotateBtn.appendChild(e)),e.textContent=t>99?"99+":String(t)):e==null||e.remove()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var E=class{constructor(){this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),document.body.appendChild(this.el)}show(t){let e=t.getBoundingClientRect();if(e.width===0&&e.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function p(i){return String(i!=null?i:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var A=class{constructor(){this.host=null;this.shadow=null;this.boundOutside=t=>{this.host&&!this.host.contains(t.target)&&this.destroy()}}showNew(t,e){this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=M,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let s=t.framework?`<div class="fw-badge">${p(t.framework.component)}</div>`:"",r=t.selectedText?`<div class="selected-text">"${p(t.selectedText.slice(0,80))}"</div>`:"";o.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${p(t.elementPath)}">${p(t.elementName)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${s}${r}
      <textarea placeholder="What needs to change here?" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" disabled>Add note</button>
      </div>
    `;let a=o.querySelector("textarea"),d=o.querySelector('[data-action="submit"]');a.addEventListener("input",()=>{d.disabled=a.value.trim().length===0}),a.addEventListener("keydown",l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),d.disabled||d.click()),l.key==="Escape"&&(e.onCancel(),this.destroy())}),o.querySelector('[data-action="cancel"]').addEventListener("click",()=>{e.onCancel(),this.destroy()}),o.querySelector(".close-btn").addEventListener("click",()=>{e.onCancel(),this.destroy()}),d.addEventListener("click",()=>{let l=a.value.trim();l&&(e.onSubmit({comment:l}),this.destroy())}),this.shadow.appendChild(o),document.body.appendChild(this.host),this.positionHost(t.x,t.y),this.setupOutsideClick(),a.focus()}showThread(t,e){var d;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=M,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let s=l=>`<span class="status-badge ${p(l)}">${p(l)}</span>`,r=((d=t.thread)!=null?d:[]).map(l=>`
      <div class="msg">
        <div class="msg-role ${p(l.role)}">${l.role==="agent"?"\u{1F916} Agent":"\u{1F464} You"}</div>
        <div class="msg-content">${p(l.content)}</div>
      </div>
    `).join(""),a=["pending","acknowledged"].includes(t.status);if(o.innerHTML=`
      <div class="header">
        <span class="element-tag">${p(t.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${s(t.status)}
      <div class="selected-text" style="margin-top:8px;">${p(t.comment)}</div>
      ${r?`<div class="thread">${r}</div>`:""}
      ${a?`
        <div class="thread" style="margin-top:8px;">
          <textarea placeholder="Add a reply\u2026" rows="2"></textarea>
          <div class="actions" style="margin-top:6px;">
            <button class="btn-secondary" data-action="resolve">Mark resolved</button>
            <button class="btn-primary" data-action="reply" disabled>Reply</button>
          </div>
        </div>
      `:""}
    `,o.querySelector(".close-btn").addEventListener("click",()=>this.destroy()),a){let l=o.querySelector("textarea"),c=o.querySelector('[data-action="reply"]');l.addEventListener("input",()=>{c.disabled=l.value.trim().length===0}),c.addEventListener("click",()=>{let u=l.value.trim();u&&(e.onReply(t,u),this.destroy())}),o.querySelector('[data-action="resolve"]').addEventListener("click",()=>{e.onResolve(t),this.destroy()})}this.shadow.appendChild(o),document.body.appendChild(this.host),this.positionHost(window.innerWidth/2-170,window.innerHeight/2-150),this.setupOutsideClick()}positionHost(t,e){this.host&&(Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var l,c;if(!this.host)return;let n=360,o=(c=(l=this.host.querySelector(".popup"))==null?void 0:l.getBoundingClientRect().height)!=null?c:300,s=window.innerWidth,r=window.innerHeight,a=Math.max(10,Math.min(t+10,s-n)),d=Math.max(10,Math.min(e+10,r-o-10));Object.assign(this.host.style,{left:`${a}px`,top:`${d}px`})}))}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var t;(t=this.host)==null||t.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var S=class{constructor(t){this.onClick=t;this.markers=new Map;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),document.body.appendChild(this.container)}upsert(t,e){let n=this.markers.get(t.id);if(n){this.updateStyle(n.el,t);return}let o=document.createElement("div");o.className=`ik-marker ${this.statusClass(t.status)}`,o.textContent=String(e),o.title=t.comment.slice(0,60),o.style.pointerEvents="all",o.style.left=`${t.x/100*window.innerWidth}px`,o.style.top=`${t.y-window.scrollY}px`,o.addEventListener("click",s=>{s.stopPropagation(),this.onClick(t)}),this.container.appendChild(o),this.markers.set(t.id,{el:o,annotationId:t.id})}update(t){let e=this.markers.get(t.id);e&&this.updateStyle(e.el,t)}updateStyle(t,e){t.className=`ik-marker ${this.statusClass(e.status)}`,t.title=e.comment.slice(0,60)}statusClass(t){return t==="resolved"?"resolved":t==="dismissed"?"dismissed":t==="acknowledged"?"acknowledged":""}reposition(t){t.forEach(e=>{let n=this.markers.get(e.id);n&&(n.el.style.left=`${e.x/100*window.innerWidth}px`,n.el.style.top=`${e.y-window.scrollY}px`)})}remove(t){let e=this.markers.get(t);e&&(e.el.remove(),this.markers.delete(t))}destroy(){this.container.remove(),this.markers.clear()}};function F(i){if(i.id)return`#${CSS.escape(i.id)}`;let t=[],e=i;for(;e&&e!==document.documentElement;){let n=e.tagName.toLowerCase(),o=e.parentElement;if(!o){t.unshift(n);break}let s=Array.from(e.classList).filter(a=>!a.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(s.length>0){let a=`${n}.${s.map(CSS.escape).join(".")}`;if(o.querySelectorAll(a).length===1){t.unshift(a);break}}let r=Array.from(o.children).filter(a=>a.tagName===e.tagName);if(r.length===1)t.unshift(n);else{let a=r.indexOf(e)+1;t.unshift(`${n}:nth-of-type(${a})`)}e=o}return t.join(" > ")}function _(i){let t=i.getAttribute("wire:model")||i.getAttribute("wire:click");if(t)return`wire:${t.split(".")[0]}`;let e=i.getAttribute("aria-label");if(e)return e;let n=i.id;if(n)return`#${n}`;let o=i.tagName.toLowerCase(),s=i.getAttribute("role");if(s)return`${o}[${s}]`;let r=i.classList[0];return r?`${o}.${r}`:o}function N(i){return(i.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function j(i){return Array.from(i.classList).filter(t=>!t.match(/^(instruckt-)/)).join(" ")}function H(i){let t=i.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function et(){return typeof window.Livewire!="undefined"}function nt(i){let t=i;for(;t&&t!==document.documentElement;){if(t.getAttribute("wire:id"))return t;t=t.parentElement}return null}function K(i){var s,r;if(!et())return null;let t=nt(i);if(!t)return null;let e=t.getAttribute("wire:id"),n="Unknown",o=t.getAttribute("wire:snapshot");if(o)try{let a=JSON.parse(o);n=(r=(s=a==null?void 0:a.memo)==null?void 0:s.name)!=null?r:"Unknown"}catch(a){}return{framework:"livewire",component:n,wire_id:e}}function it(i){var e;let t=i;for(;t&&t!==document.documentElement;){let n=(e=t.__vueParentComponent)!=null?e:t.__vue__;if(n)return n;t=t.parentElement}return null}function U(i){var o,s,r,a,d,l,c,u;let t=it(i);if(!t)return null;let e=(u=(c=(d=(r=(o=t.$options)==null?void 0:o.name)!=null?r:(s=t.$options)==null?void 0:s.__name)!=null?d:(a=t.type)==null?void 0:a.name)!=null?c:(l=t.type)==null?void 0:l.__name)!=null?u:"Anonymous",n={};if(t.props&&Object.assign(n,t.props),t.setupState){for(let[m,g]of Object.entries(t.setupState))if(!m.startsWith("_")&&typeof g!="function")try{n[m]=JSON.parse(JSON.stringify(g))}catch(L){n[m]=String(g)}}return{framework:"vue",component:e,component_uid:t.uid!==void 0?String(t.uid):void 0,data:n}}function rt(i){let t=i;for(;t&&t!==document.documentElement;){if(t.__svelte_meta)return t.__svelte_meta;t=t.parentElement}return null}function q(i){var o,s,r,a;let t=rt(i);if(!t)return null;let e=(s=(o=t.loc)==null?void 0:o.file)!=null?s:"";return{framework:"svelte",component:e&&(a=(r=e.split("/").pop())==null?void 0:r.replace(/\.svelte$/,""))!=null?a:"Unknown",data:e?{file:e}:void 0}}function lt(i){for(let t of Object.keys(i))if(t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$"))return t;return null}function dt(i){let t=i;for(;t;){let{type:e}=t;if(typeof e=="function"&&e.name){let n=e.name;if(n[0]===n[0].toUpperCase()&&n.length>1)return n}if(typeof e=="object"&&e!==null&&e.displayName)return e.displayName;t=t.return}return"Component"}function ct(i){var n,o;let t=(o=(n=i.memoizedProps)!=null?n:i.pendingProps)!=null?o:{},e={};for(let[s,r]of Object.entries(t))if(!(s==="children"||typeof r=="function"))try{e[s]=JSON.parse(JSON.stringify(r))}catch(a){e[s]=String(r)}return e}function Y(i){let t=i;for(;t&&t!==document.documentElement;){let e=lt(t);if(e){let n=t[e];if(n){let o=dt(n),s=ct(n);return{framework:"react",component:o,data:s}}}t=t.parentElement}return null}var $="instruckt_session",v=class{constructor(t){this.sse=null;this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.session=null;this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.rafId=null;this.pendingMouseTarget=null;this.mutationObserver=null;this.boundMouseMove=t=>{this.pendingMouseTarget=t.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var e,n;this.rafId=null,this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(e=this.highlight)==null||e.show(this.pendingMouseTarget):(n=this.highlight)==null||n.hide()}))};this.boundMouseLeave=()=>{var t;(t=this.highlight)==null||t.hide()};this.boundClick=t=>{var u,m,g;let e=t.target;if(this.isInstruckt(e))return;t.preventDefault(),t.stopPropagation();let n=((u=window.getSelection())==null?void 0:u.toString().trim())||void 0,o=F(e),s=_(e),r=j(e),a=N(e)||void 0,d=H(e),l=(m=this.detectFramework(e))!=null?m:void 0,c={element:e,elementPath:o,elementName:s,cssClasses:r,boundingBox:d,x:t.clientX,y:t.clientY,selectedText:n,nearbyText:a,framework:l};(g=this.popup)==null||g.showNew(c,{onSubmit:L=>this.submitAnnotation(c,L.comment),onCancel:()=>{}})};this.config=P({adapters:["livewire","vue","svelte","react"],theme:"auto",position:"bottom-right"},t),this.api=new y(t.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.boundScroll=this.onScrollResize.bind(this),this.boundResize=this.onScrollResize.bind(this),this.init()}async init(){B(),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new w(this.config.position,{onToggleAnnotate:t=>this.setAnnotating(t),onFreezeAnimations:t=>this.setFrozen(t),onCopy:()=>this.copyAnnotations()}),this.highlight=new E,this.popup=new A,this.markers=new S(t=>this.onMarkerClick(t)),document.addEventListener("keydown",this.boundKeydown),window.addEventListener("scroll",this.boundScroll,{passive:!0}),window.addEventListener("resize",this.boundResize,{passive:!0}),this.setupMutationObserver(),await this.connectSession()}async connectSession(){var e,n,o,s;let t=sessionStorage.getItem($);if(t)try{let r=await this.api.getSession(t);this.session=r,this.annotations=(e=r.annotations)!=null?e:[],this.syncMarkersFromAnnotations(),(n=this.toolbar)==null||n.setAnnotationCount(this.pendingCount()),this.connectSSE(t);return}catch(r){sessionStorage.removeItem($)}try{this.session=await this.api.createSession(window.location.href),sessionStorage.setItem($,this.session.id),(s=(o=this.config).onSessionCreate)==null||s.call(o,this.session),this.connectSSE(this.session.id)}catch(r){console.warn("[instruckt] Could not connect to server \u2014 running offline.")}}connectSSE(t){this.sse=new x(this.config.endpoint,t,e=>{this.onAnnotationUpdated(e)}),this.sse.connect()}setAnnotating(t){var e;t&&this.isFrozen&&this.setFrozen(!1),this.isAnnotating=t,t?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(e=this.highlight)==null||e.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null))}setFrozen(t){var e,n;t&&this.isAnnotating&&(this.setAnnotating(!1),(e=this.toolbar)==null||e.setMode("idle")),this.isFrozen=t,t?(this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze",this.frozenStyleEl.textContent=`
        *, *::before, *::after { animation-play-state: paused !important; transition: none !important; }
        video { filter: none !important; }
      `,document.head.appendChild(this.frozenStyleEl)):((n=this.frozenStyleEl)==null||n.remove(),this.frozenStyleEl=null)}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave),document.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave),document.removeEventListener("click",this.boundClick,!0)}isInstruckt(t){return t.closest("[data-instruckt]")!==null}detectFramework(t){var n;let e=(n=this.config.adapters)!=null?n:[];if(e.includes("livewire")){let o=K(t);if(o)return o}if(e.includes("vue")){let o=U(t);if(o)return o}if(e.includes("svelte")){let o=q(t);if(o)return o}if(e.includes("react")){let o=Y(t);if(o)return o}return null}async submitAnnotation(t,e){var o,s,r,a;if(!this.session&&(await this.connectSession(),!this.session)){console.warn("[instruckt] No session \u2014 annotation not saved.");return}let n={x:t.x/window.innerWidth*100,y:t.y+window.scrollY,comment:e,element:t.elementName,elementPath:t.elementPath,cssClasses:t.cssClasses,boundingBox:t.boundingBox,selectedText:t.selectedText,nearbyText:t.nearbyText,intent:"fix",severity:"important",framework:t.framework,url:window.location.href};try{let d=await this.api.addAnnotation(this.session.id,n);this.annotations.push(d),(o=this.markers)==null||o.upsert(d,this.annotations.length),(s=this.toolbar)==null||s.setAnnotationCount(this.pendingCount()),(a=(r=this.config).onAnnotationAdd)==null||a.call(r,d)}catch(d){console.error("[instruckt] Failed to save annotation:",d)}}onMarkerClick(t){var e;(e=this.popup)==null||e.showThread(t,{onResolve:async n=>{try{let o=await this.api.updateAnnotation(n.id,{status:"resolved"});this.onAnnotationUpdated(o)}catch(o){console.error("[instruckt] Failed to resolve annotation:",o)}},onReply:async(n,o)=>{try{let s=await this.api.addReply(n.id,o,"human");this.onAnnotationUpdated(s)}catch(s){console.error("[instruckt] Failed to add reply:",s)}}})}onAnnotationUpdated(t){var n,o,s,r,a;let e=this.annotations.findIndex(d=>d.id===t.id);e>=0?(this.annotations[e]=t,(n=this.markers)==null||n.update(t)):(this.annotations.push(t),(o=this.markers)==null||o.upsert(t,this.annotations.length)),(s=this.toolbar)==null||s.setAnnotationCount(this.pendingCount()),(a=(r=this.config).onAnnotationResolve)==null||a.call(r,t)}setupMutationObserver(){this.mutationObserver=new MutationObserver(t=>{var n;t.some(o=>o.removedNodes.length>0)&&((n=this.markers)==null||n.reposition(this.annotations))}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0})}onScrollResize(){var t;(t=this.markers)==null||t.reposition(this.annotations)}onKeydown(t){var n,o,s;let e=t.target;if(!["INPUT","TEXTAREA","SELECT"].includes(e.tagName)&&!e.closest('[contenteditable="true"]')){if(t.key==="a"&&!t.metaKey&&!t.ctrlKey&&!t.altKey){let r=!this.isAnnotating;(n=this.toolbar)==null||n.setMode(r?"annotating":"idle"),this.setAnnotating(r)}if(t.key==="f"&&!t.metaKey&&!t.ctrlKey&&!t.altKey){let r=!this.isFrozen;(o=this.toolbar)==null||o.setMode(r?"frozen":"idle"),this.setFrozen(r)}t.key==="Escape"&&this.isAnnotating&&((s=this.toolbar)==null||s.setMode("idle"),this.setAnnotating(!1))}}pendingCount(){return this.annotations.filter(t=>t.status==="pending"||t.status==="acknowledged").length}syncMarkersFromAnnotations(){this.annotations.forEach((t,e)=>{var n;return(n=this.markers)==null?void 0:n.upsert(t,e+1)})}copyAnnotations(){let t=this.exportMarkdown();navigator.clipboard.writeText(t).catch(()=>{let e=document.createElement("textarea");e.value=t,e.style.cssText="position:fixed;left:-9999px",document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove()})}exportMarkdown(){let t=this.annotations.filter(n=>n.status==="pending"||n.status==="acknowledged");if(t.length===0)return`## Instruckt Feedback \u2014 ${window.location.href}

No open annotations.`;let e=[`## Instruckt Feedback \u2014 ${window.location.href}`,`> ${t.length} open annotation${t.length===1?"":"s"}`,""];return t.forEach((n,o)=>{let s=n.severity==="blocking"?"\u{1F534}":n.severity==="important"?"\u{1F7E0}":"\u{1F7E1}",r=n.intent==="fix"?"Fix":n.intent==="change"?"Change":n.intent==="question"?"Question":"Approve";if(e.push(`### ${o+1}. ${n.element} \u2014 ${r} ${s}`),e.push(""),e.push(n.comment),e.push(""),e.push(`**Selector**: \`${n.elementPath}\``),n.framework){let a=n.framework,d=a.framework==="livewire"?`Livewire \u2014 ${a.component}`:a.framework==="vue"?`Vue \u2014 ${a.component}`:a.framework==="react"?`React \u2014 ${a.component}`:a.component;e.push(`**Component**: ${d}`)}n.selectedText&&e.push(`**Selected text**: "${n.selectedText}"`),n.thread&&n.thread.length>0&&(e.push(""),e.push("**Thread:**"),n.thread.forEach(a=>{e.push(`- **${a.role==="agent"?"Agent":"You"}**: ${a.content}`)})),e.push(""),e.push("---"),e.push("")}),e.join(`
`)}getAnnotations(){return[...this.annotations]}getSession(){return this.session}destroy(){var t,e,n,o,s,r;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),window.removeEventListener("scroll",this.boundScroll),window.removeEventListener("resize",this.boundResize),(t=this.mutationObserver)==null||t.disconnect(),(e=this.sse)==null||e.disconnect(),(n=this.toolbar)==null||n.destroy(),(o=this.highlight)==null||o.destroy(),(s=this.popup)==null||s.destroy(),(r=this.markers)==null||r.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId)}};function ut(i){return new v(i)}return G(ht);})();
//# sourceMappingURL=instruckt.iife.js.map