# Simple wrapper script for Supabase commands

param (
    [Parameter(Position=0, Mandatory=$true)]
    [string]$Command
)

# Import the credentials module
. "$PSScriptRoot\setup-supabase-credentials.ps1"

# Run the command
Invoke-SupabaseCommand -Command $Command
