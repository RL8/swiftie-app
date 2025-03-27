import type { LayoutServerLoad } from './$types';

export const load = async ({ locals, url }) => {
  // Return data that can be accessed in layout and pages
  // Without authentication checks but maintaining the same structure
  return {
    currentPath: url.pathname,
    // Provide empty/default values for previously auth-dependent properties
    authError: null,
    isProtectedRouteWithoutAuth: false,
    authenticatedSession: null,
    isEmailVerified: true,
    needsVerification: false
  };
};
