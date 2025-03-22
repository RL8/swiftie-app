# Script to list current users in Supabase database
# This will show up to 20 most recent users with their profile information

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

Write-Host "Retrieving current users from Supabase database..."
Write-Host "This will show up to 20 most recent users with their profile information."
Write-Host "Results will be saved to $outputFile"

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
