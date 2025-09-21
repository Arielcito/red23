-- =============================================
-- SIMPLE SUPABASE STORAGE POLICIES FIX
-- =============================================

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;

-- Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Create simple policies that allow all operations for the images bucket
-- Policy 1: Allow everyone to view images (SELECT)
CREATE POLICY "images_select_policy"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Policy 2: Allow everyone to upload images (INSERT) - SIMPLIFIED
CREATE POLICY "images_insert_policy"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Policy 3: Allow everyone to update images (UPDATE) - SIMPLIFIED
CREATE POLICY "images_update_policy"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' )
WITH CHECK ( bucket_id = 'images' );

-- Policy 4: Allow everyone to delete images (DELETE) - SIMPLIFIED
CREATE POLICY "images_delete_policy"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- Enable RLS on the storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Verify the bucket configuration
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'images';

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%images%';