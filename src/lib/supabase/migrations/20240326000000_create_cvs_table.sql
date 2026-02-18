-- Create CVs/Resumes table for students
CREATE TABLE IF NOT EXISTS cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'My CV',
    template TEXT NOT NULL DEFAULT 'modern',
    
    -- Personal Information
    full_name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    summary TEXT,
    
    -- Education
    education JSONB DEFAULT '[]'::jsonb,
    
    -- Work Experience
    experience JSONB DEFAULT '[]'::jsonb,
    
    -- Skills
    skills JSONB DEFAULT '[]'::jsonb,
    
    -- Projects
    projects JSONB DEFAULT '[]'::jsonb,
    
    -- Certifications
    certifications JSONB DEFAULT '[]'::jsonb,
    
    -- Languages
    languages JSONB DEFAULT '[]'::jsonb,
    
    -- Additional Sections
    additional_sections JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own CVs
CREATE POLICY "Users can insert their own CVs"
    ON cvs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own CVs
CREATE POLICY "Users can view their own CVs"
    ON cvs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policy to allow users to update their own CVs
CREATE POLICY "Users can update their own CVs"
    ON cvs
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own CVs
CREATE POLICY "Users can delete their own CVs"
    ON cvs
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_default ON cvs(user_id, is_default) WHERE is_default = true;
