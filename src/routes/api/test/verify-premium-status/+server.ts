import { json } from '@sveltejs/kit';
import { getSupabase } from '$lib/supabase/client';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET handler to verify premium status for testing
 * This endpoint should only be accessible in test environments
 */
export async function GET(event: RequestEvent) {
  // Only allow this endpoint in test environments
  if (process.env.NODE_ENV !== 'test') {
    return json({ error: 'This endpoint is only available in test environments' }, { status: 403 });
  }

  try {
    const { supabaseClient } = await getSupabase(event);
    
    // Get the current user
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check premium status
    const { data, error } = await supabaseClient
      .from('premium_users')
      .select('is_premium, subscription_type')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking premium status:', error);
      return json({ error: 'Error checking premium status' }, { status: 500 });
    }
    
    return json({
      isPremium: data?.is_premium || false,
      subscriptionType: data?.subscription_type || 'none'
    });
  } catch (error) {
    console.error('Error in verify-premium-status endpoint:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
