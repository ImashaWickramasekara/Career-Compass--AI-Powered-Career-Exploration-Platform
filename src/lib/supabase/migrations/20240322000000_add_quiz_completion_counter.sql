-- Add quiz completion counter to profiles table
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

-- Update existing users' quiz completion count based on their quiz results
UPDATE profiles 
SET quiz_completion_count = (
    SELECT COUNT(*) 
    FROM quiz_results 
    WHERE quiz_results.user_id = profiles.user_id
);
