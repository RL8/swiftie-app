# Script to interact with Supabase API directly

# Source the credentials script
. "$PSScriptRoot\setup-supabase-credentials.ps1"

# Get credentials
$credentials = Get-SupabaseCredentials
$projectRef = $credentials.ProjectRef

# Check if we have a service role key
if (-not $credentials.ServiceRoleKey) {
    Write-Host "No service role key found. Please run Set-SupabaseCredentials with the -ServiceRoleKey parameter." -ForegroundColor Red
    Write-Host "Example: Set-SupabaseCredentials -Password 'your-password' -ServiceRoleKey 'your-service-role-key'" -ForegroundColor Yellow
    exit
}

$apiKey = $credentials.ServiceRoleKey

# Function to get schema information
function Get-SupabaseSchema {
    param (
        [Parameter(Mandatory=$false)]
        [string]$Schema = "public"
    )
    
    $headers = @{
        "apikey" = $apiKey
        "Authorization" = "Bearer $apiKey"
    }
    
    $url = "https://$projectRef.supabase.co/rest/v1/"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        return $response
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        return $null
    }
}

# Function to query a table
function Get-SupabaseTable {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Table,
        
        [Parameter(Mandatory=$false)]
        [int]$Limit = 10
    )
    
    $headers = @{
        "apikey" = $apiKey
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
        "Prefer" = "return=representation"
    }
    
    $url = "https://$projectRef.supabase.co/rest/v1/$Table?select=*&limit=$Limit"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        return $response
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        return $null
    }
}

# Example usage
Write-Host "Getting profiles table data..." -ForegroundColor Cyan
$profiles = Get-SupabaseTable -Table "profiles"
$profiles | ConvertTo-Json -Depth 3
