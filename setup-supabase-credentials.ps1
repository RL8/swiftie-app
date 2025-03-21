# Script to securely store and retrieve Supabase credentials using Windows Credential Manager

# Function to store Supabase credentials
function Set-SupabaseCredentials {
    param (
        [Parameter(Mandatory=$true)]
        [System.Security.SecureString]$SecurePassword,
        
        [Parameter(Mandatory=$false)]
        [string]$ProjectRef = "wnaxmgtrdhlousolblcr",
        
        [Parameter(Mandatory=$false)]
        [System.Security.SecureString]$SecureAnonKey,
        
        [Parameter(Mandatory=$false)]
        [System.Security.SecureString]$SecureServiceRoleKey
    )
    
    try {
        # Create a credential object with username as the project ref and password
        $credential = New-Object System.Management.Automation.PSCredential ($ProjectRef, $SecurePassword)
        
        # Save the credential
        $credential | Export-Clixml -Path "$env:USERPROFILE\SupabaseCredentials.xml" -Force
        
        # Save the anon key if provided
        if ($SecureAnonKey) {
            $anonKeyCredential = New-Object System.Management.Automation.PSCredential ("$ProjectRef-anon", $SecureAnonKey)
            $anonKeyCredential | Export-Clixml -Path "$env:USERPROFILE\SupabaseAnonKey.xml" -Force
            Write-Host "Supabase anon key stored successfully!" -ForegroundColor Green
        }
        
        # Save the service role key if provided
        if ($SecureServiceRoleKey) {
            $serviceRoleKeyCredential = New-Object System.Management.Automation.PSCredential ("$ProjectRef-service-role", $SecureServiceRoleKey)
            $serviceRoleKeyCredential | Export-Clixml -Path "$env:USERPROFILE\SupabaseServiceRoleKey.xml" -Force
            Write-Host "Supabase service role key stored successfully!" -ForegroundColor Green
        }
        
        Write-Host "Supabase credentials stored successfully!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Error storing credentials: $_" -ForegroundColor Red
        return $false
    }
}

# Helper function to convert plain text to SecureString
function ConvertTo-SecureCredential {
    param (
        [Parameter(Mandatory=$true)]
        [string]$PlainText
    )
    
    $secureString = ConvertTo-SecureString $PlainText -AsPlainText -Force
    return $secureString
}

# Function to check if Supabase credentials are stored
function Test-SupabaseCredentials {
    # Check if credentials file exists
    if (Test-Path "$env:USERPROFILE\SupabaseCredentials.xml") {
        return $true
    } else {
        return $false
    }
}

# Function to retrieve a specific Supabase API key
function Get-SupabaseKey {
    param (
        [Parameter(Mandatory=$true)]
        [ValidateSet("anon", "service_role")]
        [string]$KeyType
    )
    
    $keyFile = if ($KeyType -eq "anon") { "$env:USERPROFILE\SupabaseAnonKey.xml" } else { "$env:USERPROFILE\SupabaseServiceRoleKey.xml" }
    
    # Check if key file exists
    if (Test-Path $keyFile) {
        try {
            # Import the key credential
            $keyCredential = Import-Clixml -Path $keyFile
            return $keyCredential.GetNetworkCredential().Password
        } catch {
            Write-Host "Error retrieving $KeyType key: $_" -ForegroundColor Red
            return $null
        }
    } else {
        Write-Host "No stored $KeyType key found. Please run Set-SupabaseCredentials with the appropriate key parameter first." -ForegroundColor Red
        return $null
    }
}

# Function to retrieve Supabase credentials
function Get-SupabaseCredentials {
    # Check if credentials file exists
    if (Test-Path "$env:USERPROFILE\SupabaseCredentials.xml") {
        try {
            # Import the credentials
            $credential = Import-Clixml -Path "$env:USERPROFILE\SupabaseCredentials.xml"
            $result = @{
                ProjectRef = $credential.UserName
                Password = $credential.GetNetworkCredential().Password
            }
            
            # Add anon key if available
            if (Test-Path "$env:USERPROFILE\SupabaseAnonKey.xml") {
                $anonKeyCredential = Import-Clixml -Path "$env:USERPROFILE\SupabaseAnonKey.xml"
                $result.AnonKey = $anonKeyCredential.GetNetworkCredential().Password
            }
            
            # Add service role key if available
            if (Test-Path "$env:USERPROFILE\SupabaseServiceRoleKey.xml") {
                $serviceRoleKeyCredential = Import-Clixml -Path "$env:USERPROFILE\SupabaseServiceRoleKey.xml"
                $result.ServiceRoleKey = $serviceRoleKeyCredential.GetNetworkCredential().Password
            }
            
            Write-Host "Credentials retrieved successfully." -ForegroundColor Green
            return $result
        } catch {
            Write-Host "Error retrieving credentials: $_" -ForegroundColor Red
            return $null
        }
    } else {
        Write-Host "No stored credentials found. Please run Set-SupabaseCredentials first." -ForegroundColor Red
        return $null
    }
}

# Function to run Supabase commands with stored password
function Invoke-SupabaseCommand {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Command
    )
    
    # Get the stored password
    Write-Host "Retrieving stored credentials..." -ForegroundColor Cyan
    $credentials = Get-SupabaseCredentials
    
    if ($credentials) {
        $projectRef = $credentials.ProjectRef
        $password = $credentials.Password
        
        Write-Host "Running Supabase command: $Command" -ForegroundColor Cyan
        
        # For database commands, we need to use the direct REST API
        if ($Command -like "db dump*") {
            # Parse the command to extract parameters
            $schemaMatch = $Command -match "--schema\s+(\w+)"
            $schema = if ($schemaMatch) { $matches[1] } else { $null }
            
            $dataOnly = $Command -like "*--data-only*"
            
            # Construct the direct command using pg_dump
            $pgDumpCommand = "docker run --rm postgres:15 pg_dump -h db.$projectRef.supabase.co -U postgres -d postgres"
            
            if ($schema) {
                $pgDumpCommand += " -n $schema"
            }
            
            if ($dataOnly) {
                $pgDumpCommand += " --data-only"
            }
            
            # Set the PGPASSWORD environment variable
            $escapedPassword = $password -replace "'", "''"
            $pgDumpCommand = "Set-Item -Path Env:PGPASSWORD -Value '$escapedPassword'; $pgDumpCommand; Remove-Item -Path Env:PGPASSWORD"
            
            try {
                Write-Host "Executing pg_dump command..." -ForegroundColor Cyan
                Invoke-Expression $pgDumpCommand
                Write-Host "Command completed successfully." -ForegroundColor Green
            } catch {
                Write-Host "Error executing command: $_" -ForegroundColor Red
            }
        } else {
            # For other commands, use the standard CLI
            $commandToRun = "npx supabase $Command --password `"$password`""
            
            try {
                Write-Host "Executing command..." -ForegroundColor Cyan
                Invoke-Expression $commandToRun
                Write-Host "Command completed successfully." -ForegroundColor Green
            } catch {
                Write-Host "Error executing command: $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Cannot run command without credentials." -ForegroundColor Red
    }
}

# If the script is being run directly (not sourced)
if ($MyInvocation.InvocationName -ne '.') {
    # Display help information
    Write-Host "Supabase Credentials Manager" -ForegroundColor Cyan
    Write-Host "-------------------------" -ForegroundColor Cyan
    Write-Host "This script helps you manage your Supabase credentials." -ForegroundColor White
    Write-Host ""
    Write-Host "Available functions:" -ForegroundColor Yellow
    Write-Host "  Set-SupabaseCredentials -SecurePassword (ConvertTo-SecureCredential 'your-password') [-ProjectRef 'your-project-ref'] [-SecureAnonKey (ConvertTo-SecureCredential 'your-anon-key')] [-SecureServiceRoleKey (ConvertTo-SecureCredential 'your-service-role-key')]" -ForegroundColor White
    Write-Host "  ConvertTo-SecureCredential -PlainText 'your-plain-text'" -ForegroundColor White
    Write-Host "  Test-SupabaseCredentials" -ForegroundColor White
    Write-Host "  Get-SupabaseKey -KeyType 'anon|service_role'" -ForegroundColor White
    Write-Host "  Get-SupabaseCredentials" -ForegroundColor White
    Write-Host "  Invoke-SupabaseCommand -Command 'db dump --schema public'" -ForegroundColor White
}
