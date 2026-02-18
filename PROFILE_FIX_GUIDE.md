# Profile Creation Fix Guide

## Root Cause

The registration data wasn't being saved to the Supabase `profiles` table due to **Row Level Security (RLS) policies**. Here's what was happening:

1. **RLS Policy Issue**: The RLS policy requires users to be `authenticated` to insert into the `profiles` table
2. **Timing Problem**: When `supabase.auth.signUp()` is called, the user account is created, but:
   - If email confirmation is required, the user isn't fully authenticated yet
   - Even without email confirmation, there can be a timing issue where the session isn't established immediately
3. **Client-Side Insert Failure**: The code tried to insert the profile immediately after signup, but RLS blocked it because `auth.uid()` wasn't available yet

## Solution

We've implemented a **two-part solution**:

### 1. Database Trigger (Primary Solution)
Created a database trigger that automatically creates a profile when a new user signs up. This runs **server-side** with elevated privileges (`SECURITY DEFINER`), so it bypasses RLS policies.

**File**: `src/lib/supabase/migrations/20240325000000_create_profile_trigger.sql`

### 2. Client-Side Update (Backup Solution)
Updated the `AuthContext.tsx` to:
- Store profile data in user metadata during signup (accessible to the trigger)
- Attempt to upsert the profile after signup (as a backup)
- Include better error logging for debugging

## How to Apply the Fix

### Step 1: Run the Database Migration

You need to execute the SQL migration in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `src/lib/supabase/migrations/20240325000000_create_profile_trigger.sql`
4. Click **Run** to execute the migration

**OR** if you're using Supabase CLI:

```bash
supabase db push
```

### Step 2: Verify the Trigger

After running the migration, verify the trigger was created:

1. In Supabase dashboard, go to **Database** → **Triggers**
2. You should see `on_auth_user_created` trigger on the `auth.users` table

### Step 3: Test Registration

1. Try registering a new user through your registration form
2. Check the `profiles` table in Supabase to verify the profile was created
3. Check the browser console for any error messages

## Troubleshooting

### If you CAN'T CREATE NEW USERS (signup is failing):

**This is likely caused by the trigger failing.** Follow these steps:

1. **Temporarily disable the trigger** to test if it's the cause:
   ```sql
   ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
   ```
   Then try creating a user. If it works, the trigger is the issue.

2. **Check for trigger errors** in Supabase logs:
   - Go to **Logs** → **Postgres Logs** in Supabase dashboard
   - Look for errors related to `handle_new_user` function

3. **Check if the profiles table structure is correct**:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'profiles' AND table_schema = 'public';
   ```
   Make sure these columns exist: `id`, `email`, `full_name`, `phone_number`, `location`, `bio`, `created_at`, `updated_at`

4. **If the trigger is causing issues, you can remove it**:
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DROP FUNCTION IF EXISTS public.handle_new_user();
   ```
   The client-side code will still create profiles (it will just take a moment after signup).

5. **Re-enable the trigger** after fixing issues:
   ```sql
   ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
   ```

### If profiles still aren't being created (but users can be created):

1. **Check if the trigger exists**:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Check if the function exists**:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. **Check RLS policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

4. **Check browser console** for error messages - the updated code now logs detailed errors

5. **Check if the user has a session** - profiles are created when the user is authenticated

### If you see RLS errors:

The trigger should bypass RLS, but if you still see issues:
- Make sure the trigger function has `SECURITY DEFINER`
- Verify the trigger is on `auth.users` table, not `public.profiles`

## Additional Notes

- The trigger reads profile data from `raw_user_meta_data` in the auth.users table
- The client-side code also attempts to upsert the profile as a backup
- If email confirmation is required, the profile will be created when the user confirms their email (when the trigger fires)
- Existing users without profiles can still create them through the Profile page (fallback mechanism)

## Files Changed

1. `src/lib/supabase/migrations/20240325000000_create_profile_trigger.sql` - New migration file
2. `src/contexts/AuthContext.tsx` - Updated signUp function with better error handling
