import SimpleSunburst from '../lib/components/visualizations/SimpleSunburst.svelte';

// Import theme styles directly in the story
import '../lib/styles/theme.css';
import '../lib/styles/global.css';
import '../lib/styles/forms.css';

export default {
  title: 'Visualizations/SimpleSunburst',
  component: SimpleSunburst,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    height: { control: 'text' },
  },
  parameters: {
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#fff1f2' }, // Using literal color values instead of CSS variables
        { name: 'light', value: '#fecdd3' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
};

export const Default = {
  args: {
    title: 'Sunburst Visualization',
    height: '300px',
  },
};

export const Smaller = {
  args: {
    title: 'Small Sunburst Chart',
    height: '200px',
  },
};
