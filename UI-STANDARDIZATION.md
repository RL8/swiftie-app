# UI Standardization Guide

This document outlines the standardized UI components and styling guidelines for the Swiftie App.

## Theme Variables

All UI components should use the theme variables defined in `src/lib/styles/theme.css`. These variables ensure consistency across the application and make it easier to update the design in the future.

### Color Variables

```css
/* Primary Colors */
--color-primary: #f43f5e;
--color-primary-dark: #e11d48;
--color-primary-light: #fb7185;
--color-primary-alpha: rgba(244, 63, 94, 0.2);

/* Secondary Colors */
--color-secondary: #e2e8f0;
--color-secondary-dark: #94a3b8;
--color-secondary-light: #f8fafc;

/* Text Colors */
--text-on-primary: #ffffff;
--text-on-secondary: #334155;
```

### Spacing Variables

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;
```

## Components

### Buttons

Buttons come in two variants: `primary` and `secondary`. They can also be `compact` or `fullWidth`.

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
```

### Form Elements

All form elements should use the classes defined in `src/lib/styles/forms.css`.

#### Form Groups

```html
<div class="form-group">
  <label for="input-id" class="form-label">Label Text</label>
  <input type="text" id="input-id" class="form-input" placeholder="Placeholder text">
</div>
```

#### Form Cards

```html
<div class="form-card">
  <h2 class="form-card-title">Card Title</h2>
  <div class="form-card-content">
    <!-- Form content goes here -->
  </div>
</div>
```

#### Checkboxes

```html
<div class="form-checkbox">
  <input type="checkbox" id="checkbox-id" class="form-checkbox-input">
  <label for="checkbox-id" class="form-checkbox-label">Checkbox Label</label>
</div>
```

#### Button Container

For aligning multiple buttons:

```html
<div class="button-container">
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-primary">Submit</button>
</div>
```

## Storybook

All standardized components are available in Storybook. To run Storybook:

```
npm run storybook
```

This will start Storybook on http://localhost:6006, where you can view and interact with all the components.

## Best Practices

1. Always use theme variables for colors, spacing, and typography
2. Use the standardized components and classes for consistency
3. Follow the established patterns for new components
4. Test all components in different viewport sizes
5. Ensure all interactive elements have appropriate focus states
