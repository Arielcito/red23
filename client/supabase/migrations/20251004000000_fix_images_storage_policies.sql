-- Configurar bucket images como público con límites apropiados
UPDATE storage.buckets
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'images';

-- Eliminar todas las políticas existentes para el bucket images
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Give anon users access to JPG images in folder 1ffg0oo_2" ON storage.objects;
DROP POLICY IF EXISTS "Give anon users access to JPG images in folder 1ffg0oo_1" ON storage.objects;
DROP POLICY IF EXISTS "Give anon users access to JPG images in folder 1ffg0oo_3" ON storage.objects;
DROP POLICY IF EXISTS "Give anon users access to JPG images in folder 1ffg0oo_0" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;

-- Crear políticas permisivas para el bucket images
CREATE POLICY "images_public_select"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'images' );

CREATE POLICY "images_public_insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "images_public_update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'images' )
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "images_public_delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'images' );
