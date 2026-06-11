-- Run this in your Supabase SQL Editor to fix the students table schema
-- This adds missing columns and ensures consistency with the application code.

DO $$ 
BEGIN 
    -- Add phone if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='phone') THEN
        ALTER TABLE public.students ADD COLUMN phone TEXT;
    END IF;
    
    -- Add address if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='address') THEN
        ALTER TABLE public.students ADD COLUMN address TEXT;
    END IF;

    -- Add gender if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='gender') THEN
        ALTER TABLE public.students ADD COLUMN gender TEXT;
    END IF;

    -- Add blood_group if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='blood_group') THEN
        ALTER TABLE public.students ADD COLUMN blood_group TEXT;
    END IF;

    -- Add session if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='session') THEN
        ALTER TABLE public.students ADD COLUMN session TEXT;
    END IF;

    -- Add password if missing and set default
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='password') THEN
        ALTER TABLE public.students ADD COLUMN password TEXT DEFAULT '123456';
    END IF;
END $$;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
