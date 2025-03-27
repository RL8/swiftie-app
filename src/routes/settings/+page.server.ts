import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // This is a simplified version without authentication
  return {
    // Return empty data since we're not using authentication
    user: null,
    settings: {
      theme: 'light',
      notifications: {
        push: true,
        email: false
      }
    }
  };
};
