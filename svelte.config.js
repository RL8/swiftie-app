import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Instead of auto adapter, we'll use the static adapter
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		paths: {
			base: process.env.BASE_PATH || ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// ignore deliberate link to shiny 404 page
				if (path === '/404') {
					return;
				}

				// otherwise fail the build
				throw new Error(message);
			},
			// Disable prerendering for the entire application
			// This is a common approach for apps with authentication flows
			entries: []
		}
	},
	compilerOptions: {
		compatibility: {
			componentApi: 4
		}
	},
	preprocess: vitePreprocess()
};

export default config;
