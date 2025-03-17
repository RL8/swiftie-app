import{c as C,p as c,t as x,a as w,b as E,u as D}from"./props-DZ_BCPcW.js";import{t as S,p as W,j,k as u,m as v,G,r as m}from"./effects-KVpS0CWG.js";import{s as L}from"./Button-X0n03iO3.js";import{t as f}from"./class-DygXD_7e.js";import"./attributes-BdTxKFGG.js";import"./attributes-Jce5emvo.js";import"./index-client-u9M1_mJD.js";var O=x('<footer class="footer svelte-kh44md"><div class="footer-content svelte-kh44md"><!></div></footer>');function o(e,r){if(new.target)return C({component:o,...e});j(r,!0);let d=c(r,"variant",7,"base"),i=c(r,"hasBorder",7,!0),l=c(r,"children",7);var a=O(),p=v(a),F=v(p);return L(F,()=>l()??G),m(p),m(a),S(()=>{f(a,"with-border",i()),f(p,"footer-button",d()==="button")}),w(e,a),W({get variant(){return d()},set variant(t="base"){d(t),u()},get hasBorder(){return i()},set hasBorder(t=!0){i(t),u()},get children(){return l()},set children(t){l(t),u()},$set:D,$on:(t,k)=>E(r,t,k)})}o.__docgen={version:3,name:"Footer.svelte",data:[],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const K={title:"Layout/Footer",component:o,argTypes:{variant:{control:{type:"select",options:["base","button"]}},hasBorder:{control:"boolean"}},parameters:{layout:"fullscreen"}},n={args:{variant:"base",hasBorder:!0},render:e=>({Component:o,props:e,slots:{default:()=>"<div>Footer content</div>"}})},s={args:{variant:"button",hasBorder:!0},render:e=>({Component:o,props:e,slots:{default:()=>`
        <div class="button-container">
          <div>
            <Button variant="primary" label="Back" />
          </div>
          <div>
            <Button variant="secondary" label="Export" />
          </div>
        </div>
      `}})};var h,g,b;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'base',
    hasBorder: true
  },
  render: args => ({
    Component: Footer,
    props: args,
    slots: {
      default: () => '<div>Footer content</div>'
    }
  })
}`,...(b=(g=n.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var B,_,y;s.parameters={...s.parameters,docs:{...(B=s.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    variant: 'button',
    hasBorder: true
  },
  render: args => ({
    Component: Footer,
    props: args,
    slots: {
      default: () => \`
        <div class="button-container">
          <div>
            <Button variant="primary" label="Back" />
          </div>
          <div>
            <Button variant="secondary" label="Export" />
          </div>
        </div>
      \`
    }
  })
}`,...(y=(_=s.parameters)==null?void 0:_.docs)==null?void 0:y.source}}};const M=["Default","WithButtons"];export{n as Default,s as WithButtons,M as __namedExportsOrder,K as default};
