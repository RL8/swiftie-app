# Simple script to test Supabase API access

# API credentials
$projectRef = "wnaxmgtrdhlousolblcr"
$serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXhtZ3RyZGhsb3Vzb2xibGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzQ5MzczOCwiZXhwIjoyMDIzMDY5NzM4fQ.Bz_PZgvpyQZBCgBqvLdVgj2xvZ0FwNQfYpCQTXPPBSg"

# Set up headers
$headers = @{
    "apikey" = $serviceRoleKey
    "Authorization" = "Bearer $serviceRoleKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

# Test API connection
Write-Host "Testing Supabase API connection..." -ForegroundColor Cyan
$url = "https://$projectRef.supabase.co/rest/v1/profiles?select=*&limit=10"

try {
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    Write-Host "Connection successful!" -ForegroundColor Green
    Write-Host "Retrieved $(($response | Measure-Object).Count) profiles." -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error connecting to Supabase API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Try to get more detailed error information
    try {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error details: $($errorDetails.message)" -ForegroundColor Red
        if ($errorDetails.hint) {
            Write-Host "Hint: $($errorDetails.hint)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Could not parse error details." -ForegroundColor Red
    }
}
