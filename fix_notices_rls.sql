-- Run this SQL in your Supabase SQL Editor to fix the delete issue for all tables

-- Disable RLS for all used tables to allow the custom Admin panel to work freely
ALTER TABLE notices DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE diaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
ALTER TABLE news_tickers DISABLE ROW LEVEL SECURITY;
ALTER TABLE admissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- If you have previous policies, you can drop them (optional)
DROP POLICY IF EXISTS "Allow public read access on notices" ON notices;
DROP POLICY IF EXISTS "Allow authenticated users to insert on notices" ON notices;
DROP POLICY IF EXISTS "Allow authenticated users to update on notices" ON notices;
DROP POLICY IF EXISTS "Allow authenticated users to delete on notices" ON notices;
