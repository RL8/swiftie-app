# Script to start local Supabase development environment

Write-Host "Starting local Supabase development environment..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Docker is not installed or not running. Please install Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Docker is running. Starting Supabase..." -ForegroundColor Green

# Start Supabase
try {
    Write-Host "Starting Supabase local development environment..." -ForegroundColor Cyan
    npx supabase start
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Supabase local development environment started successfully!" -ForegroundColor Green
        Write-Host "You can now access the following services:" -ForegroundColor Cyan
        Write-Host "- Studio: http://localhost:54323" -ForegroundColor Yellow
        Write-Host "- API: http://localhost:54321" -ForegroundColor Yellow
        Write-Host "- Database: localhost:54322" -ForegroundColor Yellow
    } else {
        Write-Host "Failed to start Supabase local development environment." -ForegroundColor Red
    }
} catch {
    Write-Host "Error starting Supabase: $_" -ForegroundColor Red
}
