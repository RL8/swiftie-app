import { derived } from 'svelte/store';
import { page } from '$app/stores';
import { base } from '$app/paths';

export const albumBasePath = derived(page, () => `${base}/albums`);
