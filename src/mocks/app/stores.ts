// Mock for $app/stores
import { readable, writable } from 'svelte/store';

// Mock page store
export const page = readable({
  url: new URL('http://localhost'),
  params: {},
  route: {
    id: ''
  },
  status: 200,
  error: null,
  data: {},
  form: {}
});

// Mock navigating store
export const navigating = readable(null);

// Mock updated store
export const updated = readable(false);

// Mock session store (for auth)
export const session = writable(null);
