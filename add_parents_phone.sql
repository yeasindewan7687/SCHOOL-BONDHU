
-- Run this in your Supabase SQL Editor to add parent phone number columns
DO $$ 
BEGIN 
    -- Add fathers_phone if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='fathers_phone') THEN
        ALTER TABLE public.students ADD COLUMN fathers_phone TEXT;
    END IF;
    
    -- Add mothers_phone if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='mothers_phone') THEN
        ALTER TABLE public.students ADD COLUMN mothers_phone TEXT;
    END IF;
END $$;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
