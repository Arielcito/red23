import { supabase } from '@/lib/supabase/client'
import type { UserLogo, NewUserLogo } from '@/lib/supabase/types'
import { uploadFile, deleteFile } from '@/lib/services/supabaseStorageService'

export class UserLogoService {
  static async uploadUserLogo(userId: string, file: File, userEmail: string): Promise<UserLogo> {
    try {
      console.log('📤 Subiendo logo del usuario:', { userId, fileName: file.name })

      const uploadResult = await uploadFile(file, userEmail)

      const existingLogo = await this.getUserLogo(userId)

      let savedLogo: UserLogo

      if (existingLogo) {
        console.log('🔄 Actualizando logo existente')

        try {
          await deleteFile(existingLogo.logo_path)
        } catch (error) {
          console.warn('⚠️ No se pudo eliminar el logo anterior del storage:', error)
        }

        const { data, error } = await supabase
          .from('user_logos')
          .update({
            logo_url: uploadResult.publicUrl,
            logo_path: uploadResult.path,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select('*')
          .single()

        if (error) {
          console.error('Error actualizando logo en DB:', error)
          await deleteFile(uploadResult.path)
          throw error
        }

        savedLogo = data!
      } else {
        console.log('✨ Creando nuevo logo')

        const newLogo: NewUserLogo = {
          user_id: userId,
          logo_url: uploadResult.publicUrl,
          logo_path: uploadResult.path
        }

        const { data, error } = await supabase
          .from('user_logos')
          .insert(newLogo)
          .select('*')
          .single()

        if (error) {
          console.error('Error guardando logo en DB:', error)
          await deleteFile(uploadResult.path)
          throw error
        }

        savedLogo = data!
      }

      console.log('✅ Logo guardado exitosamente:', {
        id: savedLogo.id,
        logo_url: savedLogo.logo_url
      })

      return savedLogo
    } catch (error) {
      console.error('❌ Error subiendo logo del usuario:', error)
      throw new Error('Error al subir el logo')
    }
  }

  static async getUserLogo(userId: string): Promise<UserLogo | null> {
    try {
      console.log('🔍 Obteniendo logo del usuario:', userId)

      const { data, error } = await supabase
        .from('user_logos')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error obteniendo logo:', error)
        throw error
      }

      console.log('✅ Logo obtenido:', data ? 'encontrado' : 'no encontrado')
      return data
    } catch (error) {
      console.error('❌ Error obteniendo logo del usuario:', error)
      throw new Error('Error al obtener el logo')
    }
  }

  static async deleteUserLogo(userId: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando logo del usuario:', userId)

      const existingLogo = await this.getUserLogo(userId)

      if (!existingLogo) {
        throw new Error('Logo no encontrado')
      }

      try {
        await deleteFile(existingLogo.logo_path)
      } catch (error) {
        console.warn('⚠️ No se pudo eliminar el logo del storage:', error)
      }

      const { error } = await supabase
        .from('user_logos')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Error eliminando logo de DB:', error)
        throw error
      }

      console.log('✅ Logo eliminado exitosamente')
    } catch (error) {
      console.error('❌ Error eliminando logo del usuario:', error)
      throw new Error('Error al eliminar el logo')
    }
  }
}
