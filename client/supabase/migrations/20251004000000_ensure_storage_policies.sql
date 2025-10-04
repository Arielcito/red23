-- =============================================
-- ENSURE STORAGE POLICIES ARE CORRECTLY APPLIED
-- Date: 2025-10-04
-- =============================================

-- Verificar y crear el bucket images si no existe
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

-- Habilitar RLS en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Eliminar TODAS las políticas existentes para empezar de cero
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'objects'
    AND schemaname = 'storage'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
  END LOOP;
END $$;

-- Crear políticas PERMISIVAS para el bucket images
-- Estas políticas permiten operaciones a CUALQUIER usuario (incluso anónimos)

-- Política 1: Permitir a TODOS ver imágenes (SELECT)
CREATE POLICY "images_public_select_v2"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Política 2: Permitir a TODOS subir imágenes (INSERT)
-- IMPORTANTE: Esta política no requiere autenticación
CREATE POLICY "images_public_insert_v2"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Política 3: Permitir a TODOS actualizar imágenes (UPDATE)
CREATE POLICY "images_public_update_v2"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' )
WITH CHECK ( bucket_id = 'images' );

-- Política 4: Permitir a TODOS eliminar imágenes (DELETE)
CREATE POLICY "images_public_delete_v2"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- Log de verificación
DO $$
DECLARE
  bucket_public BOOLEAN;
  policy_count INTEGER;
BEGIN
  -- Verificar configuración del bucket
  SELECT public INTO bucket_public
  FROM storage.buckets
  WHERE id = 'images';

  -- Contar políticas
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE 'images_public_%';

  RAISE NOTICE '==============================================';
  RAISE NOTICE 'VERIFICACIÓN DE CONFIGURACIÓN DE STORAGE';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Bucket "images" existe: %', FOUND;
  RAISE NOTICE 'Bucket es público: %', bucket_public;
  RAISE NOTICE 'Número de políticas creadas: %', policy_count;
  RAISE NOTICE '==============================================';

  IF policy_count = 4 THEN
    RAISE NOTICE '✅ Todas las políticas de storage están configuradas correctamente';
  ELSE
    RAISE WARNING '⚠️ Faltan políticas. Esperadas: 4, Encontradas: %', policy_count;
  END IF;
END $$;
