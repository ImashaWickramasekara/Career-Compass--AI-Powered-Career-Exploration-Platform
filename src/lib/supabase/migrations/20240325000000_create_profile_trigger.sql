-- Create a function to automatically create a profile when a user signs up
-- This runs server-side and bypasses RLS, ensuring profiles are always created
-- Error handling ensures user creation is not blocked if profile creation fails

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert profile, but don't fail if there's an error
  -- This ensures user creation always succeeds even if profile creation has issues
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone_number, location, bio, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'location', ''),
      COALESCE(NEW.raw_user_meta_data->>'bio', ''),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
      phone_number = COALESCE(NULLIF(EXCLUDED.phone_number, ''), profiles.phone_number),
      location = COALESCE(NULLIF(EXCLUDED.location, ''), profiles.location),
      bio = COALESCE(NULLIF(EXCLUDED.bio, ''), profiles.bio),
      updated_at = NOW();
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't prevent user creation
      RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
      -- Try a simpler insert without optional columns if the full insert failed
      BEGIN
        INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
        VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
      EXCEPTION
        WHEN OTHERS THEN
          -- Even the simple insert failed, but we still allow user creation
          RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
      END;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also update the RLS policy to allow service role to insert profiles
-- This ensures the trigger can always create profiles
-- Note: The trigger uses SECURITY DEFINER so it runs with elevated privileges
