-- 🔥 UNIFIED DATABASE REPAIR SCRIPT (2026) 🔥
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

DO $$ 
BEGIN 
    -- 1. Fix student_marks table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_marks' AND column_name='session') THEN
        ALTER TABLE public.student_marks ADD COLUMN session TEXT DEFAULT '2026';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_marks' AND column_name='exam_term_id') THEN
        ALTER TABLE public.student_marks ADD COLUMN exam_term_id INTEGER;
    END IF;

    -- 2. Fix processed_results table (Missing columns from your error)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='is_passed') THEN
        ALTER TABLE public.processed_results ADD COLUMN is_passed BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='session') THEN
        ALTER TABLE public.processed_results ADD COLUMN session TEXT DEFAULT '2026';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='total_with_bonus') THEN
        ALTER TABLE public.processed_results ADD COLUMN total_with_bonus NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='failing_subjects') THEN
        ALTER TABLE public.processed_results ADD COLUMN failing_subjects TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='gpa_details') THEN
        ALTER TABLE public.processed_results ADD COLUMN gpa_details JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='tutorial_bonus') THEN
        ALTER TABLE public.processed_results ADD COLUMN tutorial_bonus NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processed_results' AND column_name='student_name') THEN
        ALTER TABLE public.processed_results ADD COLUMN student_name TEXT;
    END IF;

    -- 3. Fix students table (Parent Phones)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='fathers_phone') THEN
        ALTER TABLE public.students ADD COLUMN fathers_phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='mothers_phone') THEN
        ALTER TABLE public.students ADD COLUMN mothers_phone TEXT;
    END IF;

    -- 4. Update existing records
    UPDATE public.student_marks SET session = '2026' WHERE session IS NULL;
    UPDATE public.processed_results SET session = '2026' WHERE session IS NULL;
    UPDATE public.processed_results SET is_passed = true WHERE is_passed IS NULL;

END $$;

-- Force Supabase to refresh the schema cache
NOTIFY pgrst, 'reload schema';
