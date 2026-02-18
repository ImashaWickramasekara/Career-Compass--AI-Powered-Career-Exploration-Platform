# Profile Table Structure Fix

## Problem
Your `profiles` table uses a different structure than the code expected:
- **Primary Key**: `id` (UUID, auto-generated)
- **Foreign Key**: `user_id` (references `auth.users.id`, unique constraint)
- The code was trying to use `id` as if it matched the user's auth ID, but it should use `user_id`

## What Was Fixed

### 1. Code Changes
- ✅ **AuthContext.tsx**: Changed to use `user_id` instead of `id` when creating/updating profiles
- ✅ **Profile.tsx**: Fixed all queries to use `user_id` instead of `id`
- ✅ **Dashboard.tsx**: Fixed profile query to use `user_id` instead of `id`

### 2. Database Migrations Needed

You need to run these SQL migrations in your Supabase dashboard:

#### Migration 1: Fix RLS Policies
**File**: `src/lib/supabase/migrations/20240325000003_fix_profiles_rls_policies.sql`

This fixes the Row Level Security policies to use `user_id` instead of `id`.

#### Migration 2: Fix Quiz Completion Counter
**File**: `src/lib/supabase/migrations/20240322000000_add_quiz_completion_counter.sql` (already updated)

This fixes the trigger function to use `user_id` instead of `id`.

## How to Apply

### Step 1: Run the RLS Policy Fix
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `src/lib/supabase/migrations/20240325000003_fix_profiles_rls_policies.sql`
4. Click **Run**

### Step 2: Fix the Quiz Completion Counter (if needed)
If you've already run the quiz completion counter migration, you may need to update the function:

```sql
-- Recreate the function with the correct field
CREATE OR REPLACE FUNCTION update_quiz_completion_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET quiz_completion_count = quiz_completion_count + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Step 3: Test Registration
1. Try registering a new user
2. Check the `profiles` table - the data should now be saved correctly
3. Verify the `user_id` column matches the user's auth ID

## Summary of Changes

| File | Change |
|------|--------|
| `AuthContext.tsx` | Use `user_id` instead of `id` for profile operations |
| `Profile.tsx` | All queries now use `user_id` |
| `Dashboard.tsx` | Profile query uses `user_id` |
| RLS Policies | Updated to check `auth.uid() = user_id` |
| Quiz Counter | Updated to use `user_id` |

## Important Notes

- The `id` field in profiles is a separate UUID (auto-generated primary key)
- The `user_id` field is the foreign key that links to `auth.users.id`
- All queries and policies must use `user_id`, not `id`
- The `user_id` has a unique constraint, so one profile per user

After running the migrations, registration should work correctly and save data to the profiles table!
