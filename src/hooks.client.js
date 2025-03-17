import { createBrowserClient } from '@supabase/ssr';

export const handleFetch = ({ request, fetch }) => {
  // Required for CORS requests to work correctly
  return fetch(request);
};

// Initialize the Supabase client in the browser
export const handleClientError = async ({ error, event }) => {
  console.error('Client error:', error);
  return {
    message: 'An unexpected error occurred.',
    status: 500
  };
};
