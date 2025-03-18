import Button from '../lib/components/demo/Button.svelte';

export default {
  title: 'Demo/Button Demo',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
  }
};

export const Primary = {
  args: {
    primary: true,
    label: 'Primary Button',
  },
};

export const Secondary = {
  args: {
    primary: false,
    label: 'Secondary Button',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'Large Button',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'Small Button',
  },
};
