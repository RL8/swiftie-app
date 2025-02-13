import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			strict: false
		}),
		paths: {
			base: process.env.BASE_PATH || ''
		}
	},
	preprocess: vitePreprocess()
};

export default config;
