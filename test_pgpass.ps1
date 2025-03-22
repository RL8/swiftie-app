# test_pgpass.ps1
# Diagnostic script to troubleshoot PostgreSQL pgpass issues

# Function to write colored output
function Write-ColorOutput {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [string]$ForegroundColor = "White"
    )
    
    Write-Host $Message -ForegroundColor $ForegroundColor
}

Write-ColorOutput "PostgreSQL pgpass Diagnostic Tool" "Cyan"
Write-ColorOutput "=================================" "Cyan"

# Step 1: Check if PostgreSQL is installed and accessible
Write-ColorOutput "`nStep 1: Checking PostgreSQL installation..." "Yellow"
try {
    $psqlVersion = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" --version
    Write-ColorOutput "PostgreSQL found: $psqlVersion" "Green"
} catch {
    Write-ColorOutput "ERROR: Could not find PostgreSQL installation. Please check your PATH." "Red"
    Write-ColorOutput "Error details: $_" "Red"
    exit
}

# Step 2: Check if pgpass file exists in the correct location
Write-ColorOutput "`nStep 2: Checking pgpass file..." "Yellow"
$pgpassPath = "$env:APPDATA\postgresql\pgpass.conf"
$pgpassDir = "$env:APPDATA\postgresql"

if (-not (Test-Path -Path $pgpassDir)) {
    Write-ColorOutput "Creating postgresql directory at $pgpassDir" "Yellow"
    New-Item -Path $pgpassDir -ItemType Directory -Force | Out-Null
}

if (Test-Path -Path $pgpassPath) {
    Write-ColorOutput "pgpass file found at: $pgpassPath" "Green"
    
    # Check file permissions
    $acl = Get-Acl -Path $pgpassPath
    Write-ColorOutput "File permissions: $($acl.AccessToString)" "White"
    
    # Check file content format
    $content = Get-Content -Path $pgpassPath -Raw
    Write-ColorOutput "File content:" "White"
    Write-ColorOutput $content "Gray"
    
    # Check for common format issues
    if ($content -match " ") {
        Write-ColorOutput "WARNING: pgpass file contains spaces, which may cause issues" "Yellow"
    }
    
    $lineCount = ($content | Measure-Object -Line).Lines
    Write-ColorOutput "Number of lines: $lineCount" "White"
    
    if ($lineCount -gt 0) {
        $firstLine = ($content -split "`n")[0].Trim()
        $colonCount = ($firstLine.ToCharArray() | Where-Object { $_ -eq ':' } | Measure-Object).Count
        
        if ($colonCount -ne 4) {
            Write-ColorOutput "ERROR: First line doesn't have exactly 4 colons (5 fields)" "Red"
            Write-ColorOutput "Format should be: hostname:port:database:username:password" "Red"
        } else {
            Write-ColorOutput "Line format appears correct (has 4 colons)" "Green"
        }
    }
} else {
    Write-ColorOutput "pgpass file NOT found at: $pgpassPath" "Yellow"
    Write-ColorOutput "Creating a sample pgpass file..." "Yellow"
    
    # Create the directory if it doesn't exist
    if (-not (Test-Path -Path $pgpassDir)) {
        New-Item -Path $pgpassDir -ItemType Directory -Force | Out-Null
    }
    
    # Create a sample pgpass file
    $pgpassContent = "aws-0-eu-central-1.pooler.supabase.com:5432:postgres:postgres.wnaxmgtrdhlousolblcr:YOUR_PASSWORD_HERE"
    $pgpassContent | Out-File -FilePath $pgpassPath -Encoding utf8 -NoNewline
    
    Write-ColorOutput "Sample pgpass file created at: $pgpassPath" "Green"
    Write-ColorOutput "IMPORTANT: Edit this file and replace YOUR_PASSWORD_HERE with your actual password" "Yellow"
    Write-ColorOutput "Then run this script again to test the connection" "Yellow"
    exit
}

# Step 3: Test connection using psql without password
Write-ColorOutput "`nStep 3: Testing connection using pgpass file..." "Yellow"
Write-ColorOutput "Attempting to connect to Supabase without providing password..." "White"

# Clear any existing PGPASSWORD environment variable
if ($env:PGPASSWORD) {
    $oldPgPassword = $env:PGPASSWORD
    $env:PGPASSWORD = ""
    Write-ColorOutput "Cleared existing PGPASSWORD environment variable" "Yellow"
}

# Set PGPASSFILE explicitly to our pgpass file
$env:PGPASSFILE = $pgpassPath
Write-ColorOutput "Set PGPASSFILE to: $pgpassPath" "White"

# Test connection with a simple query
try {
    $output = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h "aws-0-eu-central-1.pooler.supabase.com" -p 5432 -d "postgres" -U "postgres.wnaxmgtrdhlousolblcr" -c "SELECT 'pgpass_test_successful' AS result;" -t
    
    if ($output -match "pgpass_test_successful") {
        Write-ColorOutput "`nSUCCESS! Connection using pgpass file worked!" "Green"
        Write-ColorOutput "Your pgpass file is correctly configured." "Green"
    } else {
        Write-ColorOutput "`nWARNING: Connection completed but returned unexpected output" "Yellow"
        Write-ColorOutput "Output: $output" "Gray"
    }
} catch {
    Write-ColorOutput "`nERROR: Connection using pgpass file failed" "Red"
    Write-ColorOutput "Error details: $_" "Red"
    
    # Additional diagnostic information
    Write-ColorOutput "`nAdditional troubleshooting:" "Yellow"
    Write-ColorOutput "1. Check if your password contains special characters that need escaping" "White"
    Write-ColorOutput "2. Verify that your hostname exactly matches what's in the pgpass file" "White"
    Write-ColorOutput "3. Try using PGPASSWORD environment variable as a test:" "White"
    Write-ColorOutput "   $env:PGPASSWORD = 'your_password'; psql -h ... -U ..." "White"
}

# Restore original PGPASSWORD if it existed
if ($oldPgPassword) {
    $env:PGPASSWORD = $oldPgPassword
    Write-ColorOutput "`nRestored original PGPASSWORD environment variable" "Yellow"
}

# Step 4: Test with explicit password to verify connection details
Write-ColorOutput "`nStep 4: Testing connection with manual password..." "Yellow"
Write-ColorOutput "This will prompt for your password to verify the connection details are correct" "White"
Write-ColorOutput "If this works but the pgpass method doesn't, we know the issue is with the pgpass configuration" "White"

try {
    Write-Host "Enter your Supabase password to test direct connection: " -NoNewline -ForegroundColor Yellow
    $testPassword = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($testPassword)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    
    $env:PGPASSWORD = $plainPassword
    
    $output = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h "aws-0-eu-central-1.pooler.supabase.com" -p 5432 -d "postgres" -U "postgres.wnaxmgtrdhlousolblcr" -c "SELECT 'direct_connection_test_successful' AS result;" -t
    
    if ($output -match "direct_connection_test_successful") {
        Write-ColorOutput "`nDirect connection test successful!" "Green"
        Write-ColorOutput "This confirms your connection details are correct." "Green"
        Write-ColorOutput "If the pgpass method failed but this worked, the issue is with your pgpass configuration." "Yellow"
    } else {
        Write-ColorOutput "`nWARNING: Direct connection completed but returned unexpected output" "Yellow"
        Write-ColorOutput "Output: $output" "Gray"
    }
    
    # Clear password from environment
    $env:PGPASSWORD = ""
} catch {
    Write-ColorOutput "`nERROR: Direct connection test failed" "Red"
    Write-ColorOutput "Error details: $_" "Red"
    
    # Clear password from environment
    $env:PGPASSWORD = ""
}

# Step 5: Summary and recommendations
Write-ColorOutput "`nDiagnostic Summary:" "Cyan"
Write-ColorOutput "===================" "Cyan"
Write-ColorOutput "1. PostgreSQL installation: Checked" "White"
Write-ColorOutput "2. pgpass file location and format: Checked" "White"
Write-ColorOutput "3. Connection using pgpass: Tested" "White"
Write-ColorOutput "4. Direct connection: Tested" "White"

Write-ColorOutput "`nNext Steps:" "Yellow"
Write-ColorOutput "If you're still having issues, try the following:" "White"
Write-ColorOutput "1. Ensure your pgpass file has exactly the format: hostname:port:database:username:password" "White"
Write-ColorOutput "2. Check for any special characters in your password that might need escaping" "White"
Write-ColorOutput "3. Verify the file doesn't have a hidden .txt extension (Windows sometimes adds this)" "White"
Write-ColorOutput "4. Try using the PGSERVICE approach as an alternative" "White"

Write-ColorOutput "`nFor more information, see: https://www.postgresql.org/docs/current/libpq-pgpass.html" "Cyan"
