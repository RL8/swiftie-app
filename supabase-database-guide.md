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
- SSL Mode: `require`

### Securely Storing Database Credentials

We use Windows Credential Manager to securely store database credentials. This approach is more secure than storing passwords in plain text files and eliminates the need to enter passwords repeatedly.

#### Setting Up Credentials (One-Time Setup)

Run the `setup_db_credentials.ps1` script to securely store your database password:

```powershell
# setup_db_credentials.ps1
# Import the CredentialManager module
Import-Module CredentialManager

# Prompt for the database password securely
$username = "postgres.wnaxmgtrdhlousolblcr"
Write-Host "Setting up secure credentials for Supabase database"
Write-Host "Username: $username"
$password = Read-Host "Enter your Supabase database password" -AsSecureString

# Create a PSCredential object
$credential = New-Object System.Management.Automation.PSCredential($username, $password)

# Store the credential in Windows Credential Manager
New-StoredCredential -Credential $credential -Target "SupabaseDB" -Persist LocalMachine -Type Generic
```

#### Using Stored Credentials in Scripts

To use the stored credentials in your scripts:

```powershell
# Import the CredentialManager module
Import-Module CredentialManager

# Retrieve the stored credential
$storedCred = Get-StoredCredential -Target "SupabaseDB"
if ($storedCred) {
    # Get the password from the credential
    $dbPassword = $storedCred.GetNetworkCredential().Password
    # Set the password as environment variable
    $env:PGPASSWORD = $dbPassword
}

# Run your PostgreSQL command
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" "host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require" -c "YOUR SQL QUERY HERE"

# Clear the password from environment for security
$env:PGPASSWORD = ""
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
# Import the CredentialManager module
Import-Module CredentialManager

# Retrieve the stored credential
$storedCred = Get-StoredCredential -Target "SupabaseDB"
if ($storedCred) {
    # Get the password from the credential
    $env:PGPASSWORD = $storedCred.GetNetworkCredential().Password
}

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
# query_test_users.ps1
# Script to query test users from Supabase

# Import the CredentialManager module
Import-Module CredentialManager

# Retrieve the stored credential
$storedCred = Get-StoredCredential -Target "SupabaseDB"
if ($storedCred) {
    # Get the password from the credential
    $env:PGPASSWORD = $storedCred.GetNetworkCredential().Password
}

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

### Delete Test Users Script

```powershell
# delete_test_users.ps1
# Script to delete test users from Supabase database

# Import the CredentialManager module
Import-Module CredentialManager

# Retrieve the stored credential
$storedCred = Get-StoredCredential -Target "SupabaseDB"
if ($storedCred) {
    # Get the password from the credential
    $env:PGPASSWORD = $storedCred.GetNetworkCredential().Password
}

# Full path to PSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# SQL for deleting test users
$deleteUsersSQL = @"
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
$deleteUsersSQL | Out-File -FilePath "delete_test_users.sql" -Encoding utf8

# Run the deletion script
Write-Host "Deleting test users..." -ForegroundColor Yellow
& "$psqlPath" "host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require" -f delete_test_users.sql

# Clear the password from environment for security
$env:PGPASSWORD = ""

Write-Host "Test users deletion completed." -ForegroundColor Green
```

## 6. Running pgTAP Tests

The project includes pgTAP tests for validating database functionality. These tests can be run using the `run_pgtap_tests.ps1` script, which also uses the secure credential management approach.

```powershell
# Import the CredentialManager module
Import-Module CredentialManager

# Retrieve the stored credential
$storedCred = Get-StoredCredential -Target "SupabaseDB"
if ($storedCred) {
    # Get the password from the credential
    $dbPassword = $storedCred.GetNetworkCredential().Password
    # Set the password as environment variable
    $env:PGPASSWORD = $dbPassword
}

# Run pgTAP tests
& $psqlPath $connectionString -f $testFile.FullName -o $outputFile

# Clear the password from environment for security
$env:PGPASSWORD = ""
```

For more information on the pgTAP tests, see the README in the `tests/pgtap` directory.

## 7. Security Best Practices

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

## 8. Troubleshooting

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
