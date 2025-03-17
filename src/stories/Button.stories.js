import Button from '../lib/components/Button/Button.svelte';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: { type: 'select', options: ['primary', 'secondary'] },
    },
    size: {
      control: { type: 'select', options: ['default', 'compact'] },
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onclick: { action: 'clicked' }
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    label: 'Primary Button',
    size: 'default',
    fullWidth: false,
    disabled: false
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    label: 'Secondary Button',
    size: 'default',
    fullWidth: false,
    disabled: false
  },
};

export const Compact = {
  args: {
    variant: 'primary',
    label: 'Compact Button',
    size: 'compact',
    fullWidth: false,
    disabled: false
  },
};

export const FullWidth = {
  args: {
    variant: 'primary',
    label: 'Full Width Button',
    size: 'default',
    fullWidth: true,
    disabled: false
  },
};

export const Disabled = {
  args: {
    variant: 'primary',
    label: 'Disabled Button',
    size: 'default',
    fullWidth: false,
    disabled: true
  },
};
