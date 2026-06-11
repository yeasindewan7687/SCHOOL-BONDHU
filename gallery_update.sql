ALTER TABLE public.gallery_images
ADD COLUMN IF NOT EXISTS event_date TEXT;
