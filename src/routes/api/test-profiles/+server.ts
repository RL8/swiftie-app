import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Test if the profiles table exists
    const { data, error } = await locals.supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying profiles table:', error);
      return json({ success: false, error: error.message });
    }
    
    return json({ 
      success: true, 
      message: 'Profiles table exists and is accessible',
      data
    });
  } catch (err) {
    console.error('Error in test endpoint:', err);
    return json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};
