# Simple script to query test users from Supabase
# This uses secure password handling

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
