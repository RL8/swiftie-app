// Script to check authentication directly with Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('.env file found at:', envPath);
  dotenv.config({ path: envPath });
  
  // Initialize Supabase client
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or anon key not found in environment variables');
    process.exit(1);
  }
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Using anon key starting with:', supabaseAnonKey.substring(0, 10) + '...');
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test user credentials - use the same test user we created
  const testUser = {
    email: process.argv[2] || 'testuserfa2ed328@gmail.com',
    password: process.argv[3] || 'password123'
  };
  
  async function checkAuth() {
    try {
      console.log(`Attempting to sign in with email: ${testUser.email}`);
      
      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      });
      
      if (error) {
        console.error('Authentication error:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        return;
      }
      
      console.log('Authentication successful!');
      console.log('User ID:', data.user.id);
      console.log('Session expires at:', new Date(data.session.expires_at * 1000).toISOString());
      
      // Check user metadata
      console.log('User metadata:', JSON.stringify(data.user.user_metadata, null, 2));
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
      } else {
        console.log('User profile:', JSON.stringify(profile, null, 2));
      }
      
      // Check environment variables in the client
      console.log('\nChecking client-side environment variables:');
      console.log('VITE_SUPABASE_URL:', import.meta.env?.VITE_SUPABASE_URL || 'Not defined');
      console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env?.VITE_SUPABASE_ANON_KEY ? 
        (import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10) + '...') : 'Not defined');
      
      // Check if PUBLIC_ variables are accessible via import.meta.env
      console.log('PUBLIC_SUPABASE_URL:', import.meta.env?.PUBLIC_SUPABASE_URL || 'Not defined');
      console.log('PUBLIC_SUPABASE_ANON_KEY:', import.meta.env?.PUBLIC_SUPABASE_ANON_KEY ? 
        (import.meta.env.PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...') : 'Not defined');
      
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }
  
  // Run the check
  checkAuth().finally(() => {
    console.log('Auth check completed');
    process.exit(0);
  });
  
} else {
  console.error('.env file not found at:', envPath);
  process.exit(1);
}
