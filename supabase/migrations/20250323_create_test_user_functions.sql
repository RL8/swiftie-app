-- Function to create test users with pre-verified email
CREATE OR REPLACE FUNCTION public.create_test_user(
    email text,
    password text,
    username text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  user_id uuid;
  encrypted_pw text;
  generated_username text;
BEGIN
  -- Generate a user ID
  user_id := gen_random_uuid();
  
  -- Encrypt the password
  encrypted_pw := crypt(password, gen_salt('bf'));
  
  -- Generate a username if not provided
  IF username IS NULL THEN
    generated_username := 'test_user_' || substr(md5(random()::text), 0, 8);
  ELSE
    generated_username := username;
  END IF;
  
  -- Insert the user into auth.users with pre-verified email
  INSERT INTO auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
     invited_at, confirmation_token, confirmation_sent_at, recovery_token, 
     recovery_sent_at, email_change_token_new, email_change, email_change_sent_at,
     last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin,
     created_at, updated_at, phone, phone_confirmed_at)
  VALUES
    ('00000000-0000-0000-0000-000000000000', -- instance_id
     user_id, -- id
     'authenticated', -- aud
     'authenticated', -- role
     email, -- email
     encrypted_pw, -- encrypted_password
     now(), -- email_confirmed_at (pre-verified)
     NULL, -- invited_at
     '', -- confirmation_token
     NULL, -- confirmation_sent_at
     '', -- recovery_token
     NULL, -- recovery_sent_at
     '', -- email_change_token_new
     '', -- email_change
     NULL, -- email_change_sent_at
     now(), -- last_sign_in_at
     '{"provider": "email"}', -- raw_app_meta_data
     '{}', -- raw_user_meta_data
     FALSE, -- is_super_admin
     now(), -- created_at
     now(), -- updated_at
     NULL, -- phone
     NULL  -- phone_confirmed_at
    );
     
  -- Create a profile for the user
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (user_id, generated_username, now());
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete test users
CREATE OR REPLACE FUNCTION public.delete_test_users() RETURNS void AS $$
BEGIN
  -- Delete profiles first due to foreign key constraints
  DELETE FROM public.profiles 
  WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%test%@gmail.com');
  
  -- Then delete the users
  DELETE FROM auth.users WHERE email LIKE '%test%@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a specific test user
CREATE OR REPLACE FUNCTION public.create_specific_test_user(
    email_prefix text DEFAULT 'test',
    domain text DEFAULT 'gmail.com',
    password text DEFAULT 'password123'
) RETURNS uuid AS $$
DECLARE
  timestamp_suffix text;
  full_email text;
  user_id uuid;
BEGIN
  -- Generate a timestamp-based suffix to ensure unique emails
  timestamp_suffix := to_char(now(), 'YYYYMMDD_HH24MISS');
  
  -- Create the full email
  full_email := email_prefix || '_' || timestamp_suffix || '@' || domain;
  
  -- Create the test user
  user_id := public.create_test_user(full_email, password);
  
  -- Output the created user info to the console
  RAISE NOTICE 'Created test user: % with password: %', full_email, password;
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION public.create_test_user(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_test_users() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_specific_test_user(text, text, text) TO service_role;
