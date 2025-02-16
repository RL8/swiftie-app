import{aU as be,o as Oe,z as T,b as x,s as P,aK as ht}from"./DdAb7SBl.js";new URL("sveltekit-internal://");function pt(e,t){return e==="/"||t==="ignore"?e:t==="never"?e.endsWith("/")?e.slice(0,-1):e:t==="always"&&!e.endsWith("/")?e+"/":e}function gt(e){return e.split("%25").map(decodeURI).join("%25")}function mt(e){for(const t in e)e[t]=decodeURIComponent(e[t]);return e}function pe({href:e}){return e.split("#")[0]}function _t(e,t,n,r=!1){const o=new URL(e);Object.defineProperty(o,"searchParams",{value:new Proxy(o.searchParams,{get(i,a){if(a==="get"||a==="getAll"||a==="has")return f=>(n(f),i[a](f));t();const c=Reflect.get(i,a);return typeof c=="function"?c.bind(i):c}}),enumerable:!0,configurable:!0});const s=["href","pathname","search","toString","toJSON"];r&&s.push("hash");for(const i of s)Object.defineProperty(o,i,{get(){return t(),e[i]},enumerable:!0,configurable:!0});return o}function yt(...e){let t=5381;for(const n of e)if(typeof n=="string"){let r=n.length;for(;r;)t=t*33^n.charCodeAt(--r)}else if(ArrayBuffer.isView(n)){const r=new Uint8Array(n.buffer,n.byteOffset,n.byteLength);let o=r.length;for(;o;)t=t*33^r[--o]}else throw new TypeError("value must be a string or TypedArray");return(t>>>0).toString(36)}function wt(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n.buffer}const vt=window.fetch;window.fetch=(e,t)=>((e instanceof Request?e.method:t?.method||"GET")!=="GET"&&M.delete(ke(e)),vt(e,t));const M=new Map;function bt(e,t){const n=ke(e,t),r=document.querySelector(n);if(r?.textContent){let{body:o,...s}=JSON.parse(r.textContent);const i=r.getAttribute("data-ttl");return i&&M.set(n,{body:o,init:s,ttl:1e3*Number(i)}),r.getAttribute("data-b64")!==null&&(o=wt(o)),Promise.resolve(new Response(o,s))}return window.fetch(e,t)}function kt(e,t,n){if(M.size>0){const r=ke(e,n),o=M.get(r);if(o){if(performance.now()<o.ttl&&["default","force-cache","only-if-cached",void 0].includes(n?.cache))return new Response(o.body,o.init);M.delete(r)}}return window.fetch(t,n)}function ke(e,t){let r=`script[data-sveltekit-fetched][data-url=${JSON.stringify(e instanceof Request?e.url:e)}]`;if(t?.headers||t?.body){const o=[];t.headers&&o.push([...new Headers(t.headers)].join(",")),t.body&&(typeof t.body=="string"||ArrayBuffer.isView(t.body))&&o.push(t.body),r+=`[data-hash="${yt(...o)}"]`}return r}const At=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function St(e){const t=[];return{pattern:e==="/"?/^\/$/:new RegExp(`^${Rt(e).map(r=>{const o=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(r);if(o)return t.push({name:o[1],matcher:o[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const s=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(r);if(s)return t.push({name:s[1],matcher:s[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!r)return;const i=r.split(/\[(.+?)\](?!\])/);return"/"+i.map((c,f)=>{if(f%2){if(c.startsWith("x+"))return ge(String.fromCharCode(parseInt(c.slice(2),16)));if(c.startsWith("u+"))return ge(String.fromCharCode(...c.slice(2).split("-").map(m=>parseInt(m,16))));const d=At.exec(c),[,g,u,l,h]=d;return t.push({name:l,matcher:h,optional:!!g,rest:!!u,chained:u?f===1&&i[0]==="":!1}),u?"(.*?)":g?"([^/]*)?":"([^/]+?)"}return ge(c)}).join("")}).join("")}/?$`),params:t}}function Et(e){return!/^\([^)]+\)$/.test(e)}function Rt(e){return e.slice(1).split("/").filter(Et)}function It(e,t,n){const r={},o=e.slice(1),s=o.filter(a=>a!==void 0);let i=0;for(let a=0;a<t.length;a+=1){const c=t[a];let f=o[a-i];if(c.chained&&c.rest&&i&&(f=o.slice(a-i,a+1).filter(d=>d).join("/"),i=0),f===void 0){c.rest&&(r[c.name]="");continue}if(!c.matcher||n[c.matcher](f)){r[c.name]=f;const d=t[a+1],g=o[a+1];d&&!d.rest&&d.optional&&g&&c.chained&&(i=0),!d&&!g&&Object.keys(r).length===s.length&&(i=0);continue}if(c.optional&&c.chained){i++;continue}return}if(!i)return r}function ge(e){return e.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function Ut({nodes:e,server_loads:t,dictionary:n,matchers:r}){const o=new Set(t);return Object.entries(n).map(([a,[c,f,d]])=>{const{pattern:g,params:u}=St(a),l={id:a,exec:h=>{const m=g.exec(h);if(m)return It(m,u,r)},errors:[1,...d||[]].map(h=>e[h]),layouts:[0,...f||[]].map(i),leaf:s(c)};return l.errors.length=l.layouts.length=Math.max(l.errors.length,l.layouts.length),l});function s(a){const c=a<0;return c&&(a=~a),[c,e[a]]}function i(a){return a===void 0?a:[o.has(a),e[a]]}}function Me(e,t=JSON.parse){try{return t(sessionStorage[e])}catch{}}function Ne(e,t,n=JSON.stringify){const r=n(t);try{sessionStorage[e]=r}catch{}}const U=globalThis.__sveltekit_1cmknqy?.base??"",Lt=globalThis.__sveltekit_1cmknqy?.assets??U,Tt="1739687285849",Ke="sveltekit:snapshot",He="sveltekit:scroll",We="sveltekit:states",xt="sveltekit:pageurl",F="sveltekit:history",W="sveltekit:navigation",Q={tap:1,hover:2,viewport:3,eager:4,off:-1,false:-1},X=location.origin;function Ye(e){if(e instanceof URL)return e;let t=document.baseURI;if(!t){const n=document.getElementsByTagName("base");t=n.length?n[0].href:document.URL}return new URL(e,t)}function Ae(){return{x:pageXOffset,y:pageYOffset}}function D(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const je={...Q,"":Q.hover};function ze(e){let t=e.assignedSlot??e.parentNode;return t?.nodeType===11&&(t=t.host),t}function Je(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=ze(e)}}function ye(e,t,n){let r;try{if(r=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI),n&&r.hash.match(/^#[^/]/)){const a=location.hash.split("#")[1]||"/";r.hash=`#${a}${r.hash}`}}catch{}const o=e instanceof SVGAElement?e.target.baseVal:e.target,s=!r||!!o||ce(r,t,n)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),i=r?.origin===X&&e.hasAttribute("download");return{url:r,external:s,target:o,download:i}}function ee(e){let t=null,n=null,r=null,o=null,s=null,i=null,a=e;for(;a&&a!==document.documentElement;)r===null&&(r=D(a,"preload-code")),o===null&&(o=D(a,"preload-data")),t===null&&(t=D(a,"keepfocus")),n===null&&(n=D(a,"noscroll")),s===null&&(s=D(a,"reload")),i===null&&(i=D(a,"replacestate")),a=ze(a);function c(f){switch(f){case"":case"true":return!0;case"off":case"false":return!1;default:return}}return{preload_code:je[r??"off"],preload_data:je[o??"off"],keepfocus:c(t),noscroll:c(n),reload:c(s),replace_state:c(i)}}function $e(e){const t=be(e);let n=!0;function r(){n=!0,t.update(i=>i)}function o(i){n=!1,t.set(i)}function s(i){let a;return t.subscribe(c=>{(a===void 0||n&&c!==a)&&i(a=c)})}return{notify:r,set:o,subscribe:s}}const Xe={v:()=>{}};function Pt(){const{set:e,subscribe:t}=be(!1);let n;async function r(){clearTimeout(n);try{const o=await fetch(`${Lt}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!o.ok)return!1;const i=(await o.json()).version!==Tt;return i&&(e(!0),Xe.v(),clearTimeout(n)),i}catch{return!1}}return{subscribe:t,check:r}}function ce(e,t,n){return e.origin!==X||!e.pathname.startsWith(t)?!0:n?!(e.pathname===t+"/"||e.pathname===t+"/index.html"||e.protocol==="file:"&&e.pathname.replace(/\/[^/]+\.html?$/,"")===t):!1}function De(e){const t=Ot(e),n=new ArrayBuffer(t.length),r=new DataView(n);for(let o=0;o<n.byteLength;o++)r.setUint8(o,t.charCodeAt(o));return n}const Ct="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function Ot(e){e.length%4===0&&(e=e.replace(/==?$/,""));let t="",n=0,r=0;for(let o=0;o<e.length;o++)n<<=6,n|=Ct.indexOf(e[o]),r+=6,r===24&&(t+=String.fromCharCode((n&16711680)>>16),t+=String.fromCharCode((n&65280)>>8),t+=String.fromCharCode(n&255),n=r=0);return r===12?(n>>=4,t+=String.fromCharCode(n)):r===18&&(n>>=2,t+=String.fromCharCode((n&65280)>>8),t+=String.fromCharCode(n&255)),t}const Nt=-1,jt=-2,$t=-3,Dt=-4,Ft=-5,Vt=-6;function Bt(e,t){if(typeof e=="number")return o(e,!0);if(!Array.isArray(e)||e.length===0)throw new Error("Invalid input");const n=e,r=Array(n.length);function o(s,i=!1){if(s===Nt)return;if(s===$t)return NaN;if(s===Dt)return 1/0;if(s===Ft)return-1/0;if(s===Vt)return-0;if(i)throw new Error("Invalid input");if(s in r)return r[s];const a=n[s];if(!a||typeof a!="object")r[s]=a;else if(Array.isArray(a))if(typeof a[0]=="string"){const c=a[0],f=t?.[c];if(f)return r[s]=f(o(a[1]));switch(c){case"Date":r[s]=new Date(a[1]);break;case"Set":const d=new Set;r[s]=d;for(let l=1;l<a.length;l+=1)d.add(o(a[l]));break;case"Map":const g=new Map;r[s]=g;for(let l=1;l<a.length;l+=2)g.set(o(a[l]),o(a[l+1]));break;case"RegExp":r[s]=new RegExp(a[1],a[2]);break;case"Object":r[s]=Object(a[1]);break;case"BigInt":r[s]=BigInt(a[1]);break;case"null":const u=Object.create(null);r[s]=u;for(let l=1;l<a.length;l+=2)u[a[l]]=o(a[l+1]);break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"BigInt64Array":case"BigUint64Array":{const l=globalThis[c],h=a[1],m=De(h),_=new l(m);r[s]=_;break}case"ArrayBuffer":{const l=a[1],h=De(l);r[s]=h;break}default:throw new Error(`Unknown type ${c}`)}}else{const c=new Array(a.length);r[s]=c;for(let f=0;f<a.length;f+=1){const d=a[f];d!==jt&&(c[f]=o(d))}}else{const c={};r[s]=c;for(const f in a){const d=a[f];c[f]=o(d)}}return r[s]}return o(0)}const Ze=new Set(["load","prerender","csr","ssr","trailingSlash","config"]);[...Ze];const qt=new Set([...Ze]);[...qt];function Gt(e){return e.filter(t=>t!=null)}class le{constructor(t,n){this.status=t,typeof n=="string"?this.body={message:n}:n?this.body=n:this.body={message:`Error: ${t}`}}toString(){return JSON.stringify(this.body)}}class Se{constructor(t,n){this.status=t,this.location=n}}class Ee extends Error{constructor(t,n,r){super(r),this.status=t,this.text=n}}const Mt="x-sveltekit-invalidated",Kt="x-sveltekit-trailing-slash";function te(e){return e instanceof le||e instanceof Ee?e.status:500}function Ht(e){return e instanceof Ee?e.text:"Internal Error"}let S,Y,me;const Wt=Oe.toString().includes("$$")||/function \w+\(\) \{\}/.test(Oe.toString());Wt?(S={data:{},form:null,error:null,params:{},route:{id:null},state:{},status:-1,url:new URL("https://example.com")},Y={current:null},me={current:!1}):(S=new class{#e=T({});get data(){return x(this.#e)}set data(t){P(this.#e,t)}#t=T(null);get form(){return x(this.#t)}set form(t){P(this.#t,t)}#n=T(null);get error(){return x(this.#n)}set error(t){P(this.#n,t)}#r=T({});get params(){return x(this.#r)}set params(t){P(this.#r,t)}#a=T({id:null});get route(){return x(this.#a)}set route(t){P(this.#a,t)}#o=T({});get state(){return x(this.#o)}set state(t){P(this.#o,t)}#s=T(-1);get status(){return x(this.#s)}set status(t){P(this.#s,t)}#i=T(new URL("https://example.com"));get url(){return x(this.#i)}set url(t){P(this.#i,t)}},Y=new class{#e=T(null);get current(){return x(this.#e)}set current(t){P(this.#e,t)}},me=new class{#e=T(!1);get current(){return x(this.#e)}set current(t){P(this.#e,t)}},Xe.v=()=>me.current=!0);function Yt(e){Object.assign(S,e)}const zt="/__data.json",Jt=".html__data.json";function Xt(e){return e.endsWith(".html")?e.replace(/\.html$/,Jt):e.replace(/\/$/,"")+zt}const Zt=new Set(["icon","shortcut icon","apple-touch-icon"]),$=Me(He)??{},z=Me(Ke)??{},N={url:$e({}),page:$e({}),navigating:be(null),updated:Pt()};function Re(e){$[e]=Ae()}function Qt(e,t){let n=e+1;for(;$[n];)delete $[n],n+=1;for(n=t+1;z[n];)delete z[n],n+=1}function B(e){return location.href=e.href,new Promise(()=>{})}async function Qe(){if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistration(U||"/");e&&await e.update()}}function Fe(){}let Ie,we,ne,C,ve,v;const re=[],ae=[];let O=null;const et=new Set,en=new Set,K=new Set;let w={branch:[],error:null,url:null},Ue=!1,oe=!1,Ve=!0,J=!1,q=!1,tt=!1,Le=!1,nt,k,I,j;const H=new Set;async function yn(e,t,n){document.URL!==location.href&&(location.href=location.href),v=e,await e.hooks.init?.(),Ie=Ut(e),C=document.documentElement,ve=t,we=e.nodes[0],ne=e.nodes[1],we(),ne(),k=history.state?.[F],I=history.state?.[W],k||(k=I=Date.now(),history.replaceState({...history.state,[F]:k,[W]:I},""));const r=$[k];r&&(history.scrollRestoration="manual",scrollTo(r.x,r.y)),n?await dn(ve,n):ln(v.hash?dt(new URL(location.href)):location.href,{replaceState:!0}),un()}function tn(){re.length=0,Le=!1}function rt(e){ae.some(t=>t?.snapshot)&&(z[e]=ae.map(t=>t?.snapshot?.capture()))}function at(e){z[e]?.forEach((t,n)=>{ae[n]?.snapshot?.restore(t)})}function Be(){Re(k),Ne(He,$),rt(I),Ne(Ke,z)}async function Te(e,t,n,r){return G({type:"goto",url:Ye(e),keepfocus:t.keepFocus,noscroll:t.noScroll,replace_state:t.replaceState,state:t.state,redirect_count:n,nav_token:r,accept:()=>{t.invalidateAll&&(Le=!0),t.invalidate&&t.invalidate.forEach(fn)}})}async function nn(e){if(e.id!==O?.id){const t={};H.add(t),O={id:e.id,token:t,promise:st({...e,preload:t}).then(n=>(H.delete(t),n.type==="loaded"&&n.state.error&&(O=null),n))}}return O.promise}async function _e(e){const t=(await ue(e,!1))?.route;t&&await Promise.all([...t.layouts,t.leaf].map(n=>n?.[1]()))}function ot(e,t,n){w=e.state;const r=document.querySelector("style[data-sveltekit]");r&&r.remove(),Object.assign(S,e.props.page),nt=new v.root({target:t,props:{...e.props,stores:N,components:ae},hydrate:n,sync:!1}),at(I);const o={from:null,to:{params:w.params,route:{id:w.route?.id??null},url:new URL(location.href)},willUnload:!1,type:"enter",complete:Promise.resolve()};K.forEach(s=>s(o)),oe=!0}function se({url:e,params:t,branch:n,status:r,error:o,route:s,form:i}){let a="never";if(U&&(e.pathname===U||e.pathname===U+"/"))a="always";else for(const l of n)l?.slash!==void 0&&(a=l.slash);e.pathname=pt(e.pathname,a),e.search=e.search;const c={type:"loaded",state:{url:e,params:t,branch:n,error:o,route:s},props:{constructors:Gt(n).map(l=>l.node.component),page:Ce(S)}};i!==void 0&&(c.props.form=i);let f={},d=!S,g=0;for(let l=0;l<Math.max(n.length,w.branch.length);l+=1){const h=n[l],m=w.branch[l];h?.data!==m?.data&&(d=!0),h&&(f={...f,...h.data},d&&(c.props[`data_${g}`]=f),g+=1)}return(!w.url||e.href!==w.url.href||w.error!==o||i!==void 0&&i!==S.form||d)&&(c.props.page={error:o,params:t,route:{id:s?.id??null},state:{},status:r,url:new URL(e),form:i??null,data:d?f:S.data}),c}async function xe({loader:e,parent:t,url:n,params:r,route:o,server_data_node:s}){let i=null,a=!0;const c={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1,search_params:new Set},f=await e();if(f.universal?.load){let d=function(...u){for(const l of u){const{href:h}=new URL(l,n);c.dependencies.add(h)}};const g={route:new Proxy(o,{get:(u,l)=>(a&&(c.route=!0),u[l])}),params:new Proxy(r,{get:(u,l)=>(a&&c.params.add(l),u[l])}),data:s?.data??null,url:_t(n,()=>{a&&(c.url=!0)},u=>{a&&c.search_params.add(u)},v.hash),async fetch(u,l){let h;u instanceof Request?(h=u.url,l={body:u.method==="GET"||u.method==="HEAD"?void 0:await u.blob(),cache:u.cache,credentials:u.credentials,headers:[...u.headers].length?u.headers:void 0,integrity:u.integrity,keepalive:u.keepalive,method:u.method,mode:u.mode,redirect:u.redirect,referrer:u.referrer,referrerPolicy:u.referrerPolicy,signal:u.signal,...l}):h=u;const m=new URL(h,n);return a&&d(m.href),m.origin===n.origin&&(h=m.href.slice(n.origin.length)),oe?kt(h,m.href,l):bt(h,l)},setHeaders:()=>{},depends:d,parent(){return a&&(c.parent=!0),t()},untrack(u){a=!1;try{return u()}finally{a=!0}}};i=await f.universal.load.call(null,g)??null}return{node:f,loader:e,server:s,universal:f.universal?.load?{type:"data",data:i,uses:c}:null,data:i??s?.data??null,slash:f.universal?.trailingSlash??s?.slash}}function qe(e,t,n,r,o,s){if(Le)return!0;if(!o)return!1;if(o.parent&&e||o.route&&t||o.url&&n)return!0;for(const i of o.search_params)if(r.has(i))return!0;for(const i of o.params)if(s[i]!==w.params[i])return!0;for(const i of o.dependencies)if(re.some(a=>a(new URL(i))))return!0;return!1}function Pe(e,t){return e?.type==="data"?e:e?.type==="skip"?t??null:null}function rn(e,t){if(!e)return new Set(t.searchParams.keys());const n=new Set([...e.searchParams.keys(),...t.searchParams.keys()]);for(const r of n){const o=e.searchParams.getAll(r),s=t.searchParams.getAll(r);o.every(i=>s.includes(i))&&s.every(i=>o.includes(i))&&n.delete(r)}return n}function Ge({error:e,url:t,route:n,params:r}){return{type:"loaded",state:{error:e,url:t,route:n,params:r,branch:[]},props:{page:Ce(S),constructors:[]}}}async function st({id:e,invalidating:t,url:n,params:r,route:o,preload:s}){if(O?.id===e)return H.delete(O.token),O.promise;const{errors:i,layouts:a,leaf:c}=o,f=[...a,c];i.forEach(p=>p?.().catch(()=>{})),f.forEach(p=>p?.[1]().catch(()=>{}));let d=null;const g=w.url?e!==ie(w.url):!1,u=w.route?o.id!==w.route.id:!1,l=rn(w.url,n);let h=!1;const m=f.map((p,y)=>{const b=w.branch[y],A=!!p?.[0]&&(b?.loader!==p[1]||qe(h,u,g,l,b.server?.uses,r));return A&&(h=!0),A});if(m.some(Boolean)){try{d=await lt(n,m)}catch(p){const y=await V(p,{url:n,params:r,route:{id:e}});return H.has(s)?Ge({error:y,url:n,params:r,route:o}):fe({status:te(p),error:y,url:n,route:o})}if(d.type==="redirect")return d}const _=d?.nodes;let R=!1;const E=f.map(async(p,y)=>{if(!p)return;const b=w.branch[y],A=_?.[y];if((!A||A.type==="skip")&&p[1]===b?.loader&&!qe(R,u,g,l,b.universal?.uses,r))return b;if(R=!0,A?.type==="error")throw A;return xe({loader:p[1],url:n,params:r,route:o,parent:async()=>{const de={};for(let he=0;he<y;he+=1)Object.assign(de,(await E[he])?.data);return de},server_data_node:Pe(A===void 0&&p[0]?{type:"skip"}:A??null,p[0]?b?.server:void 0)})});for(const p of E)p.catch(()=>{});const L=[];for(let p=0;p<f.length;p+=1)if(f[p])try{L.push(await E[p])}catch(y){if(y instanceof Se)return{type:"redirect",location:y.location};if(H.has(s))return Ge({error:await V(y,{params:r,url:n,route:{id:o.id}}),url:n,params:r,route:o});let b=te(y),A;if(_?.includes(y))b=y.status??b,A=y.error;else if(y instanceof le)A=y.body;else{if(await N.updated.check())return await Qe(),await B(n);A=await V(y,{params:r,url:n,route:{id:o.id}})}const Z=await an(p,L,i);return Z?se({url:n,params:r,branch:L.slice(0,Z.idx).concat(Z.node),status:b,error:A,route:o}):await ct(n,{id:o.id},A,b)}else L.push(void 0);return se({url:n,params:r,branch:L,status:200,error:null,route:o,form:t?void 0:null})}async function an(e,t,n){for(;e--;)if(n[e]){let r=e;for(;!t[r];)r-=1;try{return{idx:r+1,node:{node:await n[e](),loader:n[e],data:{},server:null,universal:null}}}catch{continue}}}async function fe({status:e,error:t,url:n,route:r}){const o={};let s=null;if(v.server_loads[0]===0)try{const a=await lt(n,[!0]);if(a.type!=="data"||a.nodes[0]&&a.nodes[0].type!=="data")throw 0;s=a.nodes[0]??null}catch{(n.origin!==X||n.pathname!==location.pathname||Ue)&&await B(n)}try{const a=await xe({loader:we,url:n,params:o,route:r,parent:()=>Promise.resolve({}),server_data_node:Pe(s)}),c={node:await ne(),loader:ne,universal:null,server:null,data:null};return se({url:n,params:o,branch:[a,c],status:e,error:t,route:null})}catch(a){if(a instanceof Se)return Te(new URL(a.location,location.href),{},0);throw a}}function on(e){let t;try{if(t=v.hooks.reroute({url:new URL(e)})??e,typeof t=="string"){const n=new URL(e);v.hash?n.hash=t:n.pathname=t,t=n}}catch{return}return t}async function ue(e,t){if(e&&!ce(e,U,v.hash)){const n=on(e);if(!n)return;const r=sn(n);for(const o of Ie){const s=o.exec(r);if(s)return{id:ie(e),invalidating:t,route:o,params:mt(s),url:e}}}}function sn(e){return gt(v.hash?e.hash.replace(/^#/,"").replace(/[?#].+/,""):e.pathname.slice(U.length))||"/"}function ie(e){return(v.hash?e.hash.replace(/^#/,""):e.pathname)+e.search}function it({url:e,type:t,intent:n,delta:r}){let o=!1;const s=ut(w,n,e,t);r!==void 0&&(s.navigation.delta=r);const i={...s.navigation,cancel:()=>{o=!0,s.reject(new Error("navigation cancelled"))}};return J||et.forEach(a=>a(i)),o?null:s}async function G({type:e,url:t,popped:n,keepfocus:r,noscroll:o,replace_state:s,state:i={},redirect_count:a=0,nav_token:c={},accept:f=Fe,block:d=Fe}){const g=j;j=c;const u=await ue(t,!1),l=it({url:t,type:e,delta:n?.delta,intent:u});if(!l){d(),j===c&&(j=g);return}const h=k,m=I;f(),J=!0,oe&&N.navigating.set(Y.current=l.navigation);let _=u&&await st(u);if(!_){if(ce(t,U,v.hash))return await B(t);_=await ct(t,{id:null},await V(new Ee(404,"Not Found",`Not found: ${t.pathname}`),{url:t,params:{},route:{id:null}}),404)}if(t=u?.url||t,j!==c)return l.reject(new Error("navigation aborted")),!1;if(_.type==="redirect")if(a>=20)_=await fe({status:500,error:await V(new Error("Redirect loop"),{url:t,params:{},route:{id:null}}),url:t,route:{id:null}});else return Te(new URL(_.location,t).href,{},a+1,c),!1;else _.props.page.status>=400&&await N.updated.check()&&(await Qe(),await B(t));if(tn(),Re(h),rt(m),_.props.page.url.pathname!==t.pathname&&(t.pathname=_.props.page.url.pathname),i=n?n.state:i,!n){const p=s?0:1,y={[F]:k+=p,[W]:I+=p,[We]:i};(s?history.replaceState:history.pushState).call(history,y,"",t),s||Qt(k,I)}if(O=null,_.props.page.state=i,oe){w=_.state,_.props.page&&(_.props.page.url=t);const p=(await Promise.all(Array.from(en,y=>y(l.navigation)))).filter(y=>typeof y=="function");if(p.length>0){let y=function(){p.forEach(b=>{K.delete(b)})};p.push(y),p.forEach(b=>{K.add(b)})}nt.$set(_.props),Yt(_.props.page),tt=!0}else ot(_,ve,!1);const{activeElement:R}=document;await ht();const E=n?n.scroll:o?Ae():null;if(Ve){const p=t.hash&&document.getElementById(decodeURIComponent(v.hash?t.hash.split("#")[2]??"":t.hash.slice(1)));E?scrollTo(E.x,E.y):p?p.scrollIntoView():scrollTo(0,0)}const L=document.activeElement!==R&&document.activeElement!==document.body;!r&&!L&&hn(),Ve=!0,_.props.page&&Object.assign(S,_.props.page),J=!1,e==="popstate"&&at(I),l.fulfil(void 0),K.forEach(p=>p(l.navigation)),N.navigating.set(Y.current=null)}async function ct(e,t,n,r){return e.origin===X&&e.pathname===location.pathname&&!Ue?await fe({status:r,error:n,url:e,route:t}):await B(e)}function cn(){let e,t;C.addEventListener("mousemove",i=>{const a=i.target;clearTimeout(e),e=setTimeout(()=>{o(a,2)},20)});function n(i){i.defaultPrevented||o(i.composedPath()[0],1)}C.addEventListener("mousedown",n),C.addEventListener("touchstart",n,{passive:!0});const r=new IntersectionObserver(i=>{for(const a of i)a.isIntersecting&&(_e(new URL(a.target.href)),r.unobserve(a.target))},{threshold:0});async function o(i,a){const c=Je(i,C);if(!c||c===t)return;t=c;const{url:f,external:d,download:g}=ye(c,U,v.hash);if(d||g)return;const u=ee(c),l=f&&ie(w.url)===ie(f);if(!u.reload&&!l)if(a<=u.preload_data){const h=await ue(f,!1);h&&nn(h)}else a<=u.preload_code&&_e(f)}function s(){r.disconnect();for(const i of C.querySelectorAll("a")){const{url:a,external:c,download:f}=ye(i,U,v.hash);if(c||f)continue;const d=ee(i);d.reload||(d.preload_code===Q.viewport&&r.observe(i),d.preload_code===Q.eager&&_e(a))}}K.add(s),s()}function V(e,t){if(e instanceof le)return e.body;const n=te(e),r=Ht(e);return v.hooks.handleError({error:e,event:t,status:n,message:r})??{message:r}}function ln(e,t={}){return e=new URL(Ye(e)),e.origin!==X?Promise.reject(new Error("goto: invalid URL")):Te(e,t,0)}function fn(e){if(typeof e=="function")re.push(e);else{const{href:t}=new URL(e,location.href);re.push(n=>n.href===t)}}function un(){history.scrollRestoration="manual",addEventListener("beforeunload",t=>{let n=!1;if(Be(),!J){const r=ut(w,void 0,null,"leave"),o={...r.navigation,cancel:()=>{n=!0,r.reject(new Error("navigation cancelled"))}};et.forEach(s=>s(o))}n?(t.preventDefault(),t.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&Be()}),navigator.connection?.saveData||cn(),C.addEventListener("click",async t=>{if(t.button||t.which!==1||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.defaultPrevented)return;const n=Je(t.composedPath()[0],C);if(!n)return;const{url:r,external:o,target:s,download:i}=ye(n,U,v.hash);if(!r)return;if(s==="_parent"||s==="_top"){if(window.parent!==window)return}else if(s&&s!=="_self")return;const a=ee(n);if(!(n instanceof SVGAElement)&&r.protocol!==location.protocol&&!(r.protocol==="https:"||r.protocol==="http:")||i)return;const[f,d]=(v.hash?r.hash.replace(/^#/,""):r.href).split("#"),g=f===pe(location);if(o||a.reload&&(!g||!d)){it({url:r,type:"link"})?J=!0:t.preventDefault();return}if(d!==void 0&&g){const[,u]=w.url.href.split("#");if(u===d){if(t.preventDefault(),d===""||d==="top"&&n.ownerDocument.getElementById("top")===null)window.scrollTo({top:0});else{const l=n.ownerDocument.getElementById(decodeURIComponent(d));l&&(l.scrollIntoView(),l.focus())}return}if(q=!0,Re(k),e(r),!a.replace_state)return;q=!1}t.preventDefault(),await new Promise(u=>{requestAnimationFrame(()=>{setTimeout(u,0)}),setTimeout(u,100)}),G({type:"link",url:r,keepfocus:a.keepfocus,noscroll:a.noscroll,replace_state:a.replace_state??r.href===location.href})}),C.addEventListener("submit",t=>{if(t.defaultPrevented)return;const n=HTMLFormElement.prototype.cloneNode.call(t.target),r=t.submitter;if((r?.formTarget||n.target)==="_blank"||(r?.formMethod||n.method)!=="get")return;const i=new URL(r?.hasAttribute("formaction")&&r?.formAction||n.action);if(ce(i,U,!1))return;const a=t.target,c=ee(a);if(c.reload)return;t.preventDefault(),t.stopPropagation();const f=new FormData(a),d=r?.getAttribute("name");d&&f.append(d,r?.getAttribute("value")??""),i.search=new URLSearchParams(f).toString(),G({type:"form",url:i,keepfocus:c.keepfocus,noscroll:c.noscroll,replace_state:c.replace_state??i.href===location.href})}),addEventListener("popstate",async t=>{if(t.state?.[F]){const n=t.state[F];if(j={},n===k)return;const r=$[n],o=t.state[We]??{},s=new URL(t.state[xt]??location.href),i=t.state[W],a=w.url?pe(location)===pe(w.url):!1;if(i===I&&(tt||a)){o!==S.state&&(S.state=o),e(s),$[k]=Ae(),r&&scrollTo(r.x,r.y),k=n;return}const f=n-k;await G({type:"popstate",url:s,popped:{state:o,scroll:r,delta:f},accept:()=>{k=n,I=i},block:()=>{history.go(-f)},nav_token:j})}else if(!q){const n=new URL(location.href);e(n)}}),addEventListener("hashchange",()=>{q?(q=!1,history.replaceState({...history.state,[F]:++k,[W]:I},"",location.href)):v.hash&&w.url.hash===location.hash&&G({type:"goto",url:dt(w.url)})});for(const t of document.querySelectorAll("link"))Zt.has(t.rel)&&(t.href=t.href);addEventListener("pageshow",t=>{t.persisted&&N.navigating.set(Y.current=null)});function e(t){w.url=S.url=t,N.page.set(Ce(S)),N.page.notify()}}async function dn(e,{status:t=200,error:n,node_ids:r,params:o,route:s,server_route:i,data:a,form:c}){Ue=!0;const f=new URL(location.href);let d;({params:o={},route:s={id:null}}=await ue(f,!1)||{}),d=Ie.find(({id:l})=>l===s.id);let g,u=!0;try{const l=r.map(async(m,_)=>{const R=a[_];return R?.uses&&(R.uses=ft(R.uses)),xe({loader:v.nodes[m],url:f,params:o,route:s,parent:async()=>{const E={};for(let L=0;L<_;L+=1)Object.assign(E,(await l[L]).data);return E},server_data_node:Pe(R)})}),h=await Promise.all(l);if(d){const m=d.layouts;for(let _=0;_<m.length;_++)m[_]||h.splice(_,0,void 0)}g=se({url:f,params:o,branch:h,status:t,error:n,form:c,route:d??null})}catch(l){if(l instanceof Se){await B(new URL(l.location,location.href));return}g=await fe({status:te(l),error:await V(l,{url:f,params:o,route:s}),url:f,route:s}),e.textContent="",u=!1}g.props.page&&(g.props.page.state={}),ot(g,e,u)}async function lt(e,t){const n=new URL(e);n.pathname=Xt(e.pathname),e.pathname.endsWith("/")&&n.searchParams.append(Kt,"1"),n.searchParams.append(Mt,t.map(s=>s?"1":"0").join(""));const r=window.fetch,o=await r(n.href,{});if(!o.ok){let s;throw o.headers.get("content-type")?.includes("application/json")?s=await o.json():o.status===404?s="Not Found":o.status===500&&(s="Internal Error"),new le(o.status,s)}return new Promise(async s=>{const i=new Map,a=o.body.getReader(),c=new TextDecoder;function f(g){return Bt(g,{...v.decoders,Promise:u=>new Promise((l,h)=>{i.set(u,{fulfil:l,reject:h})})})}let d="";for(;;){const{done:g,value:u}=await a.read();if(g&&!d)break;for(d+=!u&&d?`
`:c.decode(u,{stream:!0});;){const l=d.indexOf(`
`);if(l===-1)break;const h=JSON.parse(d.slice(0,l));if(d=d.slice(l+1),h.type==="redirect")return s(h);if(h.type==="data")h.nodes?.forEach(m=>{m?.type==="data"&&(m.uses=ft(m.uses),m.data=f(m.data))}),s(h);else if(h.type==="chunk"){const{id:m,data:_,error:R}=h,E=i.get(m);i.delete(m),R?E.reject(f(R)):E.fulfil(f(_))}}}})}function ft(e){return{dependencies:new Set(e?.dependencies??[]),params:new Set(e?.params??[]),parent:!!e?.parent,route:!!e?.route,url:!!e?.url,search_params:new Set(e?.search_params??[])}}function hn(){const e=document.querySelector("[autofocus]");if(e)e.focus();else{const t=document.body,n=t.getAttribute("tabindex");t.tabIndex=-1,t.focus({preventScroll:!0,focusVisible:!1}),n!==null?t.setAttribute("tabindex",n):t.removeAttribute("tabindex");const r=getSelection();if(r&&r.type!=="None"){const o=[];for(let s=0;s<r.rangeCount;s+=1)o.push(r.getRangeAt(s));setTimeout(()=>{if(r.rangeCount===o.length){for(let s=0;s<r.rangeCount;s+=1){const i=o[s],a=r.getRangeAt(s);if(i.commonAncestorContainer!==a.commonAncestorContainer||i.startContainer!==a.startContainer||i.endContainer!==a.endContainer||i.startOffset!==a.startOffset||i.endOffset!==a.endOffset)return}r.removeAllRanges()}})}}}function ut(e,t,n,r){let o,s;const i=new Promise((c,f)=>{o=c,s=f});return i.catch(()=>{}),{navigation:{from:{params:e.params,route:{id:e.route?.id??null},url:e.url},to:n&&{params:t?.params??null,route:{id:t?.route?.id??null},url:n},willUnload:!t,type:r,complete:i},fulfil:o,reject:s}}function Ce(e){return{data:e.data,error:e.error,form:e.form,params:e.params,route:e.route,state:e.state,status:e.status,url:e.url}}function dt(e){const t=new URL(e);return t.hash=decodeURIComponent(e.hash),t}export{yn as a,U as b,ln as g,S as p,N as s};
