import{G as E,N as d,O as I,P as N,Q as V,R as j}from"./DdAb7SBl.js";import{i as B,f as G,g as M,n as P,h as R}from"./CwZ8Xtob.js";function q(s,r){if(r){const t=document.body;s.autofocus=!0,E(()=>{document.activeElement===t&&s.focus()})}}function $(s){var r,t,i="";if(typeof s=="string"||typeof s=="number")i+=s;else if(typeof s=="object")if(Array.isArray(s)){var u=s.length;for(r=0;r<u;r++)s[r]&&(t=$(s[r]))&&(i&&(i+=" "),i+=t)}else for(t in s)s[t]&&(i&&(i+=" "),i+=t);return i}function z(){for(var s,r,t=0,i="",u=arguments.length;t<u;t++)(s=arguments[t])&&(r=$(s))&&(i&&(i+=" "),i+=r);return i}function D(s){return typeof s=="object"?z(s):s??""}function K(s,r){r?s.hasAttribute("selected")||s.setAttribute("selected",""):s.removeAttribute("selected")}function Q(s,r,t,i){var u=s.__attributes??={};d&&(u[r]=s.getAttribute(r),r==="src"||r==="srcset"||r==="href"&&s.nodeName==="LINK")||u[r]!==(u[r]=t)&&(r==="style"&&"__styles"in s&&(s.__styles={}),r==="loading"&&(s[V]=t),t==null?s.removeAttribute(r):typeof t!="string"&&O(s).includes(r)?s[r]=t:s.setAttribute(r,t))}function H(s,r,t,i,u=!1,n=!1,S=!1){let p=d&&n;p&&N(!1);var c=r||{},y=s.tagName==="OPTION";for(var g in r)g in t||(t[g]=null);t.class&&(t.class=D(t.class)),t.class=t.class?t.class+" "+i:i;var w=O(s),L=s.__attributes??={};for(const f in t){let e=t[f];if(y&&f==="value"&&e==null){s.value=s.__value="",c[f]=e;continue}var h=c[f];if(e!==h){c[f]=e;var A=f[0]+f[1];if(A!=="$$"){if(A==="on"){const a={},_="$$"+f;let l=f.slice(2);var v=R(l);if(B(l)&&(l=l.slice(0,-7),a.capture=!0),!v&&h){if(e!=null)continue;s.removeEventListener(l,c[_],a),c[_]=null}if(e!=null)if(v)s[`__${l}`]=e,M([l]);else{let T=function(C){c[f].call(this,C)};c[_]=G(l,s,T,a)}else v&&(s[`__${l}`]=void 0)}else if(f==="style"&&e!=null)s.style.cssText=e+"";else if(f==="autofocus")q(s,!!e);else if(!n&&(f==="__value"||f==="value"&&e!=null))s.value=s.__value=e;else if(f==="selected"&&y)K(s,e);else{var o=f;u||(o=P(o));var b=o==="defaultValue"||o==="defaultChecked";if(e==null&&!n&&!b)if(L[f]=null,o==="value"||o==="checked"){let a=s;if(o==="value"){let _=a.defaultValue;a.removeAttribute(o),a.defaultValue=_}else{let _=a.defaultChecked;a.removeAttribute(o),a.defaultChecked=_}}else s.removeAttribute(f);else b||w.includes(o)&&(n||typeof e!="string")?s[o]=e:typeof e!="function"&&(d&&(o==="src"||o==="href"||o==="srcset")||Q(s,o,e))}f==="style"&&"__styles"in s&&(s.__styles={})}}}return p&&N(!0),c}var k=new Map;function O(s){var r=k.get(s.nodeName);if(r)return r;k.set(s.nodeName,r=[]);for(var t,i=s,u=Element.prototype;u!==i;){t=j(i);for(var n in t)t[n].set&&r.push(n);i=I(i)}return r}export{H as a,Q as s};
