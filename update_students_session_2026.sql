-- Run this in your Supabase SQL Editor to update all Class Ten students to 2026 session
UPDATE public.students 
SET session = '2026' 
WHERE ("studentClass" = 'Ten' OR "studentClass" = 'class ten' OR "studentClass" = 'Class Ten')
AND (session = '2024' OR session IS NULL OR session = '');

-- Also ensure any existing marks or results are associated with the correct session if needed
-- UPDATE public.student_marks SET session = '2026' WHERE "studentClass" = 'Ten' AND session = '2024';
-- UPDATE public.processed_results SET session = '2026' WHERE "class_name" = 'Ten' AND session = '2024';
