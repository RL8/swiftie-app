# PowerShell script to list users in Supabase

# Database connection parameters
$dbHost = "aws-0-eu-central-1.pooler.supabase.com"
$port = "5432"
$user = "postgres.wnaxmgtrdhlousolblcr"
$database = "postgres"
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# SQL query to list users with their profiles
$query = @"
SELECT 
    au.id, 
    au.email, 
    au.created_at,
    au.email_confirmed_at,
    p.username
FROM 
    auth.users au
LEFT JOIN 
    public.profiles p ON au.id = p.id
ORDER BY 
    au.created_at DESC
LIMIT 20;
"@

# Execute the query
Write-Host "Connecting to Supabase database to list users..."
& "$psqlPath" -h $dbHost -p $port -U $user -d $database -c "$query"

# If you want to specifically list test users
$testUsersQuery = @"
SELECT 
    au.id, 
    au.email, 
    au.created_at,
    au.email_confirmed_at,
    p.username
FROM 
    auth.users au
LEFT JOIN 
    public.profiles p ON au.id = p.id
WHERE 
    au.email LIKE '%test%@gmail.com'
ORDER BY 
    au.created_at DESC;
"@

Write-Host "`n`nListing test users specifically:"
& "$psqlPath" -h $dbHost -p $port -U $user -d $database -c "$testUsersQuery"
