/** @type { import('@storybook/svelte').Preview } */

// Import app styles
import '../src/app.css';

// Monkey patch the component API to handle Svelte 5 components
// This ensures Storybook can properly destroy components
if (typeof window !== 'undefined') {
  const originalGet = Map.prototype.get;
  Map.prototype.get = function(...args) {
    const result = originalGet.apply(this, args);
    if (result && !result.$destroy && result.destroy) {
      // If the component has a 'destroy' method but not '$destroy',
      // add a compatibility wrapper
      result.$destroy = function() {
        return this.destroy ? this.destroy() : undefined;
      };
    }
    return result;
  };
}

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'app',
      values: [
        {
          name: 'app',
          value: 'var(--bg-gradient-start)',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
};

export default preview;
