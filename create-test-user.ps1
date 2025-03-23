# PowerShell script to create test users in Supabase

# Connection details
$SUPABASE_DB_HOST = "aws-0-eu-central-1.pooler.supabase.com"
$SUPABASE_DB_PORT = "5432"
$SUPABASE_DB_USER = "postgres.wnaxmgtrdhlousolblcr"
$SUPABASE_DB_NAME = "postgres"
$PSQL_PATH = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Check if PSQL is available
if (-not (Test-Path $PSQL_PATH)) {
    Write-Error "PSQL not found at $PSQL_PATH. Please update the path in this script."
    exit 1
}

# Function to execute SQL commands
function Execute-SQL {
    param (
        [string]$sql
    )
    
    # Create a temporary SQL file
    $tempFile = [System.IO.Path]::GetTempFileName() + ".sql"
    Set-Content -Path $tempFile -Value $sql
    
    # Build the PSQL command
    $connectionString = "host=$SUPABASE_DB_HOST port=$SUPABASE_DB_PORT user=$SUPABASE_DB_USER dbname=$SUPABASE_DB_NAME"
    $command = "& '$PSQL_PATH' '$connectionString' -f '$tempFile'"
    
    # Execute the command
    Write-Host "Executing SQL command..."
    Invoke-Expression $command
    
    # Clean up
    Remove-Item $tempFile
}

# First, apply the migration to create the functions
Write-Host "Creating test user functions..."
$migrationSql = Get-Content -Path ".\supabase\migrations\20250323_create_test_user_functions.sql" -Raw
Execute-SQL $migrationSql

# Create a test user with a unique timestamp-based email
$createUserSql = @"
SELECT public.create_specific_test_user();
"@

Write-Host "Creating test user..."
Execute-SQL $createUserSql

Write-Host "Done! You can now log in with the test user credentials shown above."
