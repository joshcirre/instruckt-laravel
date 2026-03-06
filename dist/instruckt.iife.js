/* instruckt v0.1.0 | MIT */
"use strict";var Instruckt=(()=>{var f=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var K=Object.getOwnPropertyNames,L=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var $=(i,t,e)=>t in i?f(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,T=(i,t)=>{for(var e in t||(t={}))M.call(t,e)&&$(i,e,t[e]);if(L)for(var e of L(t))U.call(t,e)&&$(i,e,t[e]);return i};var Y=(i,t)=>{for(var e in t)f(i,e,{get:t[e],enumerable:!0})},V=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of K(t))!M.call(i,o)&&o!==e&&f(i,o,{get:()=>t[o],enumerable:!(n=q(t,o))||n.enumerable});return i};var J=i=>V(f({},"__esModule",{value:!0}),i);var ct={};Y(ct,{Instruckt:()=>g,init:()=>dt});function W(){let i=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return i?decodeURIComponent(i[1]):""}function v(){let i={"Content-Type":"application/json",Accept:"application/json"},t=W();return t&&(i["X-XSRF-TOKEN"]=t),i}var b=class{constructor(t){this.endpoint=t}async createSession(t){let e=await fetch(`${this.endpoint}/sessions`,{method:"POST",headers:v(),body:JSON.stringify({url:t})});if(!e.ok)throw new Error(`instruckt: failed to create session (${e.status})`);return e.json()}async getSession(t){let e=await fetch(`${this.endpoint}/sessions/${t}`,{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`instruckt: failed to get session (${e.status})`);return e.json()}async addAnnotation(t,e){let n=await fetch(`${this.endpoint}/sessions/${t}/annotations`,{method:"POST",headers:v(),body:JSON.stringify(e)});if(!n.ok)throw new Error(`instruckt: failed to add annotation (${n.status})`);return n.json()}async updateAnnotation(t,e){let n=await fetch(`${this.endpoint}/annotations/${t}`,{method:"PATCH",headers:v(),body:JSON.stringify(e)});if(!n.ok)throw new Error(`instruckt: failed to update annotation (${n.status})`);return n.json()}async addReply(t,e,n="human"){let o=await fetch(`${this.endpoint}/annotations/${t}/reply`,{method:"POST",headers:v(),body:JSON.stringify({role:n,content:e})});if(!o.ok)throw new Error(`instruckt: failed to add reply (${o.status})`);return o.json()}};var k=class{constructor(t,e,n){this.endpoint=t;this.sessionId=e;this.onUpdate=n;this.source=null}connect(){this.source||(this.source=new EventSource(`${this.endpoint}/sessions/${this.sessionId}/events`),this.source.addEventListener("annotation.updated",t=>{try{let e=JSON.parse(t.data);this.onUpdate(e)}catch(e){}}),this.source.onerror=()=>{})}disconnect(){var t;(t=this.source)==null||t.close(),this.source=null}};var X=`
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`,z=`
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
    --ik-bg: #1c1c1e; --ik-bg2: #2c2c2e; --ik-border: #3a3a3c;
    --ik-text: #f4f4f5; --ik-muted: #a1a1aa;
    --ik-shadow: 0 4px 24px rgba(0,0,0,.5);
  }
}

:host {
  --ik-accent: #6366f1;
  --ik-accent-h: #4f46e5;
  --ik-bg: #ffffff;
  --ik-bg2: #f8f8f8;
  --ik-border: #e4e4e7;
  --ik-text: #18181b;
  --ik-muted: #71717a;
  --ik-shadow: 0 4px 24px rgba(0,0,0,.12);
}

.toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: var(--ik-bg);
  border: 1px solid var(--ik-border);
  border-radius: 14px;
  padding: 8px 6px;
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
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--ik-muted);
  cursor: pointer;
  padding: 0;
  font-size: 17px;
  line-height: 1;
  position: relative;
  transition: background .1s, color .1s;
}
.btn:hover { background: var(--ik-bg2); color: var(--ik-text); }
.btn.active { background: var(--ik-accent); color: #fff; }
.btn.active:hover { background: var(--ik-accent-h); }

.divider { width: 20px; height: 1px; background: var(--ik-border); margin: 2px 0; }

.badge {
  position: absolute;
  top: -4px; right: -4px;
  min-width: 16px; height: 16px;
  background: var(--ik-accent);
  color: #fff;
  border-radius: 8px;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
}
`,A=`
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
`,D=`
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
`;function I(){if(document.getElementById("instruckt-global"))return;let i=document.createElement("style");i.id="instruckt-global",i.textContent=X+D,document.head.appendChild(i)}var y=class{constructor(t,e){this.position=t;this.callbacks=e;this.mode="idle";this.dragging=!1;this.dragOffset={x:0,y:0};this.build(),this.setupDrag()}build(){this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=z,this.shadow.appendChild(t);let e=document.createElement("div");e.className="toolbar",this.annotateBtn=this.makeBtn("\u270F\uFE0F","Annotate elements (A)",()=>{let s=this.mode!=="annotating";this.setMode(s?"annotating":"idle"),this.callbacks.onToggleAnnotate(s)}),this.freezeBtn=this.makeBtn("\u23F8","Freeze animations (F)",()=>{let s=this.mode!=="frozen";this.setMode(s?"frozen":"idle"),this.callbacks.onFreezeAnimations(s)}),this.copyBtn=this.makeBtn("\u{1F4CB}","Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.textContent="\u2713",setTimeout(()=>{this.copyBtn.textContent="\u{1F4CB}"},1200)});let n=document.createElement("div");n.className="divider";let o=document.createElement("div");o.className="divider",e.append(this.annotateBtn,n,this.freezeBtn,o,this.copyBtn),this.shadow.appendChild(e),this.applyPosition(),document.body.appendChild(this.host)}makeBtn(t,e,n){let o=document.createElement("button");return o.className="btn",o.title=e,o.setAttribute("aria-label",e),o.textContent=t,o.addEventListener("click",s=>{s.stopPropagation(),n()}),o}applyPosition(){let t="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?t:"auto",top:this.position.includes("top")?t:"auto",right:this.position.includes("right")?t:"auto",left:this.position.includes("left")?t:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",t=>{if(t.target.closest(".btn"))return;this.dragging=!0;let e=this.host.getBoundingClientRect();this.dragOffset={x:t.clientX-e.left,y:t.clientY-e.top},t.preventDefault()}),document.addEventListener("mousemove",t=>{this.dragging&&Object.assign(this.host.style,{left:`${t.clientX-this.dragOffset.x}px`,top:`${t.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMode(t){this.mode=t,this.annotateBtn.classList.toggle("active",t==="annotating"),this.freezeBtn.classList.toggle("active",t==="frozen"),document.body.classList.toggle("ik-annotating",t==="annotating")}setAnnotationCount(t){let e=this.annotateBtn.querySelector(".badge");t>0?(e||(e=document.createElement("span"),e.className="badge",this.annotateBtn.appendChild(e)),e.textContent=t>99?"99+":String(t)):e==null||e.remove()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var x=class{constructor(){this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),document.body.appendChild(this.el)}show(t){let e=t.getBoundingClientRect();if(e.width===0&&e.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function p(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(i){var t;return(t={livewire:"\u26A1",vue:"\u{1F49A}",svelte:"\u{1F9E1}"}[i])!=null?t:"\u{1F527}"}var w=class{constructor(){this.host=null;this.shadow=null;this.intent="fix";this.severity="important";this.boundOutside=t=>{this.host&&!this.host.contains(t.target)&&this.destroy()}}showNew(t,e){this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=A,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let s=t.framework?`<div class="fw-badge">${G(t.framework.framework)} ${p(t.framework.component)}</div>`:"",r=t.selectedText?`<div class="selected-text">"${p(t.selectedText.slice(0,80))}"</div>`:"";o.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${p(t.elementPath)}">${p(t.elementName)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${s}${r}
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
    `,this.wireChips(o,"intent",l=>{this.intent=l}),this.wireChips(o,"severity",l=>{this.severity=l});let a=o.querySelector("textarea"),d=o.querySelector('[data-action="submit"]');a.addEventListener("input",()=>{d.disabled=a.value.trim().length===0}),a.addEventListener("keydown",l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),d.disabled||d.click()),l.key==="Escape"&&(e.onCancel(),this.destroy())}),o.querySelector('[data-action="cancel"]').addEventListener("click",()=>{e.onCancel(),this.destroy()}),o.querySelector(".close-btn").addEventListener("click",()=>{e.onCancel(),this.destroy()}),d.addEventListener("click",()=>{let l=a.value.trim();l&&(e.onSubmit({comment:l,intent:this.intent,severity:this.severity}),this.destroy())}),this.shadow.appendChild(o),document.body.appendChild(this.host),this.positionHost(t.x,t.y),this.setupOutsideClick(),a.focus()}showThread(t,e){var d;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.shadow=this.host.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=A,this.shadow.appendChild(n);let o=document.createElement("div");o.className="popup";let s=l=>`<span class="status-badge ${p(l)}">${p(l)}</span>`,r=((d=t.thread)!=null?d:[]).map(l=>`
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
    `,o.querySelector(".close-btn").addEventListener("click",()=>this.destroy()),a){let l=o.querySelector("textarea"),c=o.querySelector('[data-action="reply"]');l.addEventListener("input",()=>{c.disabled=l.value.trim().length===0}),c.addEventListener("click",()=>{let u=l.value.trim();u&&(e.onReply(t,u),this.destroy())}),o.querySelector('[data-action="resolve"]').addEventListener("click",()=>{e.onResolve(t),this.destroy()})}this.shadow.appendChild(o),document.body.appendChild(this.host),this.positionHost(window.innerWidth/2-170,window.innerHeight/2-150),this.setupOutsideClick()}wireChips(t,e,n){t.querySelectorAll(`[data-group="${e}"] .chip`).forEach(o=>{o.addEventListener("click",()=>{t.querySelectorAll(`[data-group="${e}"] .chip`).forEach(s=>s.classList.remove("sel")),o.classList.add("sel"),n(o.dataset.value)})})}positionHost(t,e){this.host&&(Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var l,c;if(!this.host)return;let n=360,o=(c=(l=this.host.querySelector(".popup"))==null?void 0:l.getBoundingClientRect().height)!=null?c:300,s=window.innerWidth,r=window.innerHeight,a=Math.max(10,Math.min(t+10,s-n)),d=Math.max(10,Math.min(e+10,r-o-10));Object.assign(this.host.style,{left:`${a}px`,top:`${d}px`})}))}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var t;(t=this.host)==null||t.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var E=class{constructor(t){this.onClick=t;this.markers=new Map;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),document.body.appendChild(this.container)}upsert(t,e){let n=this.markers.get(t.id);if(n){this.updateStyle(n.el,t);return}let o=document.createElement("div");o.className=`ik-marker ${this.statusClass(t.status)}`,o.textContent=String(e),o.title=t.comment.slice(0,60),o.style.pointerEvents="all",o.style.left=`${t.x/100*window.innerWidth}px`,o.style.top=`${t.y-window.scrollY}px`,o.addEventListener("click",s=>{s.stopPropagation(),this.onClick(t)}),this.container.appendChild(o),this.markers.set(t.id,{el:o,annotationId:t.id})}update(t){let e=this.markers.get(t.id);e&&this.updateStyle(e.el,t)}updateStyle(t,e){t.className=`ik-marker ${this.statusClass(e.status)}`,t.title=e.comment.slice(0,60)}statusClass(t){return t==="resolved"?"resolved":t==="dismissed"?"dismissed":t==="acknowledged"?"acknowledged":""}reposition(t){t.forEach(e=>{let n=this.markers.get(e.id);n&&(n.el.style.left=`${e.x/100*window.innerWidth}px`,n.el.style.top=`${e.y-window.scrollY}px`)})}remove(t){let e=this.markers.get(t);e&&(e.el.remove(),this.markers.delete(t))}destroy(){this.container.remove(),this.markers.clear()}};function P(i){if(i.id)return`#${CSS.escape(i.id)}`;let t=[],e=i;for(;e&&e!==document.documentElement;){let n=e.tagName.toLowerCase(),o=e.parentElement;if(!o){t.unshift(n);break}let s=Array.from(e.classList).filter(a=>!a.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(s.length>0){let a=`${n}.${s.map(CSS.escape).join(".")}`;if(o.querySelectorAll(a).length===1){t.unshift(a);break}}let r=Array.from(o.children).filter(a=>a.tagName===e.tagName);if(r.length===1)t.unshift(n);else{let a=r.indexOf(e)+1;t.unshift(`${n}:nth-of-type(${a})`)}e=o}return t.join(" > ")}function R(i){let t=i.getAttribute("wire:model")||i.getAttribute("wire:click");if(t)return`wire:${t.split(".")[0]}`;let e=i.getAttribute("aria-label");if(e)return e;let n=i.id;if(n)return`#${n}`;let o=i.tagName.toLowerCase(),s=i.getAttribute("role");if(s)return`${o}[${s}]`;let r=i.classList[0];return r?`${o}.${r}`:o}function O(i){return(i.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function F(i){return Array.from(i.classList).filter(t=>!t.match(/^(instruckt-)/)).join(" ")}function B(i){let t=i.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function Q(){return typeof window.Livewire!="undefined"}function Z(i){let t=i;for(;t&&t!==document.documentElement;){let e=t.getAttribute("wire:id");if(e)return e;t=t.parentElement}return null}function _(i){var s,r;if(!Q())return null;let t=Z(i);if(!t)return null;let e=window.Livewire.find(t);if(!e)return null;let n=(r=(s=e.snapshot)==null?void 0:s.data)!=null?r:{},o={};for(let a of Object.keys(n))try{o[a]=e.get(a)}catch(d){}return{framework:"livewire",component:e.name,wire_id:t,data:o}}function et(i){var e;let t=i;for(;t&&t!==document.documentElement;){let n=(e=t.__vueParentComponent)!=null?e:t.__vue__;if(n)return n;t=t.parentElement}return null}function N(i){var o,s,r,a,d,l,c,u;let t=et(i);if(!t)return null;let e=(u=(c=(d=(r=(o=t.$options)==null?void 0:o.name)!=null?r:(s=t.$options)==null?void 0:s.__name)!=null?d:(a=t.type)==null?void 0:a.name)!=null?c:(l=t.type)==null?void 0:l.__name)!=null?u:"Anonymous",n={};if(t.props&&Object.assign(n,t.props),t.setupState){for(let[h,m]of Object.entries(t.setupState))if(!h.startsWith("_")&&typeof m!="function")try{n[h]=JSON.parse(JSON.stringify(m))}catch(C){n[h]=String(m)}}return{framework:"vue",component:e,component_uid:t.uid!==void 0?String(t.uid):void 0,data:n}}function ot(i){let t=i;for(;t&&t!==document.documentElement;){if(t.__svelte_meta)return t.__svelte_meta;t=t.parentElement}return null}function j(i){var o,s,r,a;let t=ot(i);if(!t)return null;let e=(s=(o=t.loc)==null?void 0:o.file)!=null?s:"";return{framework:"svelte",component:e&&(a=(r=e.split("/").pop())==null?void 0:r.replace(/\.svelte$/,""))!=null?a:"Unknown",data:e?{file:e}:void 0}}function st(i){for(let t of Object.keys(i))if(t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$"))return t;return null}function rt(i){let t=i;for(;t;){let{type:e}=t;if(typeof e=="function"&&e.name){let n=e.name;if(n[0]===n[0].toUpperCase()&&n.length>1)return n}if(typeof e=="object"&&e!==null&&e.displayName)return e.displayName;t=t.return}return"Component"}function at(i){var n,o;let t=(o=(n=i.memoizedProps)!=null?n:i.pendingProps)!=null?o:{},e={};for(let[s,r]of Object.entries(t))if(!(s==="children"||typeof r=="function"))try{e[s]=JSON.parse(JSON.stringify(r))}catch(a){e[s]=String(r)}return e}function H(i){let t=i;for(;t&&t!==document.documentElement;){let e=st(t);if(e){let n=t[e];if(n){let o=rt(n),s=at(n);return{framework:"react",component:o,data:s}}}t=t.parentElement}return null}var S="instruckt_session",g=class{constructor(t){this.sse=null;this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.session=null;this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.rafId=null;this.pendingMouseTarget=null;this.mutationObserver=null;this.boundMouseMove=t=>{this.pendingMouseTarget=t.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var e,n;this.rafId=null,this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(e=this.highlight)==null||e.show(this.pendingMouseTarget):(n=this.highlight)==null||n.hide()}))};this.boundMouseLeave=()=>{var t;(t=this.highlight)==null||t.hide()};this.boundClick=t=>{var u,h,m;let e=t.target;if(this.isInstruckt(e))return;t.preventDefault(),t.stopPropagation();let n=((u=window.getSelection())==null?void 0:u.toString().trim())||void 0,o=P(e),s=R(e),r=F(e),a=O(e)||void 0,d=B(e),l=(h=this.detectFramework(e))!=null?h:void 0,c={element:e,elementPath:o,elementName:s,cssClasses:r,boundingBox:d,x:t.clientX,y:t.clientY,selectedText:n,nearbyText:a,framework:l};(m=this.popup)==null||m.showNew(c,{onSubmit:C=>this.submitAnnotation(c,C),onCancel:()=>{}})};this.config=T({adapters:["livewire","vue","svelte","react"],theme:"auto",position:"bottom-right"},t),this.api=new b(t.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.boundScroll=this.onScrollResize.bind(this),this.boundResize=this.onScrollResize.bind(this),this.init()}async init(){I(),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new y(this.config.position,{onToggleAnnotate:t=>this.setAnnotating(t),onFreezeAnimations:t=>this.setFrozen(t),onCopy:()=>this.copyAnnotations()}),this.highlight=new x,this.popup=new w,this.markers=new E(t=>this.onMarkerClick(t)),document.addEventListener("keydown",this.boundKeydown),window.addEventListener("scroll",this.boundScroll,{passive:!0}),window.addEventListener("resize",this.boundResize,{passive:!0}),this.setupMutationObserver(),await this.connectSession()}async connectSession(){var e,n,o,s;let t=sessionStorage.getItem(S);if(t)try{let r=await this.api.getSession(t);this.session=r,this.annotations=(e=r.annotations)!=null?e:[],this.syncMarkersFromAnnotations(),(n=this.toolbar)==null||n.setAnnotationCount(this.pendingCount()),this.connectSSE(t);return}catch(r){sessionStorage.removeItem(S)}try{this.session=await this.api.createSession(window.location.href),sessionStorage.setItem(S,this.session.id),(s=(o=this.config).onSessionCreate)==null||s.call(o,this.session),this.connectSSE(this.session.id)}catch(r){console.warn("[instruckt] Could not connect to server \u2014 running offline.")}}connectSSE(t){this.sse=new k(this.config.endpoint,t,e=>{this.onAnnotationUpdated(e)}),this.sse.connect()}setAnnotating(t){var e;t&&this.isFrozen&&this.setFrozen(!1),this.isAnnotating=t,t?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(e=this.highlight)==null||e.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null))}setFrozen(t){var e,n;t&&this.isAnnotating&&(this.setAnnotating(!1),(e=this.toolbar)==null||e.setMode("idle")),this.isFrozen=t,t?(this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze",this.frozenStyleEl.textContent=`
        *, *::before, *::after { animation-play-state: paused !important; transition: none !important; }
        video { filter: none !important; }
      `,document.head.appendChild(this.frozenStyleEl)):((n=this.frozenStyleEl)==null||n.remove(),this.frozenStyleEl=null)}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave),document.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave),document.removeEventListener("click",this.boundClick,!0)}isInstruckt(t){return t.closest("[data-instruckt]")!==null}detectFramework(t){var n;let e=(n=this.config.adapters)!=null?n:[];if(e.includes("livewire")){let o=_(t);if(o)return o}if(e.includes("vue")){let o=N(t);if(o)return o}if(e.includes("svelte")){let o=j(t);if(o)return o}if(e.includes("react")){let o=H(t);if(o)return o}return null}async submitAnnotation(t,e){var o,s,r,a;if(!this.session&&(await this.connectSession(),!this.session)){console.warn("[instruckt] No session \u2014 annotation not saved.");return}let n={x:t.x/window.innerWidth*100,y:t.y+window.scrollY,comment:e.comment,element:t.elementName,elementPath:t.elementPath,cssClasses:t.cssClasses,boundingBox:t.boundingBox,selectedText:t.selectedText,nearbyText:t.nearbyText,intent:e.intent,severity:e.severity,framework:t.framework,url:window.location.href};try{let d=await this.api.addAnnotation(this.session.id,n);this.annotations.push(d),(o=this.markers)==null||o.upsert(d,this.annotations.length),(s=this.toolbar)==null||s.setAnnotationCount(this.pendingCount()),(a=(r=this.config).onAnnotationAdd)==null||a.call(r,d)}catch(d){console.error("[instruckt] Failed to save annotation:",d)}}onMarkerClick(t){var e;(e=this.popup)==null||e.showThread(t,{onResolve:async n=>{try{let o=await this.api.updateAnnotation(n.id,{status:"resolved"});this.onAnnotationUpdated(o)}catch(o){console.error("[instruckt] Failed to resolve annotation:",o)}},onReply:async(n,o)=>{try{let s=await this.api.addReply(n.id,o,"human");this.onAnnotationUpdated(s)}catch(s){console.error("[instruckt] Failed to add reply:",s)}}})}onAnnotationUpdated(t){var n,o,s,r,a;let e=this.annotations.findIndex(d=>d.id===t.id);e>=0?(this.annotations[e]=t,(n=this.markers)==null||n.update(t)):(this.annotations.push(t),(o=this.markers)==null||o.upsert(t,this.annotations.length)),(s=this.toolbar)==null||s.setAnnotationCount(this.pendingCount()),(a=(r=this.config).onAnnotationResolve)==null||a.call(r,t)}setupMutationObserver(){this.mutationObserver=new MutationObserver(t=>{var n;t.some(o=>o.removedNodes.length>0)&&((n=this.markers)==null||n.reposition(this.annotations))}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0})}onScrollResize(){var t;(t=this.markers)==null||t.reposition(this.annotations)}onKeydown(t){var n,o,s;let e=t.target;if(!["INPUT","TEXTAREA","SELECT"].includes(e.tagName)&&!e.closest('[contenteditable="true"]')){if(t.key==="a"&&!t.metaKey&&!t.ctrlKey&&!t.altKey){let r=!this.isAnnotating;(n=this.toolbar)==null||n.setMode(r?"annotating":"idle"),this.setAnnotating(r)}if(t.key==="f"&&!t.metaKey&&!t.ctrlKey&&!t.altKey){let r=!this.isFrozen;(o=this.toolbar)==null||o.setMode(r?"frozen":"idle"),this.setFrozen(r)}t.key==="Escape"&&this.isAnnotating&&((s=this.toolbar)==null||s.setMode("idle"),this.setAnnotating(!1))}}pendingCount(){return this.annotations.filter(t=>t.status==="pending"||t.status==="acknowledged").length}syncMarkersFromAnnotations(){this.annotations.forEach((t,e)=>{var n;return(n=this.markers)==null?void 0:n.upsert(t,e+1)})}copyAnnotations(){let t=this.exportMarkdown();navigator.clipboard.writeText(t).catch(()=>{let e=document.createElement("textarea");e.value=t,e.style.cssText="position:fixed;left:-9999px",document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove()})}exportMarkdown(){let t=this.annotations.filter(n=>n.status==="pending"||n.status==="acknowledged");if(t.length===0)return`## Instruckt Feedback \u2014 ${window.location.href}

No open annotations.`;let e=[`## Instruckt Feedback \u2014 ${window.location.href}`,`> ${t.length} open annotation${t.length===1?"":"s"}`,""];return t.forEach((n,o)=>{let s=n.severity==="blocking"?"\u{1F534}":n.severity==="important"?"\u{1F7E0}":"\u{1F7E1}",r=n.intent==="fix"?"Fix":n.intent==="change"?"Change":n.intent==="question"?"Question":"Approve";if(e.push(`### ${o+1}. ${n.element} \u2014 ${r} ${s}`),e.push(""),e.push(n.comment),e.push(""),e.push(`**Selector**: \`${n.elementPath}\``),n.framework){let a=n.framework,d=a.framework==="livewire"?`Livewire \u2014 ${a.component}`:a.framework==="vue"?`Vue \u2014 ${a.component}`:a.framework==="react"?`React \u2014 ${a.component}`:a.component;e.push(`**Component**: ${d}`)}n.selectedText&&e.push(`**Selected text**: "${n.selectedText}"`),n.thread&&n.thread.length>0&&(e.push(""),e.push("**Thread:**"),n.thread.forEach(a=>{e.push(`- **${a.role==="agent"?"Agent":"You"}**: ${a.content}`)})),e.push(""),e.push("---"),e.push("")}),e.join(`
`)}getAnnotations(){return[...this.annotations]}getSession(){return this.session}destroy(){var t,e,n,o,s,r;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),window.removeEventListener("scroll",this.boundScroll),window.removeEventListener("resize",this.boundResize),(t=this.mutationObserver)==null||t.disconnect(),(e=this.sse)==null||e.disconnect(),(n=this.toolbar)==null||n.destroy(),(o=this.highlight)==null||o.destroy(),(s=this.popup)==null||s.destroy(),(r=this.markers)==null||r.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId)}};function dt(i){return new g(i)}return J(ct);})();
//# sourceMappingURL=instruckt.iife.js.map