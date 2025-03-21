# Supabase commands with password included
# Replace 'your-password-here' with your actual database password
# WARNING: Be careful with this file as it contains your database password
# Do not commit this file to version control

# Function to run Supabase commands with password
function Run-SupabaseCommand {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Command,
        
        [Parameter(Mandatory=$true)]
        [string]$Password
    )
    
    # Run the command with password
    $commandToRun = "npx supabase $Command --password `"$Password`""
    Invoke-Expression $commandToRun
}

# Example usage:
# Run-SupabaseCommand -Command "db dump --schema public" -Password "your-password-here"
# Run-SupabaseCommand -Command "db dump --data-only --schema public" -Password "your-password-here"
