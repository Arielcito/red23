import { supabase } from '@/lib/supabase/client'
import type {
  Casino,
  NewCasino,
  CasinoField,
  NewCasinoField,
  CasinoFieldValue,
  NewCasinoFieldValue,
  CasinoConfig,
  NewCasinoConfig,
  CasinoWithFields,
  CasinoFieldValueFormatted,
  CasinoBadgeValue,
  TopCasino,
  CasinoConfigFormatted
} from '@/lib/supabase/types'

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
      console.log('✅ Casino obtenido:', formattedCasino.name)
      return formattedCasino
    } catch (error) {
      console.error('❌ Error en getCasinoById:', error)
      throw new Error('Error al obtener el casino')
    }
  }

  static async createCasino(casinoData: NewCasino): Promise<CasinoWithFields> {
    try {
      console.log('🆕 Creando nuevo casino:', casinoData.name)

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
        name: casino.name,
        plataforma: casino.plataforma,
        imageUrl: casino.image_url || '/placeholder-casino.svg',
        potencial: {
          value: casino.potencial_value,
          color: casino.potencial_color,
          label: casino.potencial_label
        } as CasinoBadgeValue,
        position: casino.top_three_position
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
  // CUSTOM FIELDS OPERATIONS
  // =============================================

  static async getCasinoFields(): Promise<CasinoField[]> {
    try {
      console.log('🔧 Obteniendo campos personalizados...')

      const { data: fields, error } = await supabase
        .from('casino_fields')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('❌ Error obteniendo campos:', error)
        throw new Error('Error al obtener los campos')
      }

      console.log('✅ Campos obtenidos:', fields?.length || 0)
      return fields || []
    } catch (error) {
      console.error('❌ Error en getCasinoFields:', error)
      throw new Error('Error al obtener los campos')
    }
  }

  static async createCasinoField(fieldData: NewCasinoField): Promise<CasinoField> {
    try {
      console.log('🆕 Creando campo personalizado:', fieldData.name)

      const { data: newField, error } = await supabase
        .from('casino_fields')
        .insert(fieldData)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error creando campo:', error)
        throw new Error('Error al crear el campo')
      }

      console.log('✅ Campo creado exitosamente:', newField.name)
      return newField
    } catch (error) {
      console.error('❌ Error en createCasinoField:', error)
      throw new Error('Error al crear el campo')
    }
  }

  static async updateCasinoField(fieldId: string, updates: Partial<NewCasinoField>): Promise<CasinoField> {
    try {
      console.log('📝 Actualizando campo:', fieldId)

      const { data: updatedField, error } = await supabase
        .from('casino_fields')
        .update(updates)
        .eq('id', fieldId)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error actualizando campo:', error)
        throw new Error('Error al actualizar el campo')
      }

      console.log('✅ Campo actualizado:', updatedField.name)
      return updatedField
    } catch (error) {
      console.error('❌ Error en updateCasinoField:', error)
      throw new Error('Error al actualizar el campo')
    }
  }

  static async deleteCasinoField(fieldId: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando campo:', fieldId)

      // Soft delete - marcar como inactivo
      const { error } = await supabase
        .from('casino_fields')
        .update({ is_active: false })
        .eq('id', fieldId)

      if (error) {
        console.error('❌ Error eliminando campo:', error)
        throw new Error('Error al eliminar el campo')
      }

      console.log('✅ Campo eliminado exitosamente')
    } catch (error) {
      console.error('❌ Error en deleteCasinoField:', error)
      throw new Error('Error al eliminar el campo')
    }
  }

  static async reorderCasinoFields(fieldIds: string[]): Promise<void> {
    try {
      console.log('📋 Reordenando campos...')

      for (let i = 0; i < fieldIds.length; i++) {
        const fieldId = fieldIds[i]
        const newOrder = i + 1

        const { error } = await supabase
          .from('casino_fields')
          .update({ display_order: newOrder })
          .eq('id', fieldId)

        if (error) {
          console.error('❌ Error reordenando campo:', error)
          throw error
        }
      }

      console.log('✅ Campos reordenados exitosamente')
    } catch (error) {
      console.error('❌ Error en reorderCasinoFields:', error)
      throw new Error('Error al reordenar los campos')
    }
  }

  // =============================================
  // FIELD VALUES OPERATIONS
  // =============================================

  static async updateCasinoFieldValue(casinoId: string, fieldId: string, valueData: Partial<NewCasinoFieldValue>): Promise<CasinoFieldValue> {
    try {
      console.log('💾 Actualizando valor de campo para casino:', casinoId)

      const { data: existingValue, error: selectError } = await supabase
        .from('casino_field_values')
        .select('*')
        .eq('casino_id', casinoId)
        .eq('field_id', fieldId)
        .single()

      let result: CasinoFieldValue

      if (existingValue) {
        // Actualizar valor existente
        const { data: updatedValue, error } = await supabase
          .from('casino_field_values')
          .update(valueData)
          .eq('casino_id', casinoId)
          .eq('field_id', fieldId)
          .select('*')
          .single()

        if (error) {
          console.error('❌ Error actualizando valor:', error)
          throw error
        }

        result = updatedValue
      } else {
        // Crear nuevo valor
        const newValueData: NewCasinoFieldValue = {
          casino_id: casinoId,
          field_id: fieldId,
          ...valueData
        }

        const { data: newValue, error } = await supabase
          .from('casino_field_values')
          .insert(newValueData)
          .select('*')
          .single()

        if (error) {
          console.error('❌ Error creando valor:', error)
          throw error
        }

        result = newValue
      }

      console.log('✅ Valor de campo actualizado exitosamente')
      return result
    } catch (error) {
      console.error('❌ Error en updateCasinoFieldValue:', error)
      throw new Error('Error al actualizar el valor del campo')
    }
  }

  // =============================================
  // CONFIGURATION OPERATIONS
  // =============================================

  static async getCasinoConfig(): Promise<CasinoConfigFormatted> {
    try {
      console.log('⚙️ Obteniendo configuración de casinos...')

      const [fields, topThree] = await Promise.all([
        this.getCasinoFields(),
        this.getTopThreeCasinos()
      ])

      const config: CasinoConfigFormatted = {
        customFields: fields,
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
    const potencial: CasinoBadgeValue = {
      value: dbCasino.potencial_value,
      color: dbCasino.potencial_color,
      label: dbCasino.potencial_label
    }

    const customFields: CasinoFieldValueFormatted[] = Array.isArray(dbCasino.custom_fields) 
      ? dbCasino.custom_fields
          .filter((field: any) => field.fieldId) // Filter out null/empty fields
          .map((field: any) => {
            let value: string | number | CasinoBadgeValue

            if (field.fieldType === 'badge' && field.badgeValue) {
              value = {
                value: field.badgeValue,
                color: field.badgeColor || 'green',
                label: field.badgeLabel || field.badgeValue
              }
            } else if (field.fieldType === 'number' && field.numberValue !== null) {
              value = field.numberValue
            } else {
              value = field.textValue || ''
            }

            return {
              fieldId: field.fieldId,
              fieldName: field.fieldName,
              fieldType: field.fieldType,
              value
            }
          })
      : []

    return {
      id: dbCasino.id,
      name: dbCasino.name,
      logo: dbCasino.logo,
      plataforma: dbCasino.plataforma,
      tiempo: dbCasino.tiempo,
      potencial,
      similar: dbCasino.similar,
      customFields,
      isTopThree: dbCasino.is_top_three,
      topThreePosition: dbCasino.top_three_position,
      imageUrl: dbCasino.image_url,
      createdAt: dbCasino.created_at,
      updatedAt: dbCasino.updated_at
    }
  }

  static mapToDbCasino(casinoData: Partial<CasinoWithFields>): Partial<NewCasino> {
    return {
      name: casinoData.name,
      logo: casinoData.logo,
      plataforma: casinoData.plataforma,
      tiempo: casinoData.tiempo,
      potencial_value: casinoData.potencial?.value as 'high' | 'medium' | 'low',
      potencial_color: casinoData.potencial?.color,
      potencial_label: casinoData.potencial?.label,
      similar: casinoData.similar,
      is_top_three: casinoData.isTopThree,
      top_three_position: casinoData.topThreePosition,
      image_url: casinoData.imageUrl
    }
  }
}