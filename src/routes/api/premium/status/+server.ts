import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET handler for checking premium status
 * Modified to always return premium access without authentication
 */
export async function GET(event: RequestEvent) {
  try {
    // Always return premium status as true without authentication
    return json({
      isPremium: true,
      subscriptionType: 'lifetime',
      subscriptionStartDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking premium status:', error);
    return json({ error: 'Failed to check premium status' }, { status: 500 });
  }
}
