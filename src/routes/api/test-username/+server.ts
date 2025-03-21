import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return json({ success: false, error: 'Username is required' }, { status: 400 });
    }
    
    // Check if username is valid
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return json({ 
        success: false, 
        error: 'Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens' 
      }, { status: 400 });
    }
    
    // Check if username is already taken
    const { data: existingUser, error: checkError } = await locals.supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error checking username:', checkError);
      return json({ success: false, error: checkError.message }, { status: 500 });
    }
    
    if (existingUser) {
      return json({ success: false, error: 'Username is already taken' }, { status: 409 });
    }
    
    return json({ 
      success: true, 
      message: 'Username is available',
      username
    });
  } catch (err) {
    console.error('Error in test endpoint:', err);
    return json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    }, { status: 500 });
  }
};
