-- Run all pgTAP tests for the Swiftie App
-- This file will execute all test files in the pgtap directory

\echo 'Running all pgTAP tests for Swiftie App...'

-- Load the pgTAP extension
\echo 'Loading pgTAP extension...'
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Set search path to include the pgTAP schema
SET search_path TO public, pgtap;

-- Run the example tests
\echo 'Running example tests...'
\i tests/pgtap/examples/user_profile_tests.sql

-- Add more test files here as they are created
-- \i tests/pgtap/other_test_file.sql

\echo 'All pgTAP tests completed.'
