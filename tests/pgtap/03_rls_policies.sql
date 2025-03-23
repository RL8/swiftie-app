-- 03_rls_policies.sql
-- Tests for Row Level Security policies

BEGIN;

-- Load pgTAP
SELECT plan(4);

-- Test that RLS is enabled on tables
SELECT ok(
    (SELECT COUNT(*) > 0 FROM pg_tables WHERE tablename = 'premium_users' AND rowsecurity = true),
    'RLS should be enabled on premium_users table'
);

SELECT ok(
    (SELECT COUNT(*) > 0 FROM pg_tables WHERE tablename = 'payment_records' AND rowsecurity = true),
    'RLS should be enabled on payment_records table'
);

SELECT ok(
    (SELECT COUNT(*) > 0 FROM pg_tables WHERE tablename = 'early_adopter_count' AND rowsecurity = true),
    'RLS should be enabled on early_adopter_count table'
);

SELECT ok(
    (SELECT COUNT(*) > 0 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true),
    'RLS should be enabled on profiles table'
);

SELECT * FROM finish();
ROLLBACK;
