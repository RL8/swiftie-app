import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Adapter-auto will detect Vercel during deployment and use the proper adapter
		adapter: adapter(),
		paths: {
			base: process.env.BASE_PATH || ''
		},
		// This ensures proper handling of 404 pages on Vercel
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// ignore deliberate link to shiny 404 page
				if (path === '/404') {
					return;
				}

				// otherwise fail the build
				throw new Error(message);
			}
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
