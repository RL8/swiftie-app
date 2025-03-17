const f={title:"Forms/Input",parameters:{layout:"centered"}},r={render:()=>({Component:null,html:`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="text-input" class="form-label">Text Input</label>
          <input type="text" id="text-input" class="form-input" placeholder="Enter text here">
        </div>
      </div>
    `})},e={render:()=>({Component:null,html:`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="email-input" class="form-label">Email Address</label>
          <input type="email" id="email-input" class="form-input" placeholder="your@email.com">
        </div>
      </div>
    `})},n={render:()=>({Component:null,html:`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="password-input" class="form-label">Password</label>
          <input type="password" id="password-input" class="form-input" placeholder="Enter password">
        </div>
      </div>
    `})},a={render:()=>({Component:null,html:`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="error-input" class="form-label">Input with Error</label>
          <input type="text" id="error-input" class="form-input form-input-error" value="Invalid input">
          <div class="form-error-message">This field contains an error</div>
        </div>
      </div>
    `})};var o,t,l;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="text-input" class="form-label">Text Input</label>
          <input type="text" id="text-input" class="form-input" placeholder="Enter text here">
        </div>
      </div>
    \`
  })
}`,...(l=(t=r.parameters)==null?void 0:t.docs)==null?void 0:l.source}}};var s,d,i;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="email-input" class="form-label">Email Address</label>
          <input type="email" id="email-input" class="form-input" placeholder="your@email.com">
        </div>
      </div>
    \`
  })
}`,...(i=(d=e.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};var p,c,u;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="password-input" class="form-label">Password</label>
          <input type="password" id="password-input" class="form-input" placeholder="Enter password">
        </div>
      </div>
    \`
  })
}`,...(u=(c=n.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var m,v,b;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="error-input" class="form-label">Input with Error</label>
          <input type="text" id="error-input" class="form-input form-input-error" value="Invalid input">
          <div class="form-error-message">This field contains an error</div>
        </div>
      </div>
    \`
  })
}`,...(b=(v=a.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const g=["TextInput","EmailInput","PasswordInput","WithError"];export{e as EmailInput,n as PasswordInput,r as TextInput,a as WithError,g as __namedExportsOrder,f as default};
