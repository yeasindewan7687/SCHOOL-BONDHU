-- Run this in your Supabase SQL Editor to fix the missing column error
ALTER TABLE public.processed_results 
ADD COLUMN IF NOT EXISTS is_passed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS session TEXT,
ADD COLUMN IF NOT EXISTS total_with_bonus NUMERIC,
ADD COLUMN IF NOT EXISTS failing_subjects TEXT,
ADD COLUMN IF NOT EXISTS gpa_details JSONB;

-- Also update existing entries to have is_passed = true if null
UPDATE public.processed_results SET is_passed = true WHERE is_passed IS NULL;
