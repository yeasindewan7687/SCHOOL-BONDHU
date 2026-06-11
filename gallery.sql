-- SQL Code for Gallery Table (Run this in your Supabase SQL Editor)
CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on gallery_images" 
ON public.gallery_images FOR SELECT 
TO PUBLIC
USING (true);

-- Allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to modify gallery_images" 
ON public.gallery_images FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
