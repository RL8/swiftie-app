-- 02_database_functions.sql
-- Tests for database functions

BEGIN;

-- Load pgTAP
SELECT plan(6);

-- Test function existence
SELECT has_function(
    'public', 
    'increment_early_adopter_count', 
    'Function increment_early_adopter_count should exist'
);

SELECT has_function(
    'public', 
    'check_early_adopter_availability', 
    'Function check_early_adopter_availability should exist'
);

-- Save the current state to restore later
SAVEPOINT before_tests;

-- Reset the early_adopter_count for testing
UPDATE early_adopter_count SET current_count = 0 WHERE id = 1;

-- Test initial state
SELECT is(
    (SELECT current_count FROM early_adopter_count WHERE id = 1),
    0,
    'early_adopter_count should start at 0'
);

-- Test function increments correctly
SELECT is(
    increment_early_adopter_count(),
    1,
    'increment_early_adopter_count should return 1 after first call'
);

-- Test that the database was updated
SELECT is(
    (SELECT current_count FROM early_adopter_count WHERE id = 1),
    1,
    'early_adopter_count should be 1 after increment'
);

-- Test availability function
SELECT is(
    check_early_adopter_availability(),
    true,
    'Early adopter slots should be available when count < max'
);

-- Restore the original state
ROLLBACK TO before_tests;

SELECT * FROM finish();
ROLLBACK;
