import { supabase } from '@/lib/supabase/client'
import type { ImagesGenerator, NewImagesGenerator } from '@/lib/supabase/types'
import { nanoid } from 'nanoid'

export interface UploadImageData {
  user_email: string
  prompt?: string
  logo?: string
  result: string
  result_with_logo?: string
  tokens?: number
}

export class ImageUploadService {
  static async saveImage(data: UploadImageData) {
    try {
      console.log('🗄️ Guardando imagen en la base de datos:', {
        user_email: data.user_email,
        hasResult: !!data.result,
        tokens: data.tokens
      })

      const imageData: NewImagesGenerator = {
        user_email: data.user_email,
        request_id: nanoid(),
        prompt: data.prompt || 'Imagen subida por el usuario',
        logo: data.logo,
        result: data.result,
        result_with_logo: data.result_with_logo,
        tokens: data.tokens || 0
      }

      const { data: insertedImage, error } = await supabase
        .from('images_generator')
        .insert(imageData)
        .select('*')
        .single()

      if (error) {
        console.error('Error inserting image:', error)
        throw error
      }

      console.log('✅ Imagen guardada exitosamente en DB:', {
        id: insertedImage?.id,
        request_id: insertedImage?.request_id,
        created_at: insertedImage?.created_at
      })

      return insertedImage!
    } catch (error) {
      console.error('❌ Error guardando imagen en DB:', {
        error: error instanceof Error ? error.message : error,
        data: { ...data, result: data.result ? '[URL_PRESENTE]' : '[NO_URL]' }
      })
      throw new Error('Error interno del servidor al guardar la imagen')
    }
  }

  static async getImagesByUser(userEmail: string, limit: number = 50) {
    try {
      console.log('🔍 Obteniendo imágenes del usuario:', { userEmail, limit })

      const { data: images, error } = await supabase
        .from('images_generator')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error getting images:', error)
        throw error
      }

      console.log('✅ Imágenes obtenidas:', images?.length || 0)
      return images || []
    } catch (error) {
      console.error('❌ Error obteniendo imágenes:', error)
      throw new Error('Error al obtener las imágenes del usuario')
    }
  }

  static async deleteImage(id: number, userEmail: string) {
    try {
      console.log('🗑️ Eliminando imagen:', { id, userEmail })

      const { data: deletedImage, error } = await supabase
        .from('images_generator')
        .delete()
        .eq('id', id)
        .eq('user_email', userEmail)
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error deleting image:', error)
        throw error
      }

      if (!deletedImage) {
        throw new Error('Imagen no encontrada o no autorizada')
      }

      console.log('✅ Imagen eliminada exitosamente:', deletedImage?.id)
      return deletedImage
    } catch (error) {
      console.error('❌ Error eliminando imagen:', error)
      throw new Error('Error al eliminar la imagen')
    }
  }
}