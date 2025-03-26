import { json } from '@sveltejs/kit';
import { getUserPremiumStatus } from '$lib/services/database';
import { supabase } from '$lib/supabase/client';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET handler for checking premium status
 */
export async function GET(event: RequestEvent) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's premium status
    const premiumStatus = await getUserPremiumStatus();
    
    if (!premiumStatus) {
      return json({ 
        isPremium: false,
        subscriptionType: 'none',
        subscriptionStartDate: null
      });
    }

    // Return the premium status
    return json({
      isPremium: premiumStatus.is_premium,
      subscriptionType: premiumStatus.subscription_type,
      subscriptionStartDate: premiumStatus.subscription_start_date
    });
  } catch (error) {
    console.error('Error checking premium status:', error);
    return json({ error: 'Failed to check premium status' }, { status: 500 });
  }
}
