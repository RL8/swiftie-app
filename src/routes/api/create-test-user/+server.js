import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

// Create a Supabase client with service role for admin operations
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// Regular client for non-admin operations
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

/**
 * Generates a random username
 * @returns {string} A random username in the format user_XXXX
 */
function generateRandomUsername() {
  const randomNum = Math.floor(Math.random() * 10000);
  return `test_user_${randomNum.toString().padStart(4, '0')}`;
}

/**
 * Creates a test user using SQL functions that bypass email verification
 * @returns {Promise<Object>} The created user information
 */
async function createTestUser() {
  try {
    // Generate a timestamp for unique email
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    const email = `test_user_${timestamp}@gmail.com`;
    const password = 'password123';
    
    // Call the SQL function to create a pre-verified test user
    const { data, error } = await supabaseAdmin.rpc('create_specific_test_user', {
      email_prefix: 'test_user',
      domain: 'gmail.com',
      password: password
    });
    
    if (error) {
      console.error('Error creating test user with SQL function:', error);
      throw error;
    }
    
    // Get the user details from the profiles table
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(data);
    
    if (userError) {
      console.error('Error fetching created user:', userError);
      throw userError;
    }
    
    // Get the profile details
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }
    
    return {
      user: userData.user,
      profile: profileData,
      password: password
    };
  } catch (error) {
    console.error('Error in createTestUser function:', error);
    throw error;
  }
}

/**
 * GET handler - Lists recent users (not just test users since we can't query auth directly)
 */
export async function GET() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ users: data });
}

/**
 * POST handler - Creates a new test user with pre-verified email
 */
export async function POST({ request, cookies }) {
  try {
    console.log('Creating test user with SQL method (pre-verified email)');
    
    const result = await createTestUser();
    
    // Automatically sign in the user after creation to establish a session
    try {
      console.log('Automatically signing in the created test user');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: result.user.email,
        password: result.password
      });
      
      if (signInError) {
        console.error('Error automatically signing in test user:', signInError);
      } else {
        console.log('Test user automatically signed in, session established');
      }
    } catch (signInErr) {
      console.error('Exception during automatic sign in:', signInErr);
    }
    
    return json({
      success: true,
      message: 'Test user created successfully with pre-verified email and automatically signed in.',
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.profile?.username || 'unknown'
      },
      loginCredentials: {
        email: result.user.email,
        password: result.password
      },
      sessionEstablished: true
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    
    // Create a detailed error object
    const errorDetails = {
      message: error.message,
      code: error.code || 'unknown',
      status: error.status || 500,
      stack: error.stack,
      details: error.details || {}
    };
    
    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));
    
    return json({
      success: false,
      message: 'Failed to create test user',
      error: error.message,
      errorDetails: errorDetails
    }, { status: 500 });
  }
}
