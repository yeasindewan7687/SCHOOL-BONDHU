-- Run this in your Supabase SQL Editor to add the 'session' column to marks and results tables

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_marks' AND column_name='session') THEN
        ALTER TABLE public.student_marks ADD COLUMN session TEXT DEFAULT '2026';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='session') THEN
        ALTER TABLE public.processed_results ADD COLUMN session TEXT DEFAULT '2026';
    END IF;
    
    -- Also adding exam_term_id if it's missing (there was some code that referenced it)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_marks' AND column_name='exam_term_id') THEN
        ALTER TABLE public.student_marks ADD COLUMN exam_term_id INTEGER;
    END IF;
    
    -- Update existing records to '2026' if they have a NULL session
    UPDATE public.student_marks SET session = '2026' WHERE session IS NULL;
    UPDATE public.processed_results SET session = '2026' WHERE session IS NULL;
END $$;

NOTIFY pgrst, 'reload schema';
