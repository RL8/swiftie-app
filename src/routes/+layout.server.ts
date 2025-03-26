import type { LayoutServerLoad } from './$types';
import { AuthService } from '$lib/services/AuthService';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Get auth error and protected route flag from hooks
  const authError = locals.authError || null;
  const isProtectedRouteWithoutAuth = locals.isProtectedRouteWithoutAuth || false;
  
  // Get authentication session if available
  const authenticatedSession = locals.authenticatedSession || null;
  
  // Initialize auth service
  const authService = new AuthService({ locals });
  
  // Check email verification status
  let isEmailVerified = true; // Default to true for non-authenticated users
  let needsVerification = false;
  
  if (authenticatedSession) {
    try {
      const verificationResult = await authService.isEmailVerified();
      isEmailVerified = verificationResult.verified;
      needsVerification = !isEmailVerified;
    } catch (error) {
      console.error('Error checking email verification status:', error);
    }
  }
  
  return {
    authError,
    isProtectedRouteWithoutAuth,
    authenticatedSession,
    isEmailVerified,
    needsVerification,
    currentPath: url.pathname
  };
};
