# Demo script to show how to use the Supabase credentials manager

# Source the credentials script
. "$PSScriptRoot\setup-supabase-credentials.ps1"
. "$PSScriptRoot\supabase-api.ps1"

# Function to display section headers
function Write-SectionHeader {
    param (
        [string]$Title
    )
    
    Write-Host "`n$('=' * 50)" -ForegroundColor Cyan
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host "$('=' * 50)" -ForegroundColor Cyan
}

# Check if local Supabase is running
function Test-LocalSupabase {
    try {
        Invoke-RestMethod -Uri "http://localhost:54321/rest/v1/" -Method Get -ErrorAction SilentlyContinue | Out-Null
        return $true
    } catch {
        return $false
    }
}

# 1. Demonstrate storing credentials
Write-SectionHeader "1. Storing Supabase Credentials"

# Check if credentials are already stored
$hasCredentials = Test-SupabaseCredentials
if ($hasCredentials) {
    Write-Host "Supabase credentials are already stored." -ForegroundColor Green
} else {
    # For demo purposes, we'll use a placeholder password
    # In a real scenario, you would prompt for this securely
    Write-Host "Storing your Supabase credentials..." -ForegroundColor Yellow
    $securePassword = ConvertTo-SecureString "Tuesday21!" -AsPlainText -Force
    $secureAnonKey = ConvertTo-SecureString "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXhtZ3RyZGhsb3Vzb2xibGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTM3MzgsImV4cCI6MjAyMzA2OTczOH0.aCJgVmcgKPMM3v_Xac-2rJRQGQNB7O7CwxW3gEGCt50" -AsPlainText -Force
    $secureServiceRoleKey = ConvertTo-SecureString "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXhtZ3RyZGhsb3Vzb2xibGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzQ5MzczOCwiZXhwIjoyMDIzMDY5NzM4fQ.Bz_PZgvpyQZBCgBqvLdVgj2xvZ0FwNQfYpCQTXPPBSg" -AsPlainText -Force
    
    Set-SupabaseCredentials -SecurePassword $securePassword -ProjectRef "wnaxmgtrdhlousolblcr" -SecureAnonKey $secureAnonKey -SecureServiceRoleKey $secureServiceRoleKey
    Write-Host "Credentials stored successfully." -ForegroundColor Green
}

# 2. Demonstrate retrieving credentials
Write-SectionHeader "2. Retrieving Supabase Credentials"
$credentials = Get-SupabaseCredentials
if ($credentials) {
    Write-Host "Successfully retrieved Supabase credentials." -ForegroundColor Green
    Write-Host "Project Reference: $($credentials.ProjectRef)" -ForegroundColor Yellow
    # We don't show the password for security reasons
    Write-Host "Password: [REDACTED]" -ForegroundColor Yellow
    
    if ($credentials.AnonKey) {
        Write-Host "Anon Key: [REDACTED]" -ForegroundColor Yellow
    }
    
    if ($credentials.ServiceRoleKey) {
        Write-Host "Service Role Key: [REDACTED]" -ForegroundColor Yellow
    }
} else {
    Write-Host "Failed to retrieve Supabase credentials." -ForegroundColor Red
}

# 3. Demonstrate running a Supabase command
Write-SectionHeader "3. Running a Supabase Command"
Write-Host "Running 'supabase status' command..." -ForegroundColor Yellow
Invoke-SupabaseCommand -Command "status"

# 4. Demonstrate API access with anon key
Write-SectionHeader "4. API Access with Anon Key"

# Check if local Supabase is running
$isLocalRunning = Test-LocalSupabase
if ($isLocalRunning) {
    Write-Host "Local Supabase instance is running." -ForegroundColor Green
    
    # Get the anon key
    $anonKey = Get-SupabaseKey -KeyType "anon"
    if ($anonKey) {
        Write-Host "Successfully retrieved anon key." -ForegroundColor Green
        
        # Test API access with anon key
        $headers = @{
            "apikey" = $anonKey
            "Authorization" = "Bearer $anonKey"
            "Content-Type" = "application/json"
        }
        
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:54321/rest/v1/profiles?select=*&limit=10" -Headers $headers -Method Get -ErrorAction Stop
            Write-Host "Successfully accessed profiles table with anon key." -ForegroundColor Green
            Write-Host "Number of profiles: $($response.Count)" -ForegroundColor Yellow
            $response | Format-Table -AutoSize
        } catch {
            Write-Host "Error accessing profiles table with anon key: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Failed to retrieve anon key." -ForegroundColor Red
    }
} else {
    Write-Host "Local Supabase instance is not running. Start it with './start-local-supabase.ps1'" -ForegroundColor Red
}

# 5. Demonstrate API access with service role key
Write-SectionHeader "5. API Access with Service Role Key"

if ($isLocalRunning) {
    # Get the service role key
    $serviceRoleKey = Get-SupabaseKey -KeyType "service_role"
    if ($serviceRoleKey) {
        Write-Host "Successfully retrieved service role key." -ForegroundColor Green
        
        # Test API access with service role key
        $headers = @{
            "apikey" = $serviceRoleKey
            "Authorization" = "Bearer $serviceRoleKey"
            "Content-Type" = "application/json"
        }
        
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:54321/rest/v1/profiles?select=*&limit=10" -Headers $headers -Method Get -ErrorAction Stop
            Write-Host "Successfully accessed profiles table with service role key." -ForegroundColor Green
            Write-Host "Number of profiles: $($response.Count)" -ForegroundColor Yellow
            $response | Format-Table -AutoSize
        } catch {
            Write-Host "Error accessing profiles table with service role key: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Failed to retrieve service role key." -ForegroundColor Red
    }
}

# 6. Summary
Write-SectionHeader "6. Summary"
Write-Host "This demo has shown how to:" -ForegroundColor Green
Write-Host "1. Store and retrieve Supabase credentials" -ForegroundColor Yellow
Write-Host "2. Run Supabase CLI commands" -ForegroundColor Yellow
Write-Host "3. Access the Supabase API with both anon and service role keys" -ForegroundColor Yellow
Write-Host "`nYou can now use these scripts in your own projects!" -ForegroundColor Green
