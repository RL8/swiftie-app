BEGIN;
  -- Delete from profiles first (to maintain referential integrity)
  DELETE FROM public.profiles 
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email LIKE '%test%@gmail.com'
  );
  
  -- Then delete the users themselves
  DELETE FROM auth.users 
  WHERE email LIKE '%test%@gmail.com';
COMMIT;
