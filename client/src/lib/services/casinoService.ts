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

      const formattedCasinos = casinos?.map(this.formatCasinoFromDB) || []
      
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

      console.log('✅ Casino creado exitosamente:', newCasino.name)
      
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

      console.log('✅ Casino actualizado:', updatedCasino.name)
      
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
        .order('top_three_position', { ascending: true })

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

      // Primero, remover todos los casinos del top 3
      const { error: clearError } = await supabase
        .from('casinos')
        .update({ 
          is_top_three: false, 
          top_three_position: null 
        })
        .eq('is_top_three', true)

      if (clearError) {
        console.error('❌ Error limpiando top 3:', clearError)
        throw clearError
      }

      // Luego, actualizar los nuevos casinos del top 3
      for (let i = 0; i < casinoIds.length; i++) {
        const casinoId = casinoIds[i]
        const position = i + 1

        const { error: updateError } = await supabase
          .from('casinos')
          .update({ 
            is_top_three: true, 
            top_three_position: position 
          })
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

      const { error } = await supabase
        .from('casinos')
        .update({ image_url: imageUrl })
        .eq('id', casinoId)
        .eq('is_top_three', true)

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