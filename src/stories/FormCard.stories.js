export default {
  title: 'Forms/Card',
  parameters: {
    layout: 'centered',
  },
};

export const BasicFormCard = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 400px;">
        <div class="form-card">
          <h2 class="form-card-title">Form Card Title</h2>
          <div class="form-card-content">
            <div class="form-group">
              <label for="username" class="form-label">Username</label>
              <input type="text" id="username" class="form-input" placeholder="Enter username">
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" class="form-input" placeholder="Enter email">
            </div>
            <div class="button-container">
              <button class="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const WithDivider = {
  render: () => ({
    Component: null,
    html: `
      <div style="width: 400px;">
        <div class="form-card">
          <h2 class="form-card-title">Form with Divider</h2>
          <div class="form-card-content">
            <div class="form-group">
              <label for="name" class="form-label">Full Name</label>
              <input type="text" id="name" class="form-input" placeholder="Enter your name">
            </div>
            
            <div class="form-divider">
              <span>Optional Information</span>
            </div>
            
            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <input type="tel" id="phone" class="form-input" placeholder="Enter phone number">
            </div>
            
            <div class="button-container">
              <button class="btn btn-secondary">Cancel</button>
              <button class="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
