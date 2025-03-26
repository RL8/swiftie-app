# Script to run the premium users migration
# This script connects to the Supabase database and runs the migration script

# Load environment variables
$env:PGPASSWORD = $env:SUPABASE_DB_PASSWORD

# Database connection parameters
$pgHost = "aws-0-eu-central-1.pooler.supabase.com"
$pgPort = "5432"
$pgUser = "postgres.wnaxmgtrdhlousolblcr"
$pgDatabase = "postgres"
$pgPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Path to the migration script
$migrationScript = "migrate_premium_users.sql"

# Check if the migration script exists
if (-not (Test-Path $migrationScript)) {
    Write-Error "Migration script not found: $migrationScript"
    exit 1
}

# Run the migration script
Write-Host "Running premium users migration..."
& $pgPath -h $pgHost -p $pgPort -U $pgUser -d $pgDatabase -f $migrationScript

# Check if the migration was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Migration failed with exit code: $LASTEXITCODE" -ForegroundColor Red
}
