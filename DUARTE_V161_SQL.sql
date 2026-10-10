-- Run once in Supabase SQL Editor before publishing V161. Preserves existing rows.
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS photo_layout text NOT NULL DEFAULT 'classic';
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_photo_layout_check;
ALTER TABLE public.posts ADD CONSTRAINT posts_photo_layout_check CHECK (photo_layout IN ('classic','columns','frame'));
