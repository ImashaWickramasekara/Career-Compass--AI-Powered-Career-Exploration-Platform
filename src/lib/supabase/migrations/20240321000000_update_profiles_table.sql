-- Add new fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update the profiles table structure to match the new requirements
-- Note: The profiles table should already exist from Supabase Auth setup
-- This migration adds the additional fields we need for the enhanced registration form

-- Add RLS (Row Level Security) policies if not already present
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own profile
CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Create policy to allow users to view their own profile
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update their own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create policy to allow users to delete their own profile
CREATE POLICY IF NOT EXISTS "Users can delete their own profile"
    ON profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = id); 