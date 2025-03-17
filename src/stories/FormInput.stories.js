export default {
  title: 'Forms/Input',
  parameters: {
    layout: 'centered',
  },
};

export const TextInput = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="text-input" class="form-label">Text Input</label>
          <input type="text" id="text-input" class="form-input" placeholder="Enter text here">
        </div>
      </div>
    `,
  }),
};

export const EmailInput = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="email-input" class="form-label">Email Address</label>
          <input type="email" id="email-input" class="form-input" placeholder="your@email.com">
        </div>
      </div>
    `,
  }),
};

export const PasswordInput = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="password-input" class="form-label">Password</label>
          <input type="password" id="password-input" class="form-input" placeholder="Enter password">
        </div>
      </div>
    `,
  }),
};

export const WithError = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 300px; padding: 20px; background-color: var(--bg-card);">
        <div class="form-group">
          <label for="error-input" class="form-label">Input with Error</label>
          <input type="text" id="error-input" class="form-input form-input-error" value="Invalid input">
          <div class="form-error-message">This field contains an error</div>
        </div>
      </div>
    `,
  }),
};
