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