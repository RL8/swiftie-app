const p={title:"Forms/Checkbox",parameters:{layout:"centered"}},o={render:()=>({Component:null,html:`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-checkbox">
          <input type="checkbox" id="basic-checkbox" class="form-checkbox-input">
          <label for="basic-checkbox" class="form-checkbox-label">Basic Checkbox</label>
        </div>
      </div>
    `})},c={render:()=>({Component:null,html:`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label class="form-label">Select Options</label>
          <div class="form-checkbox">
            <input type="checkbox" id="option1" class="form-checkbox-input" checked>
            <label for="option1" class="form-checkbox-label">Option 1</label>
          </div>
          <div class="form-checkbox">
            <input type="checkbox" id="option2" class="form-checkbox-input">
            <label for="option2" class="form-checkbox-label">Option 2</label>
          </div>
          <div class="form-checkbox">
            <input type="checkbox" id="option3" class="form-checkbox-input">
            <label for="option3" class="form-checkbox-label">Option 3</label>
          </div>
        </div>
      </div>
    `})},e={render:()=>({Component:null,html:`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-checkbox">
          <input type="checkbox" id="terms" class="form-checkbox-input">
          <div>
            <label for="terms" class="form-checkbox-label">Terms and Conditions</label>
            <p class="form-checkbox-description">By checking this box, you agree to our terms of service and privacy policy.</p>
          </div>
        </div>
      </div>
    `})};var r,n,l;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-checkbox">
          <input type="checkbox" id="basic-checkbox" class="form-checkbox-input">
          <label for="basic-checkbox" class="form-checkbox-label">Basic Checkbox</label>
        </div>
      </div>
    \`
  })
}`,...(l=(n=o.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};var a,s,i;c.parameters={...c.parameters,docs:{...(a=c.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label class="form-label">Select Options</label>
          <div class="form-checkbox">
            <input type="checkbox" id="option1" class="form-checkbox-input" checked>
            <label for="option1" class="form-checkbox-label">Option 1</label>
          </div>
          <div class="form-checkbox">
            <input type="checkbox" id="option2" class="form-checkbox-input">
            <label for="option2" class="form-checkbox-label">Option 2</label>
          </div>
          <div class="form-checkbox">
            <input type="checkbox" id="option3" class="form-checkbox-input">
            <label for="option3" class="form-checkbox-label">Option 3</label>
          </div>
        </div>
      </div>
    \`
  })
}`,...(i=(s=c.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var t,b,d;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => ({
    Component: null,
    html: \`
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-checkbox">
          <input type="checkbox" id="terms" class="form-checkbox-input">
          <div>
            <label for="terms" class="form-checkbox-label">Terms and Conditions</label>
            <p class="form-checkbox-description">By checking this box, you agree to our terms of service and privacy policy.</p>
          </div>
        </div>
      </div>
    \`
  })
}`,...(d=(b=e.parameters)==null?void 0:b.docs)==null?void 0:d.source}}};const h=["BasicCheckbox","CheckboxGroup","CheckboxWithDescription"];export{o as BasicCheckbox,c as CheckboxGroup,e as CheckboxWithDescription,h as __namedExportsOrder,p as default};
