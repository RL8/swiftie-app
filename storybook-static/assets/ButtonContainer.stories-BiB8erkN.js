const l={title:"Layout/ButtonContainer",parameters:{layout:"centered"}},n={render:()=>({Component:null,html:`
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
        </div>
      </div>
    `})},t={render:()=>({Component:null,html:`
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-primary">Submit</button>
        </div>
      </div>
    `})},r={render:()=>({Component:null,html:`
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-secondary">Save Draft</button>
          <button class="btn btn-primary">Submit</button>
        </div>
      </div>
    `})};var o,a,e;n.parameters={...n.parameters,docs:{...(o=n.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
        </div>
      </div>
    \`
  })
}`,...(e=(a=n.parameters)==null?void 0:a.docs)==null?void 0:e.source}}};var s,d,c;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-primary">Submit</button>
        </div>
      </div>
    \`
  })
}`,...(c=(d=t.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var b,i,u;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-secondary">Save Draft</button>
          <button class="btn btn-primary">Submit</button>
        </div>
      </div>
    \`
  })
}`,...(u=(i=r.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};const p=["DefaultButtonContainer","SingleButton","ThreeButtons"];export{n as DefaultButtonContainer,t as SingleButton,r as ThreeButtons,p as __namedExportsOrder,l as default};
