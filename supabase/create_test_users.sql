-- This script creates test users in your Supabase database
-- It uses the create_test_user function defined in migrations

-- Create a test user with default random username
SELECT public.create_test_user('test_user1@gmail.com', 'password123');

-- Create a test user with specific username
SELECT public.create_test_user('test_user2@gmail.com', 'password123', 'swiftie_tester');

-- Create a test user with timestamp in email for guaranteed uniqueness
SELECT public.create_specific_test_user();

-- Note: To delete all test users, run:
-- SELECT public.delete_test_users();
