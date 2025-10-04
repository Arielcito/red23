# ✅ Lista de Verificación - Storage de Supabase

## Checklist para Solucionar Error de RLS

Usa esta lista para verificar que todo está configurado correctamente:

### 🪣 Configuración del Bucket

Ve a: **Supabase Dashboard → Storage → images → Settings**

- [ ] **Public bucket**: ✅ ACTIVADO (toggle verde)
- [ ] **File size limit**: `10485760` (10 MB)
- [ ] **Allowed MIME types**:
  - [ ] `image/jpeg`
  - [ ] `image/jpg`
  - [ ] `image/png`
  - [ ] `image/gif`
  - [ ] `image/webp`

### 🔒 Políticas RLS

Ve a: **Supabase Dashboard → Storage → images → Policies**

Debes tener exactamente **4 políticas** activas:

- [ ] **images_public_select** (SELECT) - ✅ Enabled
  - Policy: `true` o `bucket_id = 'images'`

- [ ] **images_public_insert** (INSERT) - ✅ Enabled
  - Policy: `true` o `bucket_id = 'images'`

- [ ] **images_public_update** (UPDATE) - ✅ Enabled
  - Policy: `true` o `bucket_id = 'images'`

- [ ] **images_public_delete** (DELETE) - ✅ Enabled
  - Policy: `true` o `bucket_id = 'images'`

### 📋 Variables de Entorno

Verifica que tengas estas variables en tu archivo `.env`:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu Anon Key

### 🧪 Prueba de Upload

1. [ ] Abre la consola del navegador (F12)
2. [ ] Ve a `/admin/casinos` en tu app
3. [ ] Intenta subir una imagen
4. [ ] Verifica los logs en la consola

**Logs esperados (sin errores):**
```
📤 [imageService] Iniciando subida de imagen
   📝 Archivo: Banner.jpg
   📦 Tamaño: 18.92 KB
   🗂️ Tipo: image/jpeg
   📁 Carpeta destino: casinos
   🪣 Bucket: images
✅ [imageService] Usuario autenticado por Clerk
   📄 Path completo: casinos/1759589696353-abc123.jpg
⏳ [imageService] Ejecutando upload a Supabase Storage...
✅ [imageService] Upload exitoso - Path: casinos/1759589696353-abc123.jpg
✅ [imageService] URL pública generada: https://...
🎉 [imageService] Proceso completado exitosamente
```

---

## 🚨 Errores Comunes y Soluciones

### Error: "new row violates row-level security policy"

**Causa**: Las políticas RLS no están configuradas o están mal configuradas.

**Solución**:
1. Ve a **Storage → images → Policies**
2. Elimina TODAS las políticas existentes
3. Crea las 4 políticas nuevamente siguiendo la guía `CONFIGURAR_RLS_MANUALMENTE.md`
4. Asegúrate de marcar el checkbox correcto (SELECT, INSERT, UPDATE, DELETE)
5. Usa `true` como policy definition

### Error: "Bucket not found"

**Causa**: El bucket `images` no existe.

**Solución**:
1. Ve a **Storage** en Supabase Dashboard
2. Haz clic en **New bucket**
3. Nombre: `images`
4. Marca como **Public bucket**
5. Crea el bucket
6. Configura las políticas

### Error: "Invalid MIME type"

**Causa**: El tipo de archivo no está en la lista permitida.

**Solución**:
1. Ve a **Storage → images → Settings**
2. Agrega el MIME type faltante a **Allowed MIME types**
3. Guarda los cambios

---

## 📸 Capturas de Pantalla de Referencia

### Configuración del Bucket (Debe verse así)

```
┌─────────────────────────────────────┐
│ Bucket: images                      │
├─────────────────────────────────────┤
│ Public bucket:          [✅ ON]     │
│ File size limit:        10485760    │
│ Allowed MIME types:                 │
│   - image/jpeg                      │
│   - image/jpg                       │
│   - image/png                       │
│   - image/gif                       │
│   - image/webp                      │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

### Políticas (Debe verse así)

```
┌─────────────────────────────────────────────────┐
│ Policies for images bucket                      │
├─────────────────────────────────────────────────┤
│ ✅ images_public_select    SELECT    Enabled   │
│ ✅ images_public_insert    INSERT    Enabled   │
│ ✅ images_public_update    UPDATE    Enabled   │
│ ✅ images_public_delete    DELETE    Enabled   │
│                                                 │
│ [+ New Policy]                                  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Resumen

**Para que funcione, necesitas:**
1. ✅ Bucket `images` público
2. ✅ Límite de 10 MB configurado
3. ✅ MIME types permitidos configurados
4. ✅ 4 políticas RLS creadas y habilitadas
5. ✅ Variables de entorno configuradas

**Si cumples con todo esto y aún falla:**
- Revisa que las políticas usen `true` o `bucket_id = 'images'`
- Verifica que NO haya políticas contradictorias
- Asegúrate de que el bucket esté marcado como **Public**
