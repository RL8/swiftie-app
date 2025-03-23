// Script to get the Supabase dashboard URL
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
  
  // Get the Supabase URL
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    console.error('PUBLIC_SUPABASE_URL not found in environment variables');
    process.exit(1);
  }
  
  // Extract the project ID from the URL
  // Example URL: https://wnaxmgtrdhlousolblcr.supabase.co
  const projectId = supabaseUrl.split('https://')[1].split('.supabase.co')[0];
  
  console.log('\nSupabase Dashboard Information');
  console.log('=============================');
  console.log(`Project ID: ${projectId}`);
  console.log(`Dashboard URL: https://app.supabase.com/project/${projectId}`);
  console.log(`Authentication Settings: https://app.supabase.com/project/${projectId}/auth/settings`);
  
  console.log('\nTo disable email verification:');
  console.log('1. Go to: https://app.supabase.com/project/${projectId}/auth/settings');
  console.log('2. Scroll down to "Email Auth" section');
  console.log('3. Disable "Enable email confirmations"');
  console.log('4. Save changes');
  console.log('5. Run `npm run create-test-user` to create a test user');
  console.log('6. After creating your test users, you can re-enable email confirmations');
  
} else {
  console.error('.env file not found. Please make sure it exists in the project root.');
  process.exit(1);
}
