-- Run this SQL in your Supabase SQL Editor to fix the delete issue

ALTER TABLE news_tickers DISABLE ROW LEVEL SECURITY;

-- If you have previous policies, you can drop them (optional)
DROP POLICY IF EXISTS "Allow public read access on news_tickers" ON news_tickers;
DROP POLICY IF EXISTS "Allow authenticated users to insert on news_tickers" ON news_tickers;
DROP POLICY IF EXISTS "Allow authenticated users to update on news_tickers" ON news_tickers;
DROP POLICY IF EXISTS "Allow authenticated users to delete on news_tickers" ON news_tickers;
