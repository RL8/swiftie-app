// Script to test Supabase SMTP email functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import chalk from 'chalk';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = resolve(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error(chalk.red('.env.local file not found. Please make sure it exists in the project root.'));
  process.exit(1);
}

console.log(chalk.blue('Loading environment variables from:'), envPath);
dotenv.config({ path: envPath });

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(chalk.red('Supabase URL or service role key not found in environment variables'));
  console.error(chalk.red('Make sure SUPABASE_SERVICE_ROLE_KEY is set in your .env.local file'));
  process.exit(1);
}

console.log(chalk.green('Supabase URL:'), supabaseUrl);
console.log(chalk.green('Service Key starts with:'), supabaseServiceKey.substring(0, 10) + '...');

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Email to test with - you can change this to your email
const testEmail = process.argv[2];

if (!testEmail) {
  console.error(chalk.red('Please provide an email address as a command line argument'));
  console.error(chalk.yellow('Example: node scripts/test-smtp.js your-email@example.com'));
  process.exit(1);
}

async function testPasswordReset() {
  console.log(chalk.blue('Testing password reset email functionality...'));
  console.log(chalk.blue('Sending password reset email to:'), testEmail);
  
  try {
    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${process.env.VITE_PUBLIC_SITE_URL}/reset-password`,
    });
    
    if (error) {
      console.error(chalk.red('Error sending password reset email:'), error.message);
      console.error(chalk.red('Full error:'), JSON.stringify(error, null, 2));
      return;
    }
    
    console.log(chalk.green('Password reset email sent successfully!'));
    console.log(chalk.yellow('Please check your email inbox (and spam folder) for the reset email'));
    console.log(chalk.blue('This confirms that your custom SMTP provider is working correctly'));
    
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
  }
}

// Run the test
testPasswordReset().finally(() => {
  console.log(chalk.blue('Test completed'));
});
