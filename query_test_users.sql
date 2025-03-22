SELECT 
    u.id,
    u.email,
    p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email LIKE '%test%@gmail.com'
LIMIT 5;
