// Script to count users in the Supabase database
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
  dotenv.config({ path: envPath });
} else {
  console.error('.env file not found. Please make sure it exists in the project root.');
  process.exit(1);
}

// Initialize Supabase client
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key not found in environment variables.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Connecting to Supabase...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function countUsers() {
  try {
    console.log('Querying profiles table...');
    // Count users in the profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error counting profiles:', profilesError.message);
    } else {
      console.log(`Number of users in profiles: ${profiles ? profiles.length : 0}`);
    }
    
    console.log('Querying premium_users table...');
    // Count premium users
    const { data: premiumUsers, error: premiumError } = await supabase
      .from('premium_users')
      .select('*');
    
    if (premiumError) {
      console.error('Error counting premium users:', premiumError.message);
    } else {
      console.log(`Number of premium users: ${premiumUsers ? premiumUsers.length : 0}`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
countUsers().finally(() => {
  console.log('Done!');
});
