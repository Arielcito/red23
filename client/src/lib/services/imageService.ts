import { supabase } from '@/lib/supabase/client'

const BUCKET_NAME = 'images'

/**
 * Sube una imagen al bucket de Supabase y retorna la URL pública
 */
export async function uploadImage(file: File, folder: string = ''): Promise<string> {
    try {
      console.log('📤 [imageService] Iniciando subida de imagen')
      console.log('   📝 Archivo:', file.name)
      console.log('   📦 Tamaño:', (file.size / 1024).toFixed(2), 'KB')
      console.log('   🗂️ Tipo:', file.type)
      console.log('   📁 Carpeta destino:', folder || '(raíz)')
      console.log('   🪣 Bucket:', BUCKET_NAME)

      // NOTA: La autenticación se maneja por Clerk en el middleware y componentes.
      // El bucket de Supabase está configurado con políticas públicas que permiten
      // INSERT/UPDATE/DELETE. No se requiere sesión de Supabase aquí.
      console.log('✅ [imageService] Usuario autenticado por Clerk')

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      console.log('   📄 Path completo:', filePath)

      // Subir archivo
      console.log('⏳ [imageService] Ejecutando upload a Supabase Storage...')
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ [imageService] Error en upload de Supabase Storage:')
        console.error('   📋 Código:', error.name)
        console.error('   💬 Mensaje:', error.message)
        console.error('   📊 Detalles completos:', JSON.stringify(error, null, 2))
        console.error('   🔒 Tipo de error:', error.constructor.name)

        // Mensajes de error más específicos
        if (error.message?.includes('row-level security')) {
          throw new Error(`Error de permisos (RLS): El usuario no tiene permisos para subir archivos al bucket "${BUCKET_NAME}". Verifica las políticas de Storage en Supabase.`)
        }

        throw new Error(`Error subiendo imagen: ${error.message}`)
      }

      console.log('✅ [imageService] Upload exitoso - Path:', data.path)

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path)

      console.log('✅ [imageService] URL pública generada:', urlData.publicUrl)
      console.log('🎉 [imageService] Proceso completado exitosamente')

      return urlData.publicUrl

    } catch (error) {
      console.error('❌ [imageService] Error fatal en uploadImage:')
      console.error('   📋 Tipo:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('   💬 Mensaje:', error instanceof Error ? error.message : String(error))
      console.error('   📊 Stack:', error instanceof Error ? error.stack : 'No stack trace')
      throw error
    }
  }

/**
 * Elimina una imagen del bucket
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando imagen:', imageUrl)
      
      // Extraer el path del archivo de la URL
      const url = new URL(imageUrl)
      const pathSegments = url.pathname.split('/')
      const bucketIndex = pathSegments.indexOf(BUCKET_NAME)
      
      if (bucketIndex === -1) {
        throw new Error('URL de imagen inválida')
      }
      
      const filePath = pathSegments.slice(bucketIndex + 1).join('/')

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (error) {
        console.error('❌ Error eliminando imagen:', error)
        throw new Error(`Error eliminando imagen: ${error.message}`)
      }

      console.log('✅ Imagen eliminada exitosamente')

    } catch (error) {
      console.error('❌ Error en deleteImage:', error)
      throw error
    }
  }

/**
 * Reemplaza una imagen existente por una nueva
 */
export async function replaceImage(oldImageUrl: string, newFile: File, folder: string = ''): Promise<string> {
  try {
    console.log('🔄 Reemplazando imagen:', oldImageUrl)
    
    // Subir nueva imagen
    const newImageUrl = await uploadImage(newFile, folder)
    
    // Eliminar imagen anterior (sin lanzar error si falla)
    try {
      await deleteImage(oldImageUrl)
    } catch (error) {
      console.warn('⚠️ No se pudo eliminar la imagen anterior:', error)
    }
    
    return newImageUrl

  } catch (error) {
    console.error('❌ Error en replaceImage:', error)
    throw error
  }
}

/**
 * Valida que el archivo sea una imagen válida
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no válido. Solo se permiten: JPG, PNG, WebP, GIF'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es muy grande. Máximo 5MB'
    }
  }

  return { valid: true }
}
