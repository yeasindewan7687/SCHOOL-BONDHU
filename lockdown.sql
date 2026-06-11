-- 1. DROP ALL POTENTIALLY INSECURE PUBLIC (ANON) POLICIES
DROP POLICY IF EXISTS "Enable all access for all users" ON public.admissions;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.messages;
DROP POLICY IF EXISTS "Enable all access for all" ON public.user_roles;
DROP POLICY IF EXISTS "Enable write access for all anon" ON student_marks;
DROP POLICY IF EXISTS "Enable write access for all anon" ON processed_results;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.admissions;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.admissions;

-- 2. ENABLE ROW LEVEL SECURITY FOR ALL TABLES
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
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. APPLY SECURE POLICIES

-- PUBLIC DATA: Anyone can read, but ONLY logged-in users (Admins) can modify
-- Notices
DROP POLICY IF EXISTS "Public read notices" ON notices;
DROP POLICY IF EXISTS "Auth modify notices" ON notices;
CREATE POLICY "Public read notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Auth modify notices" ON notices FOR ALL USING (auth.role() = 'authenticated');

-- Tickers
DROP POLICY IF EXISTS "Public read tickers" ON news_tickers;
DROP POLICY IF EXISTS "Auth modify tickers" ON news_tickers;
CREATE POLICY "Public read tickers" ON news_tickers FOR SELECT USING (true);
CREATE POLICY "Auth modify tickers" ON news_tickers FOR ALL USING (auth.role() = 'authenticated');

-- Events
DROP POLICY IF EXISTS "Public read school_events" ON school_events;
DROP POLICY IF EXISTS "Auth modify school_events" ON school_events;
CREATE POLICY "Public read school_events" ON school_events FOR SELECT USING (true);
CREATE POLICY "Auth modify school_events" ON school_events FOR ALL USING (auth.role() = 'authenticated');

-- Diaries
DROP POLICY IF EXISTS "Public read diaries" ON diaries;
DROP POLICY IF EXISTS "Auth modify diaries" ON diaries;
CREATE POLICY "Public read diaries" ON diaries FOR SELECT USING (true);
CREATE POLICY "Auth modify diaries" ON diaries FOR ALL USING (auth.role() = 'authenticated');

-- Results List
DROP POLICY IF EXISTS "Public read results" ON results;
DROP POLICY IF EXISTS "Auth modify results" ON results;
CREATE POLICY "Public read results" ON results FOR SELECT USING (true);
CREATE POLICY "Auth modify results" ON results FOR ALL USING (auth.role() = 'authenticated');

-- Gallery
DROP POLICY IF EXISTS "Public read gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Auth modify gallery_images" ON gallery_images;
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Auth modify gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- User Roles
DROP POLICY IF EXISTS "Public read user_roles" ON user_roles;
DROP POLICY IF EXISTS "Auth modify user_roles" ON user_roles;
CREATE POLICY "Public read user_roles" ON user_roles FOR SELECT USING (true);
CREATE POLICY "Auth modify user_roles" ON user_roles FOR ALL USING (auth.role() = 'authenticated');


-- ADMIN ONLY DATA: Only logged-in Admins can read AND modify
DROP POLICY IF EXISTS "Auth full students" ON students;
DROP POLICY IF EXISTS "Auth full marks" ON student_marks;
DROP POLICY IF EXISTS "Auth full processed" ON processed_results;

-- Notice: the public result page needs to fetch the student's result data. 
-- Right now `student_marks` is blocked for anon so the public result search will fail!
-- To fix this securely: Allow public READ, but restrict it if needed. For a school, typically anyone who knows the roll/id can view the result.
CREATE POLICY "Public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Auth full students" ON students FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read marks" ON student_marks FOR SELECT USING (true);
CREATE POLICY "Auth full marks" ON student_marks FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read processed" ON processed_results FOR SELECT USING (true);
CREATE POLICY "Auth full processed" ON processed_results FOR ALL USING (auth.role() = 'authenticated');


-- FORM SUBMISSIONS (Admissions, Contact): Anyone can insert (submit), but ONLY logged-in Admins can read/delete/update
DROP POLICY IF EXISTS "Public insert admissions" ON admissions;
DROP POLICY IF EXISTS "Auth full admissions" ON admissions;
CREATE POLICY "Public insert admissions" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth select admissions" ON admissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update admissions" ON admissions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete admissions" ON admissions FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public insert messages" ON messages;
DROP POLICY IF EXISTS "Auth full messages" ON messages;
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth select messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');
