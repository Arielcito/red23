import { supabase } from '@/lib/supabase/client'
import type {
  Casino,
  NewCasino,
  CasinoConfig,
  NewCasinoConfig,
  CasinoWithFields,
  PrecioBadgeValue,
  TopCasino,
  CasinoConfigFormatted,
  PrecioValue
} from '@/lib/supabase/types'
import { CASINO_PRECIO_VALUES } from '@/lib/supabase/types'

export class CasinoService {
  // =============================================
  // CASINO CRUD OPERATIONS
  // =============================================

  static async getAllCasinos(): Promise<CasinoWithFields[]> {
    try {
      console.log('🎰 Obteniendo todos los casinos con campos personalizados...')

      const { data: casinos, error } = await supabase
        .from('casinos_with_fields')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error obteniendo casinos:', error)
        throw new Error('Error al obtener los casinos')
      }

      const formattedCasinos = casinos?.map(CasinoService.formatCasinoFromDB) || []
      
      console.log('✅ Casinos obtenidos:', formattedCasinos.length)
      return formattedCasinos
    } catch (error) {
      console.error('❌ Error en getAllCasinos:', error)
      throw new Error('Error al obtener los casinos')
    }
  }

  static async getCasinoById(id: string): Promise<CasinoWithFields | null> {
    try {
      console.log('🔍 Obteniendo casino por ID:', id)

      const { data: casino, error } = await supabase
        .from('casinos_with_fields')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error obteniendo casino:', error)
        throw error
      }

      if (!casino) {
        console.log('⚠️ Casino no encontrado:', id)
        return null
      }

      const formattedCasino = this.formatCasinoFromDB(casino)
      console.log('✅ Casino obtenido:', formattedCasino.casinoName)
      return formattedCasino
    } catch (error) {
      console.error('❌ Error en getCasinoById:', error)
      throw new Error('Error al obtener el casino')
    }
  }

  static async createCasino(casinoData: NewCasino): Promise<CasinoWithFields> {
    try {
      console.log('🆕 Creando nuevo casino:', casinoData.casino_name)

      const { data: newCasino, error } = await supabase
        .from('casinos')
        .insert(casinoData)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error creando casino:', error)
        throw new Error('Error al crear el casino')
      }

      console.log('✅ Casino creado exitosamente:', newCasino.casino_name)
      
      // Obtener el casino completo con campos
      const fullCasino = await this.getCasinoById(newCasino.id)
      if (!fullCasino) {
        throw new Error('Error al obtener el casino creado')
      }

      return fullCasino
    } catch (error) {
      console.error('❌ Error en createCasino:', error)
      throw new Error('Error al crear el casino')
    }
  }

  static async updateCasino(id: string, updates: Partial<NewCasino>): Promise<CasinoWithFields> {
    try {
      console.log('📝 Actualizando casino:', id)

      const { data: updatedCasino, error } = await supabase
        .from('casinos')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error actualizando casino:', error)
        throw new Error('Error al actualizar el casino')
      }

      console.log('✅ Casino actualizado:', updatedCasino.casino_name)
      
      // Obtener el casino completo con campos
      const fullCasino = await this.getCasinoById(id)
      if (!fullCasino) {
        throw new Error('Error al obtener el casino actualizado')
      }

      return fullCasino
    } catch (error) {
      console.error('❌ Error en updateCasino:', error)
      throw new Error('Error al actualizar el casino')
    }
  }

  static async deleteCasino(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando casino:', id)

      // Soft delete - marcar como inactivo
      const { error } = await supabase
        .from('casinos')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        console.error('❌ Error eliminando casino:', error)
        throw new Error('Error al eliminar el casino')
      }

      console.log('✅ Casino eliminado exitosamente')
    } catch (error) {
      console.error('❌ Error en deleteCasino:', error)
      throw new Error('Error al eliminar el casino')
    }
  }

  // =============================================
  // TOP THREE OPERATIONS
  // =============================================

  static async getTopThreeCasinos(): Promise<TopCasino[]> {
    try {
      console.log('👑 Obteniendo top 3 casinos...')

      const { data: topCasinos, error } = await supabase
        .from('top_three_casinos')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        console.error('❌ Error obteniendo top 3:', error)
        throw new Error('Error al obtener el top 3')
      }

      const formattedTopCasinos = topCasinos?.map(casino => ({
        id: casino.id,
        casinoName: casino.casino_name,
        antiguedad: casino.antiguedad,
        precio: casino.precio,
        rtp: casino.rtp,
        isRegulated: casino.is_regulated ?? false,
        imageUrl: casino.image_url || '/placeholder-casino.svg',
        position: casino.position
      })) || []

      console.log('✅ Top 3 casinos obtenidos:', formattedTopCasinos.length)
      return formattedTopCasinos
    } catch (error) {
      console.error('❌ Error en getTopThreeCasinos:', error)
      throw new Error('Error al obtener el top 3')
    }
  }

  static async updateTopThree(casinoIds: string[]): Promise<void> {
    try {
      console.log('🔄 Actualizando top 3 casinos:', casinoIds)

      if (casinoIds.length > 3) {
        throw new Error('No se pueden tener más de 3 casinos en el top 3')
      }

      // Normalizar lista de IDs y remover duplicados
      const uniqueCasinoIds = Array.from(new Set(casinoIds))

      if (uniqueCasinoIds.length !== casinoIds.length) {
        console.warn('⚠️ Se detectaron IDs duplicados en la actualización del top 3')
      }

      if (uniqueCasinoIds.length > 3) {
        throw new Error('No se pueden asignar más de 3 casinos en el top 3')
      }

      // Obtener casinos que actualmente están en el top (position no null)
      const { data: currentTop, error: fetchTopError } = await supabase
        .from('casinos')
        .select('id, position')

      if (fetchTopError) {
        console.error('❌ Error obteniendo top 3 actual:', fetchTopError)
        throw fetchTopError
      }

      const currentTopIds = currentTop
        ?.filter(item => item.position !== null && item.position <= 3)
        .map(item => item.id) ?? []

      if (currentTopIds.length > 0) {
        const { error: clearError } = await supabase
          .from('casinos')
          .update({ position: null })
          .in('id', currentTopIds)

        if (clearError) {
          console.error('❌ Error limpiando posiciones previas del top 3:', clearError)
          throw clearError
        }
      }

      // Luego, actualizar los nuevos casinos del top 3
      for (let i = 0; i < uniqueCasinoIds.length; i++) {
        const casinoId = uniqueCasinoIds[i]
        const position = i + 1

        const { error: updateError } = await supabase
          .from('casinos')
          .update({ position })
          .eq('id', casinoId)

        if (updateError) {
          console.error('❌ Error actualizando casino en top 3:', updateError)
          throw updateError
        }
      }

      console.log('✅ Top 3 actualizado exitosamente')
    } catch (error) {
      console.error('❌ Error en updateTopThree:', error)
      throw new Error('Error al actualizar el top 3')
    }
  }

  static async updateTopThreeImage(casinoId: string, imageUrl: string): Promise<void> {
    try {
      console.log('🖼️ Actualizando imagen de casino top 3:', casinoId)

      const { data: casinoRecord, error: fetchError } = await supabase
        .from('casinos')
        .select('position')
        .eq('id', casinoId)
        .single()

      if (fetchError) {
        console.error('❌ Error verificando casino antes de actualizar imagen:', fetchError)
        throw new Error('Error al verificar el casino antes de actualizar la imagen')
      }

      if (!casinoRecord || casinoRecord.position === null) {
        throw new Error('El casino no forma parte del top 3 actual')
      }

      const { error } = await supabase
        .from('casinos')
        .update({ image_url: imageUrl })
        .eq('id', casinoId)

      if (error) {
        console.error('❌ Error actualizando imagen:', error)
        throw new Error('Error al actualizar la imagen')
      }

      console.log('✅ Imagen actualizada exitosamente')
    } catch (error) {
      console.error('❌ Error en updateTopThreeImage:', error)
      throw new Error('Error al actualizar la imagen')
    }
  }

  static async uploadCasinoCoverImage(casinoId: string, file: File | Blob): Promise<string> {
    try {
      console.log('📸 Subiendo imagen de casino al bucket:', casinoId)

      const extension = file instanceof File && file.name.includes('.')
        ? file.name.split('.').pop()?.toLowerCase()
        : 'jpg'

      const safeExtension = extension && extension.length <= 5 ? extension : 'jpg'
      const fileName = `${Date.now()}.${safeExtension}`
      const filePath = `casino/${casinoId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('❌ Error subiendo imagen al bucket:', uploadError)
        throw new Error('No se pudo subir la imagen al almacenamiento')
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('No se pudo obtener la URL pública de la imagen')
      }

      console.log('✅ Imagen subida correctamente:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('❌ Error en uploadCasinoCoverImage:', error)
      throw error instanceof Error ? error : new Error('Error desconocido subiendo imagen')
    }
  }


  // =============================================
  // CONFIGURATION OPERATIONS
  // =============================================

  static async getCasinoConfig(): Promise<CasinoConfigFormatted> {
    try {
      console.log('⚙️ Obteniendo configuración de casinos...')

      const topThree = await this.getTopThreeCasinos()

      const config: CasinoConfigFormatted = {
        topThreeIds: topThree.map(casino => casino.id),
        settings: {}
      }

      console.log('✅ Configuración obtenida')
      return config
    } catch (error) {
      console.error('❌ Error en getCasinoConfig:', error)
      throw new Error('Error al obtener la configuración')
    }
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  private static formatCasinoFromDB(dbCasino: any): CasinoWithFields {
    return {
      id: dbCasino.id,
      casinoName: dbCasino.casino_name,
      logo: dbCasino.logo,
      antiguedad: dbCasino.antiguedad,
      precio: dbCasino.precio,
      rtp: dbCasino.rtp,
      platSimilar: dbCasino.plat_similar,
      position: dbCasino.position,
      imageUrl: dbCasino.image_url,
      isRegulated: dbCasino.is_regulated ?? false,
      createdAt: dbCasino.created_at,
      updatedAt: dbCasino.updated_at
    }
  }

  static mapToDbCasino(casinoData: Partial<CasinoWithFields>): Partial<NewCasino> {
    return {
      casino_name: casinoData.casinoName,
      logo: casinoData.logo,
      antiguedad: casinoData.antiguedad,
      precio: casinoData.precio,
      rtp: casinoData.rtp,
      plat_similar: casinoData.platSimilar,
      position: casinoData.position,
      image_url: casinoData.imageUrl
    }
  }
}
