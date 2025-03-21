# Script to help with local Supabase database commands

# Function to dump schema from local database
function Export-LocalSchema {
    param (
        [Parameter(Mandatory=$false)]
        [string]$Schema = "public",
        
        [Parameter(Mandatory=$false)]
        [string]$OutputFile = "$Schema-schema.sql"
    )
    
    Write-Host "Exporting schema '$Schema' to $OutputFile..." -ForegroundColor Cyan
    
    try {
        npx supabase db dump --schema $Schema --file $OutputFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Schema exported successfully to $OutputFile" -ForegroundColor Green
        } else {
            Write-Host "Failed to export schema." -ForegroundColor Red
        }
    } catch {
        Write-Host "Error exporting schema: $_" -ForegroundColor Red
    }
}

# Function to apply migrations to local database
function Start-MigrationProcess {
    Write-Host "Applying migrations to local database..." -ForegroundColor Cyan
    
    try {
        npx supabase migration up
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Migrations applied successfully." -ForegroundColor Green
        } else {
            Write-Host "Failed to apply migrations." -ForegroundColor Red
        }
    } catch {
        Write-Host "Error applying migrations: $_" -ForegroundColor Red
    }
}

# Function to reset the local database
function Reset-LocalDatabase {
    Write-Host "Resetting local database..." -ForegroundColor Cyan
    
    try {
        npx supabase db reset
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database reset successfully." -ForegroundColor Green
        } else {
            Write-Host "Failed to reset database." -ForegroundColor Red
        }
    } catch {
        Write-Host "Error resetting database: $_" -ForegroundColor Red
    }
}

# Function to execute SQL on local database
function Invoke-LocalSql {
    param (
        [Parameter(Mandatory=$true)]
        [string]$SqlFile
    )
    
    if (-not (Test-Path $SqlFile)) {
        Write-Host "SQL file not found: $SqlFile" -ForegroundColor Red
        return
    }
    
    Write-Host "Executing SQL from $SqlFile on local database..." -ForegroundColor Cyan
    
    try {
        npx supabase db execute --file $SqlFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SQL executed successfully." -ForegroundColor Green
        } else {
            Write-Host "Failed to execute SQL." -ForegroundColor Red
        }
    } catch {
        Write-Host "Error executing SQL: $_" -ForegroundColor Red
    }
}

# Display help if run directly
if ($MyInvocation.InvocationName -ne '.') {
    Write-Host "Local Supabase Database Commands" -ForegroundColor Cyan
    Write-Host "-------------------------------" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available functions:" -ForegroundColor Yellow
    Write-Host "  Export-LocalSchema [-Schema 'public'] [-OutputFile 'output.sql']" -ForegroundColor White
    Write-Host "  Start-MigrationProcess" -ForegroundColor White
    Write-Host "  Reset-LocalDatabase" -ForegroundColor White
    Write-Host "  Invoke-LocalSql -SqlFile 'path/to/file.sql'" -ForegroundColor White
    Write-Host ""
    Write-Host "Example usage:" -ForegroundColor Yellow
    Write-Host "  . .\local-db-commands.ps1" -ForegroundColor White
    Write-Host "  Export-LocalSchema -Schema 'public' -OutputFile 'schema.sql'" -ForegroundColor White
}
