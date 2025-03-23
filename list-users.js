// Script to list users from Supabase using the JavaScript client
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.local file');
  console.error('Make sure PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listUsers() {
  try {
    // Get all users from auth.users (requires service role key)
    console.log('Fetching users from Supabase...');
    
    // First try to get users from auth schema (requires service role)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users from auth schema:', authError.message);
      console.log('Falling back to profiles table...');
      
      // Fallback to profiles table if auth access fails
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
        return;
      }
      
      console.log('\nUsers from profiles table:');
      console.table(profiles);
      
      return;
    }
    
    // If we got auth users successfully
    console.log('\nAll users:');
    console.table(authUsers.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      email_confirmed: user.email_confirmed_at ? 'Yes' : 'No'
    })));
    
    // Get test users specifically
    const testUsers = authUsers.users.filter(user => 
      user.email && user.email.includes('test') && user.email.endsWith('@gmail.com')
    );
    
    console.log('\nTest users:');
    console.table(testUsers.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      email_confirmed: user.email_confirmed_at ? 'Yes' : 'No'
    })));
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the function
listUsers();
