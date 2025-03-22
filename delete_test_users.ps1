# Script to delete test users from Supabase database
# This will permanently delete test users with gmail.com email addresses

# Set the password from .env file or prompt for it
$envContent = Get-Content .\.env -ErrorAction SilentlyContinue
$dbPassword = $null

# Look for the SUPABASE_DB_PASSWORD line
foreach ($line in $envContent) {
    if ($line -match "^SUPABASE_DB_PASSWORD=(.+)$") {
        $dbPassword = $matches[1]
        break
    }
}

if (-not $dbPassword) {
    $securePassword = Read-Host "Enter your Supabase database password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $dbPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
}

$env:PGPASSWORD = $dbPassword

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
Write-Host ""
Write-Host "The SQL has been saved to delete_test_users.sql for your review."

# Clear the password from environment for security
$env:PGPASSWORD = ""
