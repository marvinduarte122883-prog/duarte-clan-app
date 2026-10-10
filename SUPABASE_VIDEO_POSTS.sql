-- Run once in Supabase SQL Editor before allowing video posts.
-- Existing posts and data remain unchanged.
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS video_url text;
-- Video uploads reuse your existing family-gallery Storage bucket and its authenticated upload policies.
-- Set a bucket/file size limit and allowed MIME types appropriate to your Supabase plan.
