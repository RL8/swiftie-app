const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../nodes/0.w2-JWSWw.js","../chunks/Ddwy_oXt.js","../chunks/at2JBewP.js","../chunks/CLNuhidZ.js","../chunks/DXOtpNTU.js","../chunks/CEZoG4i7.js","../chunks/CUwzvw2Z.js","../chunks/CRKxx5m7.js","../chunks/B0mWjSoP.js","../chunks/BW8oWvHQ.js","../assets/StandardLayout.B_OEPx9j.css","../chunks/CE-QtlpR.js","../assets/0.iHFMLGln.css","../nodes/1.DXrhAUCm.js","../nodes/2.CXIEmFqz.js","../chunks/TPVy8YRU.js","../assets/Button.Ov7PAXA2.css","../assets/2.uwH0xr_z.css","../nodes/3.DuLJ2Nw4.js","../chunks/W-hoZut2.js","../assets/Header.BXAL20DN.css","../chunks/CIrik2_c.js","../assets/Footer.rfjECuKS.css","../nodes/4.uHgW5fOx.js","../chunks/DGrTyCxR.js","../assets/4.BbAvxR0Q.css","../nodes/5.1ASAC1IT.js","../assets/5.CvFWFo5A.css","../nodes/6.qUWkgVwg.js","../assets/6.m92YKkxD.css","../nodes/7.BjapYmAp.js"])))=>i.map(i=>d[i]);
import{t as V,h as U,C as z,E as G,p as W,I as X,d as Y,_ as O,as as Z,R as d,aD as H,am as J,a1 as K,q as Q,N as $,O as ee,Z as te,aE as w,aF as re,X as p,y as se,v as ne,x as ae,z as oe,V as x,A as ie}from"../chunks/at2JBewP.js";import{h as ce,m as ue,u as le,s as fe}from"../chunks/B0mWjSoP.js";import{b as j,a as E,f as L,t as de}from"../chunks/Ddwy_oXt.js";import{i as k,b as T}from"../chunks/DXOtpNTU.js";import{p as C,b as me}from"../chunks/CUwzvw2Z.js";function D(c,e,s){V&&U();var i=c,a,t;z(()=>{a!==(a=e())&&(t&&(X(t),t=null),a&&(t=W(()=>s(i,a))))},G),V&&(i=Y)}function _e(c){return class extends he{constructor(e){super({component:c,...e})}}}class he{#t;#e;constructor(e){var s=new Map,i=(t,r)=>{var n=K(r);return s.set(t,n),n};const a=new Proxy({...e.props||{},$$events:{}},{get(t,r){return d(s.get(r)??i(r,Reflect.get(t,r)))},has(t,r){return r===Z?!0:(d(s.get(r)??i(r,Reflect.get(t,r))),Reflect.has(t,r))},set(t,r,n){return O(s.get(r)??i(r,n),n),Reflect.set(t,r,n)}});this.#e=(e.hydrate?ce:ue)(e.component,{target:e.target,anchor:e.anchor,props:a,context:e.context,intro:e.intro??!1,recover:e.recover}),(!e?.props?.$$host||e.sync===!1)&&H(),this.#t=a.$$events;for(const t of Object.keys(this.#e))t==="$set"||t==="$destroy"||t==="$on"||J(this,t,{get(){return this.#e[t]},set(r){this.#e[t]=r},enumerable:!0});this.#e.$set=t=>{Object.assign(a,t)},this.#e.$destroy=()=>{le(this.#e)}}$set(e){this.#e.$set(e)}$on(e,s){this.#t[e]=this.#t[e]||[];const i=(...a)=>s.call(this,...a);return this.#t[e].push(i),()=>{this.#t[e]=this.#t[e].filter(a=>a!==i)}}$destroy(){this.#e.$destroy()}}const ve="modulepreload",ge=function(c,e){return new URL(c,e).href},N={},_=function(e,s,i){let a=Promise.resolve();if(s&&s.length>0){const r=document.getElementsByTagName("link"),n=document.querySelector("meta[property=csp-nonce]"),R=n?.nonce||n?.getAttribute("nonce");a=Promise.allSettled(s.map(u=>{if(u=ge(u,i),u in N)return;N[u]=!0;const m=u.endsWith(".css"),A=m?'[rel="stylesheet"]':"";if(!!i)for(let h=r.length-1;h>=0;h--){const o=r[h];if(o.href===u&&(!m||o.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${A}`))return;const l=document.createElement("link");if(l.rel=m?"stylesheet":ve,m||(l.as="script"),l.crossOrigin="",l.href=u,R&&l.setAttribute("nonce",R),document.head.appendChild(l),m)return new Promise((h,o)=>{l.addEventListener("load",h),l.addEventListener("error",()=>o(new Error(`Unable to preload CSS for ${u}`)))})}))}function t(r){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=r,window.dispatchEvent(n),!n.defaultPrevented)throw r}return a.then(r=>{for(const n of r||[])n.status==="rejected"&&t(n.reason);return e().catch(t)})},ke={};var Ee=j('<div id="svelte-announcer" aria-live="assertive" aria-atomic="true" style="position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"><!></div>'),ye=j("<!> <!>",1);function be(c,e){Q(e,!0);let s=C(e,"components",23,()=>[]),i=C(e,"data_0",3,null),a=C(e,"data_1",3,null);$(()=>e.stores.page.set(e.page)),ee(()=>{e.stores,e.page,e.constructors,s(),e.form,i(),a(),e.stores.page.notify()});let t=w(!1),r=w(!1),n=w(null);te(()=>{const o=e.stores.page.subscribe(()=>{d(t)&&(O(r,!0),re().then(()=>{O(n,me(document.title||"untitled page"))}))});return O(t,!0),o});const R=x(()=>e.constructors[1]);var u=ye(),m=p(u);{var A=o=>{var f=L();const y=x(()=>e.constructors[0]);var b=p(f);D(b,()=>d(y),(v,g)=>{T(g(v,{get data(){return i()},get form(){return e.form},children:(P,pe)=>{var S=L(),q=p(S);D(q,()=>d(R),(B,F)=>{T(F(B,{get data(){return a()},get form(){return e.form}}),M=>s()[1]=M,()=>s()?.[1])}),E(P,S)},$$slots:{default:!0}}),P=>s()[0]=P,()=>s()?.[0])}),E(o,f)},I=o=>{var f=L();const y=x(()=>e.constructors[0]);var b=p(f);D(b,()=>d(y),(v,g)=>{T(g(v,{get data(){return i()},get form(){return e.form}}),P=>s()[0]=P,()=>s()?.[0])}),E(o,f)};k(m,o=>{e.constructors[1]?o(A):o(I,!1)})}var l=se(m,2);{var h=o=>{var f=Ee(),y=ae(f);{var b=v=>{var g=de();ie(()=>fe(g,d(n))),E(v,g)};k(y,v=>{d(r)&&v(b)})}oe(f),E(o,f)};k(l,o=>{d(t)&&o(h)})}E(c,u),ne()}const Te=_e(be),Ce=[()=>_(()=>import("../nodes/0.w2-JWSWw.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]),import.meta.url),()=>_(()=>import("../nodes/1.DXrhAUCm.js"),__vite__mapDeps([13,1,2,3,8,7]),import.meta.url),()=>_(()=>import("../nodes/2.CXIEmFqz.js"),__vite__mapDeps([14,1,2,3,7,15,5,11,6,16,17]),import.meta.url),()=>_(()=>import("../nodes/3.DuLJ2Nw4.js"),__vite__mapDeps([18,1,2,3,7,9,4,5,6,10,19,8,20,21,22,15,11,16]),import.meta.url),()=>_(()=>import("../nodes/4.uHgW5fOx.js"),__vite__mapDeps([23,1,2,3,8,4,9,5,6,7,10,11,24,19,20,21,22,15,16,25]),import.meta.url),()=>_(()=>import("../nodes/5.1ASAC1IT.js"),__vite__mapDeps([26,1,2,3,4,11,6,24,7,19,8,9,5,10,20,21,22,15,16,27]),import.meta.url),()=>_(()=>import("../nodes/6.qUWkgVwg.js"),__vite__mapDeps([28,1,2,3,9,4,5,6,7,10,19,8,20,21,22,15,11,16,29]),import.meta.url),()=>_(()=>import("../nodes/7.BjapYmAp.js"),__vite__mapDeps([30,1,2,3,9,4,5,6,7,10,19,8,20,16]),import.meta.url)],De=[],Ie={"/":[2],"/404":[3],"/albums":[4],"/albums/confirm":[5],"/games":[6],"/profile":[7]},Pe={handleError:({error:c})=>{console.error(c)},reroute:()=>{},transport:{}},Re=Object.fromEntries(Object.entries(Pe.transport).map(([c,e])=>[c,e.decode])),Se=!1,Ve=(c,e)=>Re[c](e);export{Ve as decode,Re as decoders,Ie as dictionary,Se as hash,Pe as hooks,ke as matchers,Ce as nodes,Te as root,De as server_loads};
