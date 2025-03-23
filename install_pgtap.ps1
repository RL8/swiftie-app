# install_pgtap.ps1
# Script to install pgTAP extension in Supabase database

# Try to load password from .env file first
$envContent = Get-Content -Path ".env" -ErrorAction SilentlyContinue
$dbPassword = ($envContent | Where-Object { $_ -match "SUPABASE_DB_PASSWORD=" }) -replace "SUPABASE_DB_PASSWORD=", ""

# If not found in .env, try other common variable names
if (-not $dbPassword) {
    $dbPassword = ($envContent | Where-Object { $_ -match "DB_PASSWORD=" }) -replace "DB_PASSWORD=", ""
}

if (-not $dbPassword) {
    $dbPassword = ($envContent | Where-Object { $_ -match "DATABASE_PASSWORD=" }) -replace "DATABASE_PASSWORD=", ""
}

# If still not found, prompt for password
if (-not $dbPassword) {
    Write-Host "Database password not found in .env file."
    $dbPassword = Read-Host "Please enter your Supabase database password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
    $dbPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
}

# Set the password as environment variable
$env:PGPASSWORD = $dbPassword

# Full path to PSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Connection string
$connectionString = "host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require"

# Install pgTAP extension
Write-Host "Installing pgTAP extension..."
& "$psqlPath" "$connectionString" -c "CREATE EXTENSION IF NOT EXISTS pgtap;"

# Verify installation
Write-Host "Verifying pgTAP installation..."
& "$psqlPath" "$connectionString" -c "SELECT * FROM pg_extension WHERE extname = 'pgtap';"

# Clear the password from environment for security
$env:PGPASSWORD = ""

Write-Host "Installation process completed."
