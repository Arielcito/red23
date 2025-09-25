-- =============================================
-- FIX IMAGES BUCKET POLICIES - 2025-09-25
-- =============================================

-- Asegurar que el bucket images existe y está configurado correctamente
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  10485760, -- 10MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Habilitar RLS en storage.objects si no está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;
DROP POLICY IF EXISTS "images_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "images_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "images_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "images_delete_policy" ON storage.objects;

-- Crear políticas simples y permisivas para el bucket images
-- Política 1: Permitir a todos ver imágenes (SELECT)
CREATE POLICY "images_public_select"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Política 2: Permitir a todos subir imágenes (INSERT)
CREATE POLICY "images_public_insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Política 3: Permitir a todos actualizar imágenes (UPDATE)
CREATE POLICY "images_public_update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' )
WITH CHECK ( bucket_id = 'images' );

-- Política 4: Permitir a todos eliminar imágenes (DELETE)
CREATE POLICY "images_public_delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- Verificar que las políticas se aplicaron correctamente
DO $$
BEGIN
    RAISE NOTICE 'Políticas del bucket images configuradas correctamente';
    RAISE NOTICE 'Bucket configurado como público: %', (SELECT public FROM storage.buckets WHERE id = 'images');
END $$;
