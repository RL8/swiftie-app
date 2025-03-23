# Supabase Scripts

This directory contains scripts for managing users and other operations in Supabase.

## Available Scripts

- `npm run count-users`: Count the number of users in the database
- `npm run create-test-user`: Create a test user (requires email verification)
- `npm run check-env`: Check if required environment variables are set
- `npm run add-service-key`: Add the Supabase service role key to the .env file
- `npm run check-env-vars`: Check environment variables in detail

## Creating Test Users Without Email Verification

To create test users without email verification, you need to:

1. Log in to the Supabase dashboard
2. Go to Authentication > Settings
3. Scroll down to "Email Auth" section
4. Disable "Enable email confirmations"
5. Save changes
6. Run `npm run create-test-user` to create a test user
7. After creating your test users, you can re-enable email confirmations

## Service Role Key Issues

If you're having issues with the service role key:

1. Go to the Supabase dashboard
2. Click on the project settings (gear icon)
3. Go to API section
4. Copy the "service_role key" (not the anon/public key)
5. Run `npm run add-service-key` and paste the key when prompted
6. Restart your terminal to ensure the environment variables are reloaded

## Email Rate Limiting

Supabase has rate limits on email sending. If you hit the "email rate limit exceeded" error:

1. Wait a few minutes before trying again
2. Use a different email domain (gmail.com is recommended)
3. Use a random email address each time (the script now does this automatically)

## Troubleshooting

If you encounter issues:

1. Check that your .env file contains all required variables
2. Make sure you're using the correct API keys
3. Verify that your Supabase project is running
4. Check the Supabase dashboard for any error messages or logs
