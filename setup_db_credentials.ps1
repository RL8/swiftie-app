# setup_db_credentials.ps1
# Script to securely store Supabase database credentials in Windows Credential Manager

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

Write-Host "Credentials stored successfully!" -ForegroundColor Green
Write-Host "Your database password is now securely stored in Windows Credential Manager."
Write-Host "Your scripts can access it without needing to include the password directly."
