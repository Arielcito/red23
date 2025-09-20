import { supabase } from '@/lib/supabase/client'
import { createClient } from '@supabase/supabase-js'
import type { RewardImages, NewRewardImages } from '@/lib/supabase/types'

// Cliente con service key para operaciones administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface UploadRewardImageData {
  file: File
  name: string
  description?: string
  imageType: 'winner_avatar' | 'banner_image' | 'prize_image'
  uploadedBy?: string
}

export interface RewardImageUploadResult {
  success: boolean
  data?: {
    id: number
    imageUrl: string
    publicUrl: string
  }
  error?: string
}

const REWARDS_BUCKET = 'rewards-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export class RewardStorageService {
  /**
   * Sube una imagen al bucket de rewards en Supabase Storage
   */
  static async uploadImage(data: UploadRewardImageData): Promise<RewardImageUploadResult> {
    try {
      console.log('🖼️ Subiendo imagen de reward:', {
        name: data.name,
        type: data.imageType,
        size: data.file.size,
        fileType: data.file.type
      })

      // Validaciones
      if (!ALLOWED_TYPES.includes(data.file.type)) {
        return {
          success: false,
          error: `Tipo de archivo no soportado: ${data.file.type}. Formatos permitidos: JPG, PNG, GIF, WebP`
        }
      }

      if (data.file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: `Archivo demasiado grande: ${(data.file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 5MB`
        }
      }

      // Generar nombre único para el archivo
      const fileExt = data.file.name.split('.').pop()
      const fileName = `${data.imageType}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Subir archivo a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(REWARDS_BUCKET)
        .upload(fileName, data.file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ Error subiendo archivo:', uploadError)
        return {
          success: false,
          error: `Error subiendo archivo: ${uploadError.message}`
        }
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(REWARDS_BUCKET)
        .getPublicUrl(fileName)

      if (!urlData.publicUrl) {
        return {
          success: false,
          error: 'Error obteniendo URL pública del archivo'
        }
      }

      // Guardar metadata en la base de datos
      const imageData: NewRewardImages = {
        name: data.name,
        description: data.description,
        image_url: urlData.publicUrl,
        image_type: data.imageType,
        uploaded_by: data.uploadedBy,
        is_active: true
      }

      const { data: dbData, error: dbError } = await supabaseAdmin
        .from('reward_images')
        .insert(imageData)
        .select('*')
        .single()

      if (dbError) {
        console.error('❌ Error guardando metadata:', dbError)
        // Intentar eliminar archivo subido si falló el guardado en BD
        await supabase.storage.from(REWARDS_BUCKET).remove([fileName])
        return {
          success: false,
          error: `Error guardando información de la imagen: ${dbError.message}`
        }
      }

      console.log('✅ Imagen de reward subida exitosamente:', {
        id: dbData.id,
        url: urlData.publicUrl,
        fileName
      })

      return {
        success: true,
        data: {
          id: dbData.id,
          imageUrl: urlData.publicUrl,
          publicUrl: urlData.publicUrl
        }
      }

    } catch (error) {
      console.error('❌ Error inesperado subiendo imagen:', error)
      return {
        success: false,
        error: 'Error interno del servidor al subir la imagen'
      }
    }
  }

  /**
   * Obtiene todas las imágenes de rewards
   */
  static async getImages(imageType?: string, limit: number = 50): Promise<RewardImages[]> {
    try {
      console.log('📋 Obteniendo imágenes de rewards:', { imageType, limit })

      let query = supabase
        .from('reward_images')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (imageType) {
        query = query.eq('image_type', imageType)
      }

      const { data: images, error } = await query

      if (error) {
        console.error('❌ Error obteniendo imágenes:', error)
        throw error
      }

      console.log('✅ Imágenes obtenidas:', images?.length || 0)
      return images || []
    } catch (error) {
      console.error('❌ Error obteniendo imágenes de rewards:', error)
      throw new Error('Error al obtener las imágenes de rewards')
    }
  }

  /**
   * Elimina una imagen del storage y la base de datos
   */
  static async deleteImage(id: number): Promise<boolean> {
    try {
      console.log('🗑️ Eliminando imagen de reward:', id)

      // Obtener información de la imagen
      const { data: image, error: getError } = await supabaseAdmin
        .from('reward_images')
        .select('*')
        .eq('id', id)
        .single()

      if (getError || !image) {
        console.error('❌ Imagen no encontrada:', getError)
        return false
      }

      // Extraer path del archivo de la URL
      const url = new URL(image.image_url)
      const pathSegments = url.pathname.split('/')
      const fileName = pathSegments[pathSegments.length - 1]
      const filePath = `${image.image_type}/${fileName}`

      // Eliminar archivo del storage
      const { error: storageError } = await supabase.storage
        .from(REWARDS_BUCKET)
        .remove([filePath])

      if (storageError) {
        console.error('❌ Error eliminando archivo del storage:', storageError)
        // Continuar con la eliminación de la BD aunque falle el storage
      }

      // Marcar como inactivo en la base de datos (soft delete)
      const { error: updateError } = await supabaseAdmin
        .from('reward_images')
        .update({ is_active: false })
        .eq('id', id)

      if (updateError) {
        console.error('❌ Error marcando imagen como inactiva:', updateError)
        return false
      }

      console.log('✅ Imagen eliminada exitosamente:', id)
      return true
    } catch (error) {
      console.error('❌ Error eliminando imagen de reward:', error)
      return false
    }
  }

  /**
   * Actualiza la metadata de una imagen
   */
  static async updateImage(id: number, updates: Partial<NewRewardImages>): Promise<RewardImages | null> {
    try {
      console.log('📝 Actualizando imagen de reward:', { id, updates })

      const { data: updatedImage, error } = await supabaseAdmin
        .from('reward_images')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error actualizando imagen:', error)
        throw error
      }

      console.log('✅ Imagen actualizada exitosamente:', updatedImage?.id)
      return updatedImage
    } catch (error) {
      console.error('❌ Error actualizando imagen de reward:', error)
      throw new Error('Error al actualizar la imagen')
    }
  }

  /**
   * Obtiene la URL pública de una imagen en el storage
   */
  static getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(REWARDS_BUCKET)
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }

  /**
   * Verifica si el bucket de rewards existe
   */
  static async checkBucket(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.getBucket(REWARDS_BUCKET)
      
      if (error || !data) {
        console.warn('⚠️ Bucket de rewards no existe o no es accesible')
        return false
      }

      console.log('✅ Bucket de rewards disponible:', data.name)
      return true
    } catch (error) {
      console.error('❌ Error verificando bucket:', error)
      return false
    }
  }
}