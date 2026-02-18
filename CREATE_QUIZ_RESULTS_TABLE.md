# Create quiz_results Table in Supabase

## Quick Setup Instructions

You need to create the `quiz_results` table in your Supabase database. Follow these steps:

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration

Copy and paste the following SQL code into the SQL Editor and click **Run**:

```sql
-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    career_path TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own results
CREATE POLICY "Users can insert their own quiz results"
    ON quiz_results
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own results
CREATE POLICY "Users can view their own quiz results"
    ON quiz_results
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policy to allow users to update their own results
CREATE POLICY "Users can update their own quiz results"
    ON quiz_results
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own results
CREATE POLICY "Users can delete their own quiz results"
    ON quiz_results
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
```

### Step 3: Verify the Table Was Created

1. Go to **Table Editor** in the left sidebar
2. You should see `quiz_results` in the list of tables
3. Click on it to verify the columns are correct:
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `career_path` (Text)
   - `score` (Integer)
   - `total_questions` (Integer)
   - `answers` (JSONB)
   - `created_at` (Timestamp)

### Step 4: (Optional) Set Up Quiz Completion Counter

If you want the quiz completion counter to work automatically, also run this:

```sql
-- Add quiz completion counter to profiles table (if not already exists)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS quiz_completion_count INTEGER DEFAULT 0;

-- Create a function to update quiz completion count
CREATE OR REPLACE FUNCTION update_quiz_completion_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment the quiz completion count for the user
    UPDATE profiles 
    SET quiz_completion_count = quiz_completion_count + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update quiz completion count
DROP TRIGGER IF EXISTS trigger_update_quiz_completion_count ON quiz_results;
CREATE TRIGGER trigger_update_quiz_completion_count
    AFTER INSERT ON quiz_results
    FOR EACH ROW
    EXECUTE FUNCTION update_quiz_completion_count();
```

## What This Does

- **Creates the table**: Stores all quiz results with user ID, career path, scores, and answers
- **Sets up security**: RLS policies ensure users can only see/modify their own quiz results
- **Enables tracking**: The trigger automatically updates the quiz completion count in profiles

## Testing

After running the migration:

1. **Take a quiz** in your app
2. **Check the table**: Go to Table Editor → quiz_results → you should see your quiz result
3. **Check dashboard**: Your quiz should appear in the dashboard

## Troubleshooting

### If you get an error about "relation already exists":
- The table might already exist. You can skip the CREATE TABLE part or drop it first:
  ```sql
  DROP TABLE IF EXISTS quiz_results CASCADE;
  ```
  Then run the full migration again.

### If you get RLS policy errors:
- Make sure you're running this as a database admin
- Check that RLS is enabled on the table

### If quiz results still don't save:
- Check browser console for error messages
- Verify the `user_id` matches your auth user ID
- Make sure you're logged in when taking the quiz

## File Location

The migration file is located at:
`src/lib/supabase/migrations/20240320000000_create_quiz_results.sql`

You can also copy the SQL directly from that file if needed.
