// Script to verify Supabase is using Resend for sign-up emails
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import chalk from 'chalk';
import crypto from 'crypto';
import inquirer from 'inquirer';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local file
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

async function verifyResendSmtp() {
  try {
    // Ask for test email
    const { testOption } = await inquirer.prompt([
      {
        type: 'list',
        name: 'testOption',
        message: 'How would you like to test the Resend SMTP integration?',
        choices: [
          { name: 'Send password reset email to my address', value: 'reset' },
          { name: 'Create new test user and send verification email', value: 'create' },
          { name: 'Send magic link to my email', value: 'magic' }
        ]
      }
    ]);
    
    const { email } = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email address:',
        validate: (input) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(input)) {
            return true;
          }
          return 'Please enter a valid email address';
        }
      }
    ]);
    
    if (testOption === 'reset') {
      // Test password reset flow
      console.log(chalk.blue('\nSending password reset email...'));
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173'}/reset-password`,
      });
      
      if (error) {
        console.error(chalk.red('Error sending password reset email:'), error.message);
        return;
      }
      
      console.log(chalk.green('Password reset email sent successfully!'));
      
    } else if (testOption === 'create') {
      // Generate a random string for the email
      const randomString = crypto.randomBytes(4).toString('hex');
      const testEmail = `test${randomString}@gmail.com`;
      
      console.log(chalk.blue('\nCreating a new test user:'), testEmail);
      
      // Create user with email confirmation required
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: `Password123!${randomString}`,
        email_confirm: false, // Set to false to trigger confirmation email
      });
      
      if (authError) {
        console.error(chalk.red('Error creating test user:'), authError.message);
        return;
      }
      
      console.log(chalk.green('Test user created successfully!'));
      console.log(chalk.green('User ID:'), authUser.user.id);
      console.log(chalk.green('Email:'), testEmail);
      console.log(chalk.yellow('A confirmation email has been sent to the test address'));
      console.log(chalk.yellow('Note: Since this is a test email, you cannot check it directly'));
      
      // Clean up test user
      console.log(chalk.blue('\nCleaning up test user...'));
      const { error: deleteError } = await supabase.auth.admin.deleteUser(authUser.user.id);
      
      if (deleteError) {
        console.error(chalk.red('Error deleting test user:'), deleteError.message);
      } else {
        console.log(chalk.green('Test user deleted successfully'));
      }
      
    } else if (testOption === 'magic') {
      // Test magic link flow
      console.log(chalk.blue('\nSending magic link email...'));
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${process.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173'}/auth/callback`,
        }
      });
      
      if (error) {
        console.error(chalk.red('Error sending magic link:'), error.message);
        return;
      }
      
      console.log(chalk.green('Magic link email sent successfully!'));
    }
    
    // Instructions for checking email
    console.log(chalk.blue('\nVerification Steps:'));
    console.log(chalk.yellow('1. Check your email inbox (including spam folder)'));
    console.log(chalk.yellow('2. When you receive the email, check the email headers to verify it was sent via Resend:'));
    console.log(chalk.yellow('   - Look for headers containing "resend" or "smtp.resend.com"'));
    console.log(chalk.yellow('   - Check the "Return-Path", "X-Mailer", or "Received" headers'));
    console.log(chalk.yellow('   - The "From" address domain might also indicate if Resend was used'));
    
    const { received } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'received',
        message: 'Did you receive the email?',
        default: false
      }
    ]);
    
    if (received) {
      const { fromResend } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'fromResend',
          message: 'Based on the email headers, was it sent through Resend?',
          default: false
        }
      ]);
      
      if (fromResend) {
        console.log(chalk.green('\n✅ Success! Supabase is correctly configured to use Resend for sending emails.'));
      } else {
        console.log(chalk.red('\n❌ The email was not sent through Resend. Please check your SMTP configuration in Supabase.'));
        console.log(chalk.yellow('Verify your SMTP settings in the Supabase dashboard under Authentication → Email Templates → SMTP Settings'));
      }
    } else {
      console.log(chalk.red('\n❌ No email received. This could indicate an issue with your SMTP configuration.'));
      console.log(chalk.yellow('Please check:'));
      console.log(chalk.yellow('1. Your Supabase SMTP settings are correct'));
      console.log(chalk.yellow('2. Resend API key is valid'));
      console.log(chalk.yellow('3. Email templates are properly configured'));
      console.log(chalk.yellow('4. Check your spam folder'));
    }
    
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
  }
}

// Run the verification
verifyResendSmtp().finally(() => {
  console.log(chalk.blue('\nVerification process completed'));
});
