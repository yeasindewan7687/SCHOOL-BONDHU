-- 1. Fix the error from the previous script by adding the columns (if they don't exist)
ALTER TABLE student_marks ADD COLUMN IF NOT EXISTS mcq_marks NUMERIC;
ALTER TABLE student_marks ADD COLUMN IF NOT EXISTS cq_marks NUMERIC;
ALTER TABLE student_marks ADD COLUMN IF NOT EXISTS practical_marks NUMERIC;

-- Fix for the NOTIFY error: the message must be a string literal.
NOTIFY pgrst, 'reload schema';

-- 2. ENABLE RLS FOR ALL TABLES TO PREVENT HACKING
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 3. APPLY SECURE POLICIES

-- PUBLIC DATA: Anyone can read, but ONLY logged-in Admins can modify
-- Notices
CREATE POLICY "Public read notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Auth modify notices" ON notices FOR ALL USING (auth.role() = 'authenticated');

-- Tickers
CREATE POLICY "Public read tickers" ON news_tickers FOR SELECT USING (true);
CREATE POLICY "Auth modify tickers" ON news_tickers FOR ALL USING (auth.role() = 'authenticated');

-- Events
CREATE POLICY "Public read school_events" ON school_events FOR SELECT USING (true);
CREATE POLICY "Auth modify school_events" ON school_events FOR ALL USING (auth.role() = 'authenticated');

-- Diaries
CREATE POLICY "Public read diaries" ON diaries FOR SELECT USING (true);
CREATE POLICY "Auth modify diaries" ON diaries FOR ALL USING (auth.role() = 'authenticated');

-- Results List
CREATE POLICY "Public read results" ON results FOR SELECT USING (true);
CREATE POLICY "Auth modify results" ON results FOR ALL USING (auth.role() = 'authenticated');

-- Gallery
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Auth modify gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');


-- ADMIN ONLY DATA: Only logged-in Admins can read AND modify
CREATE POLICY "Auth full students" ON students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full marks" ON student_marks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full processed" ON processed_results FOR ALL USING (auth.role() = 'authenticated');


-- FORM SUBMISSIONS: Anyone can submit, but ONLY logged-in Admins can view/delete
CREATE POLICY "Public insert admissions" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth full admissions" ON admissions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth full messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
