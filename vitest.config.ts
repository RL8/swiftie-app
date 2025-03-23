import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.ts'],
    setupFiles: ['./tests/setup.ts'],
    // Mock SvelteKit modules that aren't needed for component tests
    deps: {
      inline: [/^svelte/, /@sveltejs\/kit/],
    },
    // Ensure we're using jsdom for the browser environment
    environmentOptions: {
      jsdom: {
        url: 'http://localhost'
      }
    }
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      '$app/navigation': path.resolve('./src/mocks/sveltekit.ts'),
      '$app/forms': path.resolve('./src/mocks/sveltekit.ts'),
      '$app/stores': path.resolve('./src/mocks/sveltekit.ts'),
      '$app/environment': path.resolve('./src/mocks/sveltekit.ts'),
      // Add other SvelteKit aliases as needed
      '__sveltekit': path.resolve('./src/mocks/sveltekit.ts')
    },
  },
});
