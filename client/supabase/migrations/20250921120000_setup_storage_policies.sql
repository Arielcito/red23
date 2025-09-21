-- =============================================
-- SUPABASE STORAGE SETUP FOR IMAGES BUCKET
-- =============================================

-- Create the images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Enable RLS on the bucket
UPDATE storage.buckets
SET public = true
WHERE id = 'images';

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Policy 1: Allow everyone to view images (SELECT)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Policy 2: Allow anyone to upload images (INSERT) - Authentication handled by Clerk
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Policy 3: Allow anyone to update images (UPDATE) - Authentication handled by Clerk
CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' )
WITH CHECK ( bucket_id = 'images' );

-- Policy 4: Allow anyone to delete images (DELETE) - Authentication handled by Clerk
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- =============================================
-- ADDITIONAL CONFIGURATIONS (OPTIONAL)
-- =============================================

-- Set file size limit to 10MB
UPDATE storage.buckets
SET file_size_limit = 10485760  -- 10MB in bytes
WHERE id = 'images';

-- Set allowed MIME types
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'images';
