// Script to check Supabase SMTP configuration by sending a test email
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import chalk from 'chalk';
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

async function checkSmtpConfig() {
  try {
    console.log(chalk.blue('\nChecking Supabase SMTP configuration...'));
    
    // Ask for test email
    const { email } = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email address to receive a test email:',
        validate: (input) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(input)) {
            return true;
          }
          return 'Please enter a valid email address';
        }
      }
    ]);
    
    // Ask for test method
    const { testMethod } = await inquirer.prompt([
      {
        type: 'list',
        name: 'testMethod',
        message: 'How would you like to test the SMTP configuration?',
        choices: [
          { name: 'Send password reset email', value: 'reset' },
          { name: 'Send magic link', value: 'magic' },
          { name: 'Create test user (will send confirmation email)', value: 'signup' }
        ]
      }
    ]);
    
    console.log(chalk.blue('\nSending test email...'));
    
    let success = false;
    
    if (testMethod === 'reset') {
      // Send password reset email
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173'}/reset-password`,
      });
      
      if (error) {
        console.error(chalk.red('Error sending password reset email:'), error.message);
      } else {
        console.log(chalk.green('Password reset email sent successfully!'));
        success = true;
      }
    } else if (testMethod === 'magic') {
      // Send magic link
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${process.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173'}/auth/callback`,
        }
      });
      
      if (error) {
        console.error(chalk.red('Error sending magic link:'), error.message);
      } else {
        console.log(chalk.green('Magic link email sent successfully!'));
        success = true;
      }
    } else if (testMethod === 'signup') {
      // Generate random string for test user
      const randomString = Math.random().toString(36).substring(2, 8);
      const testEmail = `test${randomString}@gmail.com`;
      
      console.log(chalk.yellow('Creating test user:'), testEmail);
      
      // Create user with email confirmation required
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: `Password123!${randomString}`,
        email_confirm: false, // Set to false to trigger confirmation email
      });
      
      if (authError) {
        console.error(chalk.red('Error creating test user:'), authError.message);
      } else {
        console.log(chalk.green('Test user created and confirmation email sent!'));
        console.log(chalk.green('User ID:'), authUser.user.id);
        
        // Clean up test user after a delay
        setTimeout(async () => {
          console.log(chalk.blue('Cleaning up test user...'));
          const { error: deleteError } = await supabase.auth.admin.deleteUser(authUser.user.id);
          
          if (deleteError) {
            console.error(chalk.red('Error deleting test user:'), deleteError.message);
          } else {
            console.log(chalk.green('Test user deleted successfully'));
          }
        }, 5000);
        
        success = true;
      }
    }
    
    if (success) {
      console.log(chalk.blue('\nEmail Header Check Instructions:'));
      console.log(chalk.yellow('1. Check your email inbox (including spam folder)'));
      console.log(chalk.yellow('2. When you receive the email, view the email headers'));
      console.log(chalk.yellow('3. Look for the following indicators that Resend is being used:'));
      console.log(chalk.yellow('   - Headers containing "resend" or "smtp.resend.com"'));
      console.log(chalk.yellow('   - "Return-Path" or "X-Mailer" headers mentioning Resend'));
      console.log(chalk.yellow('   - "Received" headers showing the email passed through Resend servers'));
      
      // Wait for user to check email
      const { received } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'received',
          message: 'Did you receive the email?',
          default: false
        }
      ]);
      
      if (received) {
        // Ask about email headers
        const { headerCheck } = await inquirer.prompt([
          {
            type: 'list',
            name: 'headerCheck',
            message: 'Based on the email headers, which email provider was used?',
            choices: [
              { name: 'Resend (found "resend" in headers)', value: 'resend' },
              { name: 'Supabase default email service', value: 'supabase' },
              { name: 'Another provider (not Resend or Supabase)', value: 'other' },
              { name: 'Cannot determine from headers', value: 'unknown' }
            ]
          }
        ]);
        
        if (headerCheck === 'resend') {
          console.log(chalk.green('\n✅ Success! Supabase is correctly configured to use Resend for sending emails.'));
          console.log(chalk.green('All sign-up emails will be sent through Resend.'));
        } else if (headerCheck === 'supabase') {
          console.log(chalk.red('\n❌ Emails are still being sent through Supabase\'s default email service.'));
          console.log(chalk.yellow('Please check your SMTP configuration in the Supabase dashboard:'));
          console.log(chalk.yellow('1. Go to Authentication → Email Templates → SMTP Settings'));
          console.log(chalk.yellow('2. Ensure the SMTP Host is set to smtp.resend.com'));
          console.log(chalk.yellow('3. Verify the port is 465 (SSL) or 587 (TLS)'));
          console.log(chalk.yellow('4. Make sure your Resend API key is correctly entered as the username'));
        } else {
          console.log(chalk.yellow('\n⚠️ Email provider could not be definitively determined.'));
          console.log(chalk.yellow('Please double-check your SMTP configuration in the Supabase dashboard.'));
        }
      } else {
        console.log(chalk.red('\n❌ No email received. This could indicate an issue with your SMTP configuration.'));
        console.log(chalk.yellow('Please check:'));
        console.log(chalk.yellow('1. Your Supabase SMTP settings are correct'));
        console.log(chalk.yellow('2. Resend API key is valid'));
        console.log(chalk.yellow('3. Email templates are properly configured'));
      }
    }
    
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
  }
}

// Run the check
checkSmtpConfig().finally(() => {
  console.log(chalk.blue('\nCheck completed'));
});
