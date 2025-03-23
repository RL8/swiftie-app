-- 05_premium_features.sql
-- Tests for premium features and user management

BEGIN;

-- Load pgTAP
SELECT plan(5);

-- Test early adopter availability function
SELECT ok(
    check_early_adopter_availability() IS NOT NULL,
    'check_early_adopter_availability function should return a value'
);

-- Test premium_users table constraints
SELECT col_type_is(
    'public', 'premium_users', 'subscription_type',
    'text',
    'subscription_type should be of type text'
);

SELECT col_is_null(
    'public', 'premium_users', 'subscription_end_date',
    'subscription_end_date can be null'
);

-- Test test user pattern matching
SELECT ok(
    'test123@gmail.com' LIKE '%test%@gmail.com',
    'Email pattern should match test users'
);

SELECT ok(
    'regular@gmail.com' NOT LIKE '%test%@gmail.com',
    'Email pattern should not match regular users'
);

SELECT * FROM finish();
ROLLBACK;
