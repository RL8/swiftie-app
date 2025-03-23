-- 04_test_user_management.sql
-- Tests for test user management functionality

BEGIN;

-- Load pgTAP
SELECT plan(3);

-- Create a test user for testing
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    INSERT INTO auth.users (id, email) 
    VALUES (gen_random_uuid(), 'test_user_for_pgtap@gmail.com')
    RETURNING id INTO test_user_id;

    INSERT INTO public.profiles (id, username)
    VALUES (test_user_id, 'test_user_pgtap');
END $$;

-- Test that the test user is found by the query pattern
SELECT isnt_empty(
    'SELECT id FROM auth.users WHERE email LIKE ''%test%@gmail.com''',
    'Test user should be found by the query pattern'
);

-- Test the join query used to find test users
SELECT isnt_empty(
    'SELECT u.id, u.email, p.username
     FROM auth.users u
     LEFT JOIN public.profiles p ON u.id = p.id
     WHERE u.email LIKE ''%test%@gmail.com''',
    'Test user should be found by the join query'
);

-- Test deletion logic
DO $$
BEGIN
    -- Delete from profiles first (to maintain referential integrity)
    DELETE FROM public.profiles 
    WHERE id IN (
        SELECT id FROM auth.users 
        WHERE email = 'test_user_for_pgtap@gmail.com'
    );
    
    -- Then delete the users themselves
    DELETE FROM auth.users 
    WHERE email = 'test_user_for_pgtap@gmail.com';
END $$;

-- Verify user was deleted
SELECT is_empty(
    'SELECT id FROM auth.users WHERE email = ''test_user_for_pgtap@gmail.com''',
    'Test user should be deleted after running deletion logic'
);

SELECT * FROM finish();
ROLLBACK;
