# Supabase Database Operations Guide

## 1. Introduction

This guide documents the various database operations for working with Supabase in this project. It covers setting up database access, querying user data, managing test users, and includes reusable scripts for common operations.

The primary tables we work with are:
- `auth.users` - Contains user authentication information
- `public.profiles` - Contains additional user profile information

## 2. Setting Up Database Access

### Adding PSQL to System PATH

```powershell
# Add PostgreSQL binaries to PATH permanently
$env:Path += ";C:\Program Files\PostgreSQL\17\bin"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::User)

# Verify installation
psql --version
```

### Supabase Connection Parameters

The following connection parameters are used for accessing the Supabase database:

- Host: `aws-0-eu-central-1.pooler.supabase.com`
- Port: `5432`
- Database: `postgres`
- Username: `postgres.wnaxmgtrdhlousolblcr`
- Password: Stored in `.env` file
- SSL Mode: `require`

### Storing Database Credentials

The database password is stored in the `.env` file:

```
SUPABASE_DB_PASSWORD=your_password_here
```

## 3. Working with User Data

### Querying Users

Basic query to get users:

```sql
SELECT 
    u.id, 
    u.email, 
    u.created_at,
    p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 20;
```

### Using PowerShell to Execute Queries

```powershell
# Set password from environment variable
$env:PGPASSWORD = "your_password_here"

# Execute query
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" "host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require" -c "YOUR SQL QUERY HERE"

# Clear password from environment
$env:PGPASSWORD = ""
```

## 4. Managing Test Users

### Finding Test Users

Query to find test users with specific patterns:

```sql
SELECT 
    u.id, 
    u.email, 
    p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email LIKE '%test%@gmail.com'
LIMIT 5;
```

### Deleting Test Users

Transaction-safe deletion of test users:

```sql
BEGIN;
  -- Delete from profiles first (to maintain referential integrity)
  DELETE FROM public.profiles 
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email LIKE '%test%@gmail.com'
  );
  
  -- Then delete the users themselves
  DELETE FROM auth.users 
  WHERE email LIKE '%test%@gmail.com';
COMMIT;
```

## 5. Code Snippets & Reusable Scripts

### Query Test Users Script

```powershell
# query_users_simple.ps1
# Simple script to query test users from Supabase

# Set the password directly
$env:PGPASSWORD = "your_password_here"

# Full path to PSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Run the query to find test users
Write-Host "Running query to find test users..."

# Use -o parameter to output to a file instead of relying on pager
$outputFile = "test_users_results.txt"
& "$psqlPath" "host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require" -c "SELECT u.id, u.email, p.username FROM auth.users u LEFT JOIN public.profiles p ON u.id = p.id WHERE u.email LIKE '%test%@gmail.com' LIMIT 5;" -o $outputFile

# Display the results
if (Test-Path $outputFile) {
    Write-Host "Test users found:"
    Get-Content $outputFile
} else {
    Write-Host "No results were returned or there was an error."
}

# Clear the password from environment for security
$env:PGPASSWORD = ""

Write-Host "Query completed."
```

### List Current Users Script

```powershell
# list_current_users.ps1
# Script to list current users in Supabase database

# Set the password directly
$env:PGPASSWORD = "your_password_here"

# Full path to PSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# SQL for listing users
$listUsersSQL = @"
SELECT 
    u.id, 
    u.email, 
    u.created_at,
    p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 20;
"@

# Save the SQL to a file
$listUsersSQL | Out-File -FilePath "list_users.sql" -Encoding utf8

# Output file for results
$outputFile = "current_users.txt"

# Run the query and save output to file
& "$psqlPath" "host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require" -f list_users.sql -o $outputFile

# Clear the password from environment for security
$env:PGPASSWORD = ""

# Display the results if file exists
if (Test-Path $outputFile) {
    Get-Content $outputFile
} else {
    Write-Host "No results were returned or there was an error."
}
```

### Delete Test Users Script

```powershell
# delete_test_users.ps1
# Script to delete test users from Supabase database

# Set the password directly
$env:PGPASSWORD = "your_password_here"

# Full path to PSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# SQL for deletion with proper transaction handling
$deletionSQL = @"
BEGIN;
  -- Delete from profiles first (to maintain referential integrity)
  DELETE FROM public.profiles 
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email LIKE '%test%@gmail.com'
  );
  
  -- Then delete the users themselves
  DELETE FROM auth.users 
  WHERE email LIKE '%test%@gmail.com';
COMMIT;
"@

# Save the SQL to a file
$deletionSQL | Out-File -FilePath "delete_test_users.sql" -Encoding utf8

Write-Host "Ready to delete all test users with gmail.com email addresses."
Write-Host "This action is permanent and cannot be undone."
Write-Host "To proceed, run the following command after review:"
Write-Host ""
Write-Host "& `"$psqlPath`" `"host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require`" -f delete_test_users.sql"

# Clear the password from environment for security
$env:PGPASSWORD = ""
```

## 6. Security Best Practices

### Handling Database Passwords

1. **Use Environment Variables**: Store passwords in environment variables rather than hardcoding them
   ```powershell
   $env:PGPASSWORD = "your_password_here"
   # Use the password...
   $env:PGPASSWORD = "" # Clear after use
   ```

2. **Use .env Files**: Store sensitive information in .env files (which are in .gitignore)

3. **Avoid Command History**: Don't pass passwords as command-line arguments where they might be stored in command history

### Transaction Safety

Always use transactions for destructive operations:

```sql
BEGIN;
  -- Your destructive operations here
COMMIT;
```

This ensures that operations either complete fully or not at all, maintaining database integrity.

## 7. Troubleshooting

### Common PSQL Connection Issues

1. **SSL Mode**: Supabase requires `sslmode=require` for connections
2. **Password Prompts**: If PGPASSWORD environment variable isn't set, you'll be prompted for a password
3. **Path Issues**: If psql isn't in your PATH, use the full path to the executable

### Output Formatting Problems

1. **Pager Issues**: On Windows, the default pager might cause issues. Use `-o filename` to output to a file instead.
2. **Line Ending Problems**: If output files have strange formatting, ensure you're using UTF-8 encoding:
   ```powershell
   Out-File -FilePath "output.txt" -Encoding utf8
   ```

### Connection String Format

The correct format for the connection string is:
```
"host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require"
```

---

This guide was created on March 22, 2025, and reflects the current database structure and connection parameters as of that date.
