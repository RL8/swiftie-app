-- 01_table_structure.sql
-- Tests for database table structure

BEGIN;

-- Load pgTAP
SELECT plan(14);

-- Test that tables exist
SELECT has_table('public', 'profiles', 'Profiles table should exist');
SELECT has_table('public', 'premium_users', 'Premium users table should exist');
SELECT has_table('public', 'payment_records', 'Payment records table should exist');
SELECT has_table('public', 'early_adopter_count', 'Early adopter count table should exist');

-- Test profiles table structure
SELECT has_column('public', 'profiles', 'id', 'Profiles table should have id column');
SELECT has_column('public', 'profiles', 'username', 'Profiles table should have username column');
SELECT has_column('public', 'profiles', 'created_at', 'Profiles table should have created_at column');
SELECT has_column('public', 'profiles', 'updated_at', 'Profiles table should have updated_at column');

-- Test premium_users table structure
SELECT has_column('public', 'premium_users', 'id', 'Premium users table should have id column');
SELECT has_column('public', 'premium_users', 'is_premium', 'Premium users table should have is_premium column');
SELECT has_column('public', 'premium_users', 'subscription_type', 'Premium users table should have subscription_type column');

-- Test primary key constraints
SELECT col_is_pk('public', 'profiles', 'id', 'id should be the primary key for profiles');
SELECT col_is_pk('public', 'premium_users', 'id', 'id should be the primary key for premium_users');
SELECT col_is_pk('public', 'payment_records', 'id', 'id should be the primary key for payment_records');

SELECT * FROM finish();
ROLLBACK;
