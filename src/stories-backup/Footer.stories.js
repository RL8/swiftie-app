import Footer from '../lib/components/layout/Footer.svelte';
import Button from '../lib/components/Button/Button.svelte';

export default {
  title: 'Layout/Footer',
  component: Footer,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['base', 'button'] },
    },
    hasBorder: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    variant: 'base',
    hasBorder: true,
  },
  render: (args) => ({
    Component: Footer,
    props: args,
    slots: {
      default: () => '<div>Footer content</div>',
    },
  }),
};

export const WithButtons = {
  args: {
    variant: 'button',
    hasBorder: true,
  },
  render: (args) => ({
    Component: Footer,
    props: args,
    slots: {
      default: () => `
        <div class="button-container">
          <div>
            <Button variant="primary" label="Back" />
          </div>
          <div>
            <Button variant="secondary" label="Export" />
          </div>
        </div>
      `,
    },
  }),
};
