import type { StorybookConfig } from '@storybook/sveltekit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|ts)"
  ],
  "addons": [
    "@storybook/addon-svelte-csf",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/sveltekit",
    "options": {
      "configPath": "./.storybook/svelte.config.js"
    }
  },
  "docs": {
    "autodocs": true
  },
  "core": {
    "disableTelemetry": true
  },
  "viteFinal": async (config) => {
    // Add any custom Vite configuration here
    return config;
  }
};
export default config;