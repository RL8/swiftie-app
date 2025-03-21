# Script to store both Supabase password and API keys

# Source the credentials script
. "$PSScriptRoot\setup-supabase-credentials.ps1"

# Replace these with your actual values
$dbPassword = "Tuesday21!"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXhtZ3RyZGhsb3Vzb2xibGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTM3MzgsImV4cCI6MjAyMzA2OTczOH0.Nh83ebqzf1iGHTaFbHmyTZELQHcvHj5YiAgEjJ4YJtM"
$serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXhtZ3RyZGhsb3Vzb2xibGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzQ5MzczOCwiZXhwIjoyMDIzMDY5NzM4fQ.Bz_PZgvpyQZBCgBqvLdVgj2xvZ0FwNQfYpCQTXPPBSg"
$projectRef = "wnaxmgtrdhlousolblcr"

# Convert to secure strings
$securePassword = ConvertTo-SecureCredential -PlainText $dbPassword
$secureAnonKey = ConvertTo-SecureCredential -PlainText $anonKey
$secureServiceRoleKey = ConvertTo-SecureCredential -PlainText $serviceRoleKey

# Store the credentials
Set-SupabaseCredentials -SecurePassword $securePassword -ProjectRef $projectRef -SecureAnonKey $secureAnonKey -SecureServiceRoleKey $secureServiceRoleKey

Write-Host "`nCredentials stored successfully. You can now use the following scripts:" -ForegroundColor Green
Write-Host "- run-supabase.ps1: For running Supabase CLI commands" -ForegroundColor Cyan
Write-Host "- supabase-api.ps1: For interacting with the Supabase REST API" -ForegroundColor Cyan
