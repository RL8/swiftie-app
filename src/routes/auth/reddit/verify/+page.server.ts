import { redirect } from '@sveltejs/kit';
import { getRedditUserData, checkSwiftieActivity, getSwiftieActivityDetails } from '$lib/reddit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Get stored Reddit access token and username
  const accessToken = cookies.get('reddit_access_token');
  const username = cookies.get('reddit_username');
  
  if (!accessToken || !username) {
    // No access token or username, redirect to login
    throw redirect(302, '/login');
  }
  
  try {
    // Check if user is active in Taylor Swift subreddits
    const isSwiftie = await checkSwiftieActivity(accessToken, username);
    
    // Get detailed activity information
    const activityDetails = await getSwiftieActivityDetails(accessToken, username);
    
    if (isSwiftie) {
      // Store verification status in a cookie
      cookies.set('reddit_verified', 'true', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }
    
    // Return verification result
    return {
      success: true,
      username,
      isVerified: isSwiftie,
      activityDetails
    };
  } catch (error) {
    console.error('Reddit verification error:', error);
    return {
      success: false,
      username,
      error: error instanceof Error ? error.message : 'An unknown error occurred during verification.'
    };
  }
};
