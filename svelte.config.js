import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Use Vercel adapter for better integration with Vercel platform
		adapter: adapter({
			// Vercel adapter options
			runtime: 'nodejs20.x'
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
