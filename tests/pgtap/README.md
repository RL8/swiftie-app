# pgTAP Testing for Swiftie App

This directory contains pgTAP tests for the Swiftie App database. These tests verify the integrity and functionality of the database schema, functions, policies, and operations.

## Test Structure

The tests are organized into the following categories:

1. **Table Structure Tests** (`01_table_structure.sql`): Verify that tables exist with the correct columns and constraints.
2. **Database Function Tests** (`02_database_functions.sql`): Test the behavior of database functions like `increment_early_adopter_count` and `check_early_adopter_availability`.
3. **Row Level Security Tests** (`03_rls_policies.sql`): Ensure that RLS policies are correctly implemented for each table.
4. **Test User Management Tests** (`04_test_user_management.sql`): Validate the queries and procedures used to manage test users.

## Running the Tests

Use the `run_pgtap_tests.ps1` script in the root directory to run all tests:

```powershell
.\run_pgtap_tests.ps1
```

The script will:
1. Connect to your Supabase database using credentials from the `.env` file
2. Run each test file in sequence
3. Display the test results

## Adding New Tests

To add new tests:

1. Create a new SQL file in this directory with a descriptive name
2. Follow the pgTAP test structure:
   ```sql
   BEGIN;
   SELECT plan(n);  -- where n is the number of tests
   
   -- Your tests here
   
   SELECT * FROM finish();
   ROLLBACK;
   ```
3. Use pgTAP functions like `ok()`, `is()`, `isnt()`, `has_table()`, etc.

## Best Practices

- Always wrap tests in a transaction (BEGIN/ROLLBACK) to avoid modifying the database
- Use savepoints for tests that need to modify data temporarily
- Keep tests focused on a single feature or component
- Use descriptive test names to make failures easier to understand
- Run tests regularly, especially after schema changes

## Resources

- [pgTAP Documentation](https://pgtap.org/documentation.html)
- [pgTAP Function Reference](https://pgtap.org/documentation.html#functions)
