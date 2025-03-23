-- User Profile Tests using pgTAP
-- These tests verify the structure and functionality of the user profiles table and related functions

BEGIN;

-- Load the pgTAP extension
SELECT plan(14);

-- Test that the profiles table exists
SELECT has_table('public', 'profiles', 'Profiles table should exist');

-- Test that the profiles table has the expected columns
SELECT has_column('public', 'profiles', 'id', 'Profiles table should have id column');
SELECT has_column('public', 'profiles', 'user_id', 'Profiles table should have user_id column');
SELECT has_column('public', 'profiles', 'display_name', 'Profiles table should have display_name column');
SELECT has_column('public', 'profiles', 'avatar_url', 'Profiles table should have avatar_url column');
SELECT has_column('public', 'profiles', 'created_at', 'Profiles table should have created_at column');
SELECT has_column('public', 'profiles', 'updated_at', 'Profiles table should have updated_at column');

-- Test column types
SELECT col_type_is('public', 'profiles', 'id', 'uuid', 'id column should be type uuid');
SELECT col_type_is('public', 'profiles', 'user_id', 'uuid', 'user_id column should be type uuid');
SELECT col_type_is('public', 'profiles', 'display_name', 'text', 'display_name column should be type text');

-- Test constraints
SELECT col_is_pk('public', 'profiles', 'id', 'id column should be the primary key');
SELECT col_not_null('public', 'profiles', 'user_id', 'user_id column should be NOT NULL');
SELECT col_is_unique('public', 'profiles', 'user_id', 'user_id column should be UNIQUE');

-- Test RLS policies
SELECT has_table_privilege('anon', 'profiles', 'SELECT', 'Anonymous users should have SELECT access to profiles');

-- Test function for creating a new profile
SELECT has_function(
    'public',
    'create_profile',
    ARRAY['uuid', 'text'],
    'create_profile function should exist with the correct parameters'
);

-- Test function behavior (requires test data setup)
DO $$
DECLARE
    test_user_id UUID := '12345678-1234-1234-1234-123456789012';
    test_display_name TEXT := 'Test User';
    result_id UUID;
BEGIN
    -- Clean up any existing test data
    DELETE FROM profiles WHERE user_id = test_user_id;
    
    -- Call the function
    SELECT id INTO result_id FROM create_profile(test_user_id, test_display_name);
    
    -- Verify the result
    PERFORM is(
        (SELECT display_name FROM profiles WHERE user_id = test_user_id),
        test_display_name,
        'create_profile should create a profile with the correct display name'
    );
    
    -- Clean up
    DELETE FROM profiles WHERE user_id = test_user_id;
END $$;

-- Finish the test plan
SELECT * FROM finish();

ROLLBACK;
