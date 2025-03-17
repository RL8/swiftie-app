import SimpleSunburst from '../lib/components/visualizations/SimpleSunburst.svelte';

export default {
  title: 'Visualizations/SimpleSunburst',
  component: SimpleSunburst,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    height: { control: 'text' },
  }
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
