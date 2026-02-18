-- Optional: Disable the trigger if it's causing issues
-- Run this if user creation is failing and you suspect the trigger

-- Disable the trigger temporarily
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- To re-enable it later, run:
-- ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- To completely remove the trigger and function:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
