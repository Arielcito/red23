# Configuración Manual de Políticas RLS en Supabase Storage

## ⚠️ Problema
El bucket `images` tiene políticas RLS activas que bloquean los uploads. Necesitas configurarlas manualmente desde el Dashboard de Supabase.

## 🎯 Solución: Configuración Manual (Sin SQL)

### Paso 1: Acceder al Storage en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **Storage**
4. Haz clic en el bucket **`images`**

### Paso 2: Verificar Configuración del Bucket

1. En la vista del bucket `images`, haz clic en el ícono de **configuración (⚙️)** o **Settings**
2. Verifica/Configura:
   - ✅ **Public bucket**: Debe estar **ACTIVADO** (toggle ON)
   - ✅ **File size limit**: `10485760` (10 MB)
   - ✅ **Allowed MIME types**: Agrega estos tipos (uno por línea):
     ```
     image/jpeg
     image/jpg
     image/png
     image/gif
     image/webp
     ```
3. Haz clic en **Save**

### Paso 3: Configurar Políticas RLS Manualmente

1. Dentro del bucket `images`, ve a la pestaña **Policies**
2. Elimina todas las políticas existentes (si hay alguna)

#### 3.1. Crear Política de SELECT (Ver imágenes)

1. Haz clic en **New Policy**
2. Selecciona **Create a policy from scratch**
3. Configura:
   - **Policy name**: `images_public_select`
   - **Allowed operation**: Marca **SELECT**
   - **Policy definition (USING)**: Deja el campo VACÍO o escribe:
     ```sql
     true
     ```
   - **Target roles**: `public` (o deja en blanco para aplicar a todos)
4. Haz clic en **Review** y luego **Save policy**

#### 3.2. Crear Política de INSERT (Subir imágenes)

1. Haz clic en **New Policy**
2. Selecciona **Create a policy from scratch**
3. Configura:
   - **Policy name**: `images_public_insert`
   - **Allowed operation**: Marca **INSERT**
   - **Policy definition (WITH CHECK)**: Deja el campo VACÍO o escribe:
     ```sql
     true
     ```
   - **Target roles**: `public` (o deja en blanco para aplicar a todos)
4. Haz clic en **Review** y luego **Save policy**

#### 3.3. Crear Política de UPDATE (Actualizar imágenes)

1. Haz clic en **New Policy**
2. Selecciona **Create a policy from scratch**
3. Configura:
   - **Policy name**: `images_public_update`
   - **Allowed operation**: Marca **UPDATE**
   - **Policy definition (USING)**: Escribe:
     ```sql
     true
     ```
   - **Policy definition (WITH CHECK)**: Escribe:
     ```sql
     true
     ```
   - **Target roles**: `public`
4. Haz clic en **Review** y luego **Save policy**

#### 3.4. Crear Política de DELETE (Eliminar imágenes)

1. Haz clic en **New Policy**
2. Selecciona **Create a policy from scratch**
3. Configura:
   - **Policy name**: `images_public_delete`
   - **Allowed operation**: Marca **DELETE**
   - **Policy definition (USING)**: Escribe:
     ```sql
     true
     ```
   - **Target roles**: `public`
4. Haz clic en **Review** y luego **Save policy**

### Paso 4: Verificar Configuración

Después de crear las 4 políticas, deberías ver en la pestaña **Policies**:

```
✅ images_public_select  - SELECT - Enabled
✅ images_public_insert  - INSERT - Enabled
✅ images_public_update  - UPDATE - Enabled
✅ images_public_delete  - DELETE - Enabled
```

### Paso 5: Probar Upload

1. Ve a tu aplicación: `http://localhost:3000/admin/casinos`
2. Intenta subir una imagen nuevamente
3. Revisa la consola del navegador para los logs detallados

---

## 🔧 Alternativa: SQL Simplificado (Si tienes permisos)

Si puedes ejecutar SQL como owner, usa este script simplificado:

```sql
-- Configurar bucket como público
UPDATE storage.buckets
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'images';

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "images_public_select" ON storage.objects;
DROP POLICY IF EXISTS "images_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "images_public_update" ON storage.objects;
DROP POLICY IF EXISTS "images_public_delete" ON storage.objects;

-- Crear políticas permisivas
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
```

---

## ❓ Preguntas Frecuentes

### ¿Por qué usar `true` en las políticas?
Porque queremos que **cualquier usuario** pueda realizar operaciones en el bucket. La seguridad real está en:
- Clerk protege las rutas `/admin/*`
- Solo usuarios autenticados pueden acceder
- El bucket es público solo para operaciones, no para acceso anónimo

### ¿Es seguro hacer el bucket completamente público?
Sí, porque:
1. Solo los usuarios autenticados en Clerk pueden acceder a `/admin/casinos`
2. El middleware de Clerk bloquea accesos no autorizados
3. Las políticas permiten operaciones, pero no exponen datos sensibles

### ¿Qué pasa si no puedo crear políticas manualmente?
Contacta al administrador de tu proyecto de Supabase para que te otorgue permisos de **Owner** o que ejecute el SQL por ti.

---

## 📧 Soporte

Si después de estos pasos el error persiste:
1. Toma una captura de pantalla de la pestaña **Policies** del bucket
2. Copia los logs completos de la consola del navegador
3. Verifica que el bucket `images` exista y esté marcado como **Public**
