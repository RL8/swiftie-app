import T3x3SunburstStandalone from './T3x3SunburstStandalone.svelte';

export default {
  title: 'Visualizations/T3x3 Sunburst Standalone',
  component: T3x3SunburstStandalone,
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    title: { control: 'text' },
    centerLabel: { control: 'text' }
  }
};

export const Default = {
  args: {
    width: '100%',
    height: '500px',
    title: 'My Top 3×3',
    centerLabel: 'T3×3'
  }
};

export const CustomSized = {
  args: {
    width: '800px',
    height: '600px',
    title: 'Custom Sized T3×3',
    centerLabel: 'Click Me'
  }
};

export const MobileView = {
  args: {
    width: '350px',
    height: '350px',
    title: 'Mobile T3×3 View',
    centerLabel: 'T3×3'
  }
};
