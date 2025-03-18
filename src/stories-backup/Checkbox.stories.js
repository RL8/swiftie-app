export default {
  title: 'Forms/Checkbox',
  parameters: {
    layout: 'centered',
  },
};

export const BasicCheckbox = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-checkbox">
          <input type="checkbox" id="basic-checkbox" class="form-checkbox-input">
          <label for="basic-checkbox" class="form-checkbox-label">Basic Checkbox</label>
        </div>
      </div>
    `,
  }),
};

export const CheckboxGroup = {
  render: () => ({
    Component: null,
    html: `
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
    `,
  }),
};

export const CheckboxWithDescription = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-checkbox">
          <input type="checkbox" id="terms" class="form-checkbox-input">
          <div>
            <label for="terms" class="form-checkbox-label">Terms and Conditions</label>
            <p class="form-checkbox-description">By checking this box, you agree to our terms of service and privacy policy.</p>
          </div>
        </div>
      </div>
    `,
  }),
};
