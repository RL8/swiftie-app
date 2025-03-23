// Script to create a test user in Supabase without email verification
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('.env file found at:', envPath);
  dotenv.config({ path: envPath });
  
  // Initialize Supabase client with service role key for admin access
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or service role key not found in environment variables');
    console.error('Make sure SUPABASE_SERVICE_ROLE_KEY is set in your .env file');
    process.exit(1);
  }
  
  // Debug information
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Key starts with:', supabaseServiceKey.substring(0, 10) + '...');
  
  // Extract project ref from URL and service key
  const urlProjectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'unknown';
  
  // Extract project ref from JWT payload in service key
  let serviceKeyProjectRef = 'unknown';
  try {
    const jwtParts = supabaseServiceKey.split('.');
    if (jwtParts.length >= 2) {
      const payload = JSON.parse(Buffer.from(jwtParts[1], 'base64').toString());
      serviceKeyProjectRef = payload.ref || 'unknown';
    }
  } catch (error) {
    console.error('Error parsing service key JWT:', error.message);
  }
  
  console.log('Project ref from URL:', urlProjectRef);
  console.log('Project ref from service key:', serviceKeyProjectRef);
  
  if (urlProjectRef !== serviceKeyProjectRef) {
    console.warn('WARNING: Project ref mismatch between URL and service key!');
    console.warn('This may cause authentication errors.');
  }
  
  console.log('Connecting to Supabase with service role key...');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Generate a random string for the email
  const randomString = crypto.randomBytes(4).toString('hex');
  
  // Test user details - using gmail.com domain as per memory with random email
  const testUser = {
    email: `testuser${randomString}@gmail.com`,
    password: 'password123',
    username: `testuser${randomString}`,
    full_name: 'Test User',
    avatar_url: `https://i.pravatar.cc/150?u=testuser${randomString}@gmail.com`
  };
  
  async function createTestUser() {
    try {
      console.log('Creating test user...');
      console.log('Using email:', testUser.email);
      
      // Create user directly with admin API (no email verification needed)
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true, // Automatically confirm the email
        user_metadata: {
          full_name: testUser.full_name
        }
      });
      
      if (authError) {
        console.error('Error creating auth user:', authError.message);
        console.error('Full error:', JSON.stringify(authError, null, 2));
        return;
      }
      
      console.log('Auth user created successfully:', authUser.user.id);
      console.log('Email automatically confirmed using admin API');
      
      // Create profile in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.user.id,
          username: testUser.username,
          full_name: testUser.full_name,
          avatar_url: testUser.avatar_url,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (profileError) {
        console.error('Error creating profile:', profileError.message);
      } else {
        console.log('Profile created/updated successfully.');
      }
      
      // Print login information
      console.log('\nTest User Created Successfully!');
      console.log('--------------------------------');
      console.log('Email:', testUser.email);
      console.log('Password:', testUser.password);
      console.log('User ID:', authUser.user.id);
      console.log('Username:', testUser.username);
      console.log('\nThis user is ready to use immediately (no email verification needed)');
      
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }
  
  // Run the function
  createTestUser().finally(() => {
    console.log('Done!');
  });
  
} else {
  console.error('.env file not found. Please make sure it exists in the project root.');
  process.exit(1);
}
