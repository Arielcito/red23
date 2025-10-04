# Solución al Error de RLS en Supabase Storage

## Problema
Al intentar subir una imagen de casino en `/admin/casinos`, aparecía el error:
```
StorageApiError: new row violates row-level security policy
```

O el error:
```
Error: No hay sesión activa. Por favor, inicia sesión nuevamente.
```

## Causa Real (Identificada)
El proyecto usa **Clerk** para autenticación, pero el código intentaba verificar una **sesión de Supabase** que nunca existe.

- ✅ El usuario está autenticado en Clerk
- ❌ Supabase no tiene sistema de autenticación activo (solo se usa para DB y Storage)
- ❌ El código verificaba `supabase.auth.getSession()` que siempre retorna `null`

## Solución Aplicada

### ✅ Cambios en el Código
Se eliminó la verificación de sesión de Supabase del archivo `imageService.ts` porque:
1. La autenticación la maneja Clerk (middleware + componentes protegidos)
2. El bucket `images` está configurado con políticas RLS públicas
3. Solo usuarios autenticados en Clerk pueden acceder a `/admin/casinos`

## Solución

### ⚠️ IMPORTANTE: Error de Permisos al Ejecutar SQL

Si al intentar ejecutar la migración SQL obtienes un error de permisos (no eres owner de las tablas), **debes configurar las políticas manualmente** desde el Dashboard de Supabase.

👉 **Sigue esta guía paso a paso**: [CONFIGURAR_RLS_MANUALMENTE.md](./CONFIGURAR_RLS_MANUALMENTE.md)

O si prefieres SQL y tienes los permisos necesarios:

### Paso 1: Ejecutar la Migración en Supabase (Requiere permisos de Owner)

1. **Accede al Dashboard de Supabase**
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto

2. **Abre el SQL Editor**
   - En el menú lateral, selecciona "SQL Editor"

3. **Ejecuta la migración**
   - Copia el contenido del archivo: `supabase/migrations/20251004000000_ensure_storage_policies.sql`
   - Pégalo en el SQL Editor
   - Haz clic en "Run"

4. **Verifica los mensajes**
   Deberías ver mensajes de confirmación como:
   ```
   ✅ Todas las políticas de storage están configuradas correctamente
   Bucket "images" existe: true
   Bucket es público: true
   Número de políticas creadas: 4
   ```

### Paso 2: Verificar la Configuración del Bucket

1. Ve a **Storage** en el menú lateral de Supabase
2. Selecciona el bucket **images**
3. Verifica que:
   - ✅ El bucket está marcado como **Público**
   - ✅ Tamaño máximo: **10 MB**
   - ✅ Tipos MIME permitidos: `image/jpeg, image/jpg, image/png, image/gif, image/webp`

### Paso 3: Verificar las Políticas de RLS

1. En el bucket **images**, ve a la pestaña **Policies**
2. Deberías ver 4 políticas:
   - ✅ `images_public_select_v2` - Para leer imágenes
   - ✅ `images_public_insert_v2` - Para subir imágenes
   - ✅ `images_public_update_v2` - Para actualizar imágenes
   - ✅ `images_public_delete_v2` - Para eliminar imágenes

### Paso 4: Probar la Funcionalidad

1. Ve a `/admin/casinos` en tu aplicación
2. Intenta subir una imagen de un casino
3. Revisa los logs detallados en la consola del navegador

## Logging Mejorado

Ahora el servicio de imágenes incluye logging detallado que muestra:

- 📤 Información del archivo (nombre, tamaño, tipo)
- 🔐 Verificación de sesión de usuario
- 📄 Path completo del archivo en Storage
- ✅ Confirmación de upload exitoso
- ❌ Errores detallados con información de debugging

**Ejemplo de logs en consola:**
```
📤 [imageService] Iniciando subida de imagen
   📝 Archivo: casino-logo.png
   📦 Tamaño: 245.67 KB
   🗂️ Tipo: image/png
   📁 Carpeta destino: casinos
   🪣 Bucket: images
✅ [imageService] Sesión válida - Usuario: user_xxx
   📄 Path completo: casinos/1728054321-abc123.png
⏳ [imageService] Ejecutando upload a Supabase Storage...
✅ [imageService] Upload exitoso - Path: casinos/1728054321-abc123.png
✅ [imageService] URL pública generada: https://...
🎉 [imageService] Proceso completado exitosamente
```

## Errores Comunes

### Error: "El usuario no tiene permisos para subir archivos"
**Solución:** Ejecuta la migración SQL del Paso 1 para configurar las políticas correctamente.

### Error: "Bucket not found"
**Solución:** Verifica que el bucket `images` existe en Supabase Storage. Si no existe, créalo manualmente o ejecuta la migración.

### Error: "No hay sesión activa" (RESUELTO)
Este error ya fue solucionado eliminando la verificación incorrecta de sesión de Supabase. El proyecto usa Clerk para autenticación.

## Alternativa: Ejecutar con Supabase CLI

Si tienes Supabase CLI instalado, puedes ejecutar:

```bash
cd /Users/arielserato/Developer/red23/client
npx supabase db push
```

Esto aplicará todas las migraciones pendientes automáticamente.

## 📋 Verificación Completa

Antes de probar nuevamente, usa esta lista de verificación:

👉 **[VERIFICACION_STORAGE.md](./VERIFICACION_STORAGE.md)** - Checklist completo para verificar toda la configuración

## 🎯 Resumen de Archivos de Ayuda

1. **CONFIGURAR_RLS_MANUALMENTE.md** - Guía paso a paso para configurar políticas sin SQL
2. **VERIFICACION_STORAGE.md** - Checklist completo con capturas de referencia
3. **Este archivo** - Explicación del problema y soluciones

## Soporte

Si el problema persiste después de estos pasos:
1. Revisa los logs detallados en la consola del navegador
2. Completa el checklist en `VERIFICACION_STORAGE.md`
3. Verifica que las 4 políticas estén creadas y habilitadas
4. Contacta al equipo de desarrollo con:
   - Captura de pantalla de la pestaña Policies
   - Logs completos de la consola
   - Resultado del checklist
