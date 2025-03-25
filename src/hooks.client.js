import { createBrowserClient } from '@supabase/ssr';

export const handleFetch = ({ request, fetch }) => {
  // Required for CORS requests to work correctly
  return fetch(request);
};

// Initialize the Supabase client in the browser
/** @type {import('@sveltejs/kit').HandleClientError} */
export const handleError = async ({ error, event }) => {
  console.error('Client error:', error);
  return {
    message: 'An unexpected error occurred.',
    status: 500
  };
};

/** @type {import('@sveltejs/kit').ClientInit} */
export function init() {
  // Client initialization code
  return {
    // Return any props that should be available to all pages
  };
}
