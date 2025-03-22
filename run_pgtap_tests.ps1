#!/usr/bin/env pwsh
# run_pgtap_tests.ps1
# Script to run pgTAP tests for the Swiftie App

# Import the CredentialManager module
Import-Module CredentialManager

# Retrieve the stored credential
$storedCred = Get-StoredCredential -Target "SupabaseDB"
if ($storedCred) {
    # Get the password from the credential
    $dbPassword = $storedCred.GetNetworkCredential().Password
    # Set the password as environment variable
    $env:PGPASSWORD = $dbPassword
    Write-Host "Retrieved database credentials from Windows Credential Manager" -ForegroundColor Green
} else {
    Write-Host "No stored credentials found. Please run setup_db_credentials.ps1 first." -ForegroundColor Red
    exit
}

# Full path to PSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Connection string
$connectionString = "host=aws-0-eu-central-1.pooler.supabase.com port=5432 dbname=postgres user=postgres.wnaxmgtrdhlousolblcr sslmode=require"

# Create tests directory if it doesn't exist
if (-not (Test-Path -Path ".\tests\pgtap")) {
    New-Item -Path ".\tests\pgtap" -ItemType Directory -Force
}

# Create results directory
$resultsDir = ".\tests\results"
if (-not (Test-Path -Path $resultsDir)) {
    New-Item -Path $resultsDir -ItemType Directory -Force
}

# Run all pgTAP tests
Write-Host "Running pgTAP tests..." -ForegroundColor Cyan
Write-Host "------------------------" -ForegroundColor Cyan

# Get all test files
$testFiles = Get-ChildItem -Path ".\tests\pgtap" -Filter "*.sql"

# Track overall success
$allTestsPassed = $true

foreach ($testFile in $testFiles) {
    Write-Host "`nRunning test: $($testFile.Name)" -ForegroundColor Yellow
    Write-Host "------------------------" -ForegroundColor Yellow
    
    # Output file for test results
    $outputFile = Join-Path -Path $resultsDir -ChildPath "$($testFile.BaseName)_results.txt"
    
    # Run the test
    & $psqlPath $connectionString -f $testFile.FullName -o $outputFile
    
    # Check if the test passed (look for "failed" in the output)
    $testOutput = Get-Content -Path $outputFile -Raw
    if ($testOutput -match "failed" -or $testOutput -match "Looks like you failed") {
        Write-Host "`n Test failed: $($testFile.Name)" -ForegroundColor Red
        $allTestsPassed = $false
    } else {
        Write-Host "`n Test passed: $($testFile.Name)" -ForegroundColor Green
    }
}

# Clear the password from environment for security
$env:PGPASSWORD = ""

Write-Host "`n------------------------" -ForegroundColor Cyan
if ($allTestsPassed) {
    Write-Host " All tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host " Some tests failed. Check the results directory for details." -ForegroundColor Red
}
Write-Host "Test results saved to: $resultsDir" -ForegroundColor Cyan
