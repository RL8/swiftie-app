import { redirect } from '@sveltejs/kit';
import { getRedditToken, getRedditUsername } from '$lib/reddit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  // Verify state parameter to prevent CSRF attacks
  const storedState = cookies.get('reddit_auth_state');
  
  if (!storedState || state !== storedState) {
    return {
      success: false,
      error: 'Invalid state parameter. Please try again.'
    };
  }
  
  // Clear the state cookie as it's no longer needed
  cookies.delete('reddit_auth_state', { path: '/' });
  
  if (!code) {
    return {
      success: false,
      error: 'No authorization code provided. Authentication failed.'
    };
  }
  
  try {
    // Exchange code for access token
    const { accessToken, refreshToken } = await getRedditToken(code);
    
    // Get Reddit username
    const username = await getRedditUsername(accessToken);
    
    if (!username) {
      return {
        success: false,
        error: 'Could not retrieve Reddit username. Please try again.'
      };
    }
    
    // Store tokens and username in cookies for later verification
    cookies.set('reddit_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    cookies.set('reddit_refresh_token', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    cookies.set('reddit_username', username, {
      path: '/',
      httpOnly: false, // Allow JavaScript access to display the username
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    // Return success with username
    return {
      success: true,
      username
    };
  } catch (error) {
    console.error('Reddit authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred during Reddit authentication.'
    };
  }
};
