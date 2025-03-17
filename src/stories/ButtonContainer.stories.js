export default {
  title: 'Layout/ButtonContainer',
  parameters: {
    layout: 'centered',
  },
};

export const DefaultButtonContainer = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
        </div>
      </div>
    `,
  }),
};

export const SingleButton = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-primary">Submit</button>
        </div>
      </div>
    `,
  }),
};

export const ThreeButtons = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 400px; padding: 20px; background-color: var(--bg-card);">
        <div class="button-container">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-secondary">Save Draft</button>
          <button class="btn btn-primary">Submit</button>
        </div>
      </div>
    `,
  }),
};
