-- Remove the trigger that's causing user creation to fail
-- We'll rely on client-side profile creation instead

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
