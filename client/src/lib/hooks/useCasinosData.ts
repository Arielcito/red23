"use client"

import { useState, useEffect, useCallback } from 'react'
import type {
  CasinoWithFields,
  TopCasino,
  CasinoConfigFormatted,
  CasinoField,
  NewCasino,
  NewCasinoField,
  CasinoBadgeValue
} from '@/lib/supabase/types'

// Datos de mock para desarrollo
const mockCasinos: CasinoWithFields[] = [
  {
    id: "mock-1",
    name: "Bet365",
    logo: null,
    plataforma: "Evolution Gaming",
    tiempo: "2-3 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "William Hill",
    isTopThree: true,
    topThreePosition: 1,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "500", label: "Hasta $500", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "premium", label: "Premium", color: "green" } }
    ]
  },
  {
    id: "mock-2",
    name: "888 Casino",
    logo: null,
    plataforma: "Playtech",
    tiempo: "1-2 días",
    potencial: { value: "very_high", label: "Muy Alto", color: "green" },
    similar: "Paddy Power",
    isTopThree: true,
    topThreePosition: 2,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "300", label: "Hasta $300", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "gold", label: "Gold", color: "yellow" } }
    ]
  },
  {
    id: "mock-3",
    name: "LeoVegas",
    logo: null,
    plataforma: "NetEnt",
    tiempo: "3-5 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "Casumo",
    isTopThree: true,
    topThreePosition: 3,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "200", label: "Hasta $200", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "silver", label: "Silver", color: "yellow" } }
    ]
  },
  {
    id: "mock-4",
    name: "Unibet",
    logo: null,
    plataforma: "Evolution Gaming",
    tiempo: "2-4 días",
    potencial: { value: "medium", label: "Medio", color: "yellow" },
    similar: "Betsson",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "150", label: "Hasta $150", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "bronze", label: "Bronze", color: "red" } }
    ]
  },
  {
    id: "mock-5",
    name: "Bwin",
    logo: null,
    plataforma: "Playtech",
    tiempo: "1-3 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "Bet-at-home",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "400", label: "Hasta $400", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "diamond", label: "Diamond", color: "green" } }
    ]
  },
  {
    id: "mock-6",
    name: "Royal Panda",
    logo: null,
    plataforma: "Microgaming",
    tiempo: "4-6 días",
    potencial: { value: "low", label: "Bajo", color: "red" },
    similar: "Guts",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "100", label: "Hasta $100", color: "red" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "basic", label: "Basic", color: "red" } }
    ]
  },
  {
    id: "mock-7",
    name: "Vegas Hero",
    logo: null,
    plataforma: "NetEnt",
    tiempo: "2-3 días",
    potencial: { value: "medium", label: "Medio", color: "yellow" },
    similar: "Thrills",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "250", label: "Hasta $250", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "silver", label: "Silver", color: "yellow" } }
    ]
  },
  {
    id: "mock-8",
    name: "Mr Green",
    logo: null,
    plataforma: "Evolution Gaming",
    tiempo: "3-4 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "Casino Euro",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "350", label: "Hasta $350", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "gold", label: "Gold", color: "yellow" } }
    ]
  },
  {
    id: "mock-9",
    name: "ComeOn",
    logo: null,
    plataforma: "Playtech",
    tiempo: "1-2 días",
    potencial: { value: "very_high", label: "Muy Alto", color: "green" },
    similar: "Mobilebet",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "450", label: "Hasta $450", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "platinum", label: "Platinum", color: "green" } }
    ]
  },
  {
    id: "mock-10",
    name: "Next Casino",
    logo: null,
    plataforma: "Microgaming",
    tiempo: "5-7 días",
    potencial: { value: "low", label: "Bajo", color: "red" },
    similar: "VideoSlots",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "75", label: "Hasta $75", color: "red" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "basic", label: "Basic", color: "red" } }
    ]
  }
];

const mockConfig: CasinoConfigFormatted = {
  customFields: [
    {
      id: "bonus",
      name: "Bono de Bienvenida",
      field_type: "badge",
      is_required: false,
      display_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "vip",
      name: "Programa VIP",
      field_type: "badge",
      is_required: false,
      display_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  topThreeIds: ["mock-1", "mock-2", "mock-3"],
  settings: {}
};

// Updated hook types for new API
export interface CasinosDataHook {
  casinos: CasinoWithFields[]
  topThree: TopCasino[]
  config: CasinoConfigFormatted
  isLoading: boolean
  error: string | null
  // Casino operations
  createCasino: (casino: Omit<CasinoWithFields, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CasinoWithFields>
  updateCasino: (id: string, updates: Partial<CasinoWithFields>) => Promise<CasinoWithFields>
  deleteCasino: (id: string) => Promise<void>
  // Top three operations
  setTopThree: (casinoIds: string[]) => Promise<void>
  updateTopThreeImage: (casinoId: string, imageUrl: string) => Promise<void>
  // Field configuration
  addCustomField: (field: Omit<CasinoField, 'id' | 'created_at' | 'updated_at'>) => Promise<CasinoField>
  updateCustomField: (fieldId: string, updates: Partial<CasinoField>) => Promise<CasinoField>
  deleteCustomField: (fieldId: string) => Promise<void>
  reorderFields: (fieldIds: string[]) => Promise<void>
  // Utility functions
  refreshData: () => Promise<void>
  clearError: () => void
}

// API Helper Functions
const apiCall = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export function useCasinosData(): CasinosDataHook {
  const [casinos, setCasinos] = useState<CasinoWithFields[]>([])
  const [config, setConfig] = useState<CasinoConfigFormatted>({
    customFields: [],
    topThreeIds: [],
    settings: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos reales desde la API o usar mock como fallback
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🎰 Cargando datos de casinos desde API...')

      try {
        // Cargar casinos y configuración en paralelo
        const [casinosResponse, configResponse] = await Promise.all([
          apiCall('/api/casinos'),
          apiCall('/api/casinos/config')
        ])

        if (casinosResponse.success && casinosResponse.data.length > 0) {
          setCasinos(casinosResponse.data)
          console.log('✅ Casinos cargados desde API:', casinosResponse.data.length)
        } else {
          throw new Error('No hay datos de casinos disponibles')
        }

        if (configResponse.success) {
          setConfig(configResponse.data)
          console.log('✅ Configuración cargada desde API')
        } else {
          throw new Error('No hay configuración disponible')
        }

      } catch (apiError) {
        console.warn('⚠️ API no disponible, usando datos de mock para desarrollo:', apiError)

        // Simular tiempo de carga para datos de mock
        await new Promise(resolve => setTimeout(resolve, 500))

        setCasinos(mockCasinos)
        setConfig(mockConfig)

        console.log('🎭 Datos de mock cargados exitosamente')
        console.log('📊 Mock casinos:', mockCasinos.length)
        console.log('⚙️ Mock config cargada')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading casino data'
      setError(errorMessage)
      console.error('❌ Error general cargando datos:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar datos al inicializar
  useEffect(() => {
    loadData()
  }, [loadData])

  // Top three computed from loaded data
  const topThree: TopCasino[] = casinos
    .filter(casino => casino.isTopThree)
    .sort((a, b) => (a.topThreePosition || 0) - (b.topThreePosition || 0))
    .map(casino => ({
      id: casino.id,
      name: casino.name,
      plataforma: casino.plataforma,
      imageUrl: casino.imageUrl || '/placeholder-casino.svg',
      potencial: casino.potencial,
      position: casino.topThreePosition || 0
    }))

  // Casino CRUD operations
  const createCasino = async (casinoData: Omit<CasinoWithFields, 'id' | 'createdAt' | 'updatedAt'>): Promise<CasinoWithFields> => {
    try {
      console.log('🆕 Creando casino:', casinoData.name)
      
      // Convertir datos del frontend al formato de la API
      const apiData = {
        name: casinoData.name,
        logo: casinoData.logo,
        plataforma: casinoData.plataforma,
        tiempo: casinoData.tiempo,
        potencial_value: casinoData.potencial?.value,
        potencial_color: casinoData.potencial?.color,
        potencial_label: casinoData.potencial?.label,
        similar: casinoData.similar,
        is_top_three: casinoData.isTopThree,
        top_three_position: casinoData.topThreePosition,
        image_url: casinoData.imageUrl
      }
      
      const response = await apiCall('/api/casinos', {
        method: 'POST',
        body: JSON.stringify(apiData)
      })
      
      if (response.success) {
        const newCasino = response.data
        setCasinos(prev => [...prev, newCasino])
        console.log('✅ Casino creado exitosamente:', newCasino.name)
        return newCasino
      }
      
      throw new Error(response.error || 'Error creating casino')
    } catch (error) {
      console.error('❌ Error creating casino:', error)
      throw error
    }
  }

  const updateCasino = async (id: string, updates: Partial<CasinoWithFields>): Promise<CasinoWithFields> => {
    try {
      console.log('📝 Actualizando casino:', id)
      
      // Convertir actualizaciones al formato de la API
      const apiUpdates: any = {}
      if (updates.name !== undefined) apiUpdates.name = updates.name
      if (updates.logo !== undefined) apiUpdates.logo = updates.logo
      if (updates.plataforma !== undefined) apiUpdates.plataforma = updates.plataforma
      if (updates.tiempo !== undefined) apiUpdates.tiempo = updates.tiempo
      if (updates.potencial?.value !== undefined) apiUpdates.potencial_value = updates.potencial.value
      if (updates.potencial?.color !== undefined) apiUpdates.potencial_color = updates.potencial.color
      if (updates.potencial?.label !== undefined) apiUpdates.potencial_label = updates.potencial.label
      if (updates.similar !== undefined) apiUpdates.similar = updates.similar
      if (updates.isTopThree !== undefined) apiUpdates.is_top_three = updates.isTopThree
      if (updates.topThreePosition !== undefined) apiUpdates.top_three_position = updates.topThreePosition
      if (updates.imageUrl !== undefined) apiUpdates.image_url = updates.imageUrl
      
      const response = await apiCall(`/api/casinos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(apiUpdates)
      })
      
      if (response.success) {
        const updatedCasino = response.data
        setCasinos(prev => prev.map(c => c.id === id ? updatedCasino : c))
        console.log('✅ Casino actualizado exitosamente:', updatedCasino.name)
        return updatedCasino
      }
      
      throw new Error(response.error || 'Error updating casino')
    } catch (error) {
      console.error('❌ Error updating casino:', error)
      throw error
    }
  }

  const deleteCasino = async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Eliminando casino:', id)
      
      const response = await apiCall(`/api/casinos/${id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        const deletedCasino = casinos.find(c => c.id === id)
        setCasinos(prev => prev.filter(c => c.id !== id))
        
        // Actualizar config si era top three
        if (deletedCasino?.isTopThree) {
          setConfig(prev => ({
            ...prev,
            topThreeIds: prev.topThreeIds.filter(cId => cId !== id)
          }))
        }
        
        console.log('✅ Casino eliminado exitosamente:', deletedCasino?.name)
      } else {
        throw new Error(response.error || 'Error deleting casino')
      }
    } catch (error) {
      console.error('❌ Error deleting casino:', error)
      throw error
    }
  }

  // Top three operations
  const setTopThree = async (casinoIds: string[]): Promise<void> => {
    try {
      console.log('👑 Actualizando top 3:', casinoIds)
      
      const response = await apiCall('/api/casinos/top-three', {
        method: 'PUT',
        body: JSON.stringify({ casinoIds })
      })
      
      if (response.success) {
        // Actualizar estado local
        setCasinos(prev => prev.map(casino => ({
          ...casino,
          isTopThree: casinoIds.includes(casino.id),
          topThreePosition: casinoIds.includes(casino.id) 
            ? casinoIds.indexOf(casino.id) + 1 
            : undefined
        })))
        
        setConfig(prev => ({ ...prev, topThreeIds: casinoIds }))
        console.log('✅ Top 3 actualizado exitosamente')
      } else {
        throw new Error(response.error || 'Error updating top three')
      }
    } catch (error) {
      console.error('❌ Error updating top three:', error)
      throw error
    }
  }

  const updateTopThreeImage = async (casinoId: string, imageUrl: string): Promise<void> => {
    try {
      console.log('🖼️ Actualizando imagen de casino top 3:', casinoId)
      
      const response = await apiCall('/api/casinos/top-three', {
        method: 'PATCH',
        body: JSON.stringify({ casinoId, imageUrl })
      })
      
      if (response.success) {
        // Actualizar estado local
        setCasinos(prev => prev.map(casino => 
          casino.id === casinoId 
            ? { ...casino, imageUrl }
            : casino
        ))
        console.log('✅ Imagen actualizada exitosamente')
      } else {
        throw new Error(response.error || 'Error updating image')
      }
    } catch (error) {
      console.error('❌ Error updating image:', error)
      throw error
    }
  }

  // Field configuration
  const addCustomField = async (fieldData: Omit<CasinoField, 'id' | 'created_at' | 'updated_at'>): Promise<CasinoField> => {
    try {
      console.log('🆕 Creando campo personalizado:', fieldData.name)
      
      const response = await apiCall('/api/casinos/config', {
        method: 'POST',
        body: JSON.stringify(fieldData)
      })
      
      if (response.success) {
        const newField = response.data
        setConfig(prev => ({
          ...prev,
          customFields: [...prev.customFields, newField]
        }))
        console.log('✅ Campo personalizado creado exitosamente:', newField.name)
        return newField
      }
      
      throw new Error(response.error || 'Error creating field')
    } catch (error) {
      console.error('❌ Error creating field:', error)
      throw error
    }
  }

  const updateCustomField = async (fieldId: string, updates: Partial<CasinoField>): Promise<CasinoField> => {
    try {
      console.log('📝 Actualizando campo personalizado:', fieldId)
      
      const response = await apiCall(`/api/casinos/fields/${fieldId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      
      if (response.success) {
        const updatedField = response.data
        setConfig(prev => ({
          ...prev,
          customFields: prev.customFields.map(f => f.id === fieldId ? updatedField : f)
        }))
        console.log('✅ Campo personalizado actualizado exitosamente:', updatedField.name)
        return updatedField
      }
      
      throw new Error(response.error || 'Error updating field')
    } catch (error) {
      console.error('❌ Error updating field:', error)
      throw error
    }
  }

  const deleteCustomField = async (fieldId: string): Promise<void> => {
    try {
      console.log('🗑️ Eliminando campo personalizado:', fieldId)
      
      const response = await apiCall(`/api/casinos/fields/${fieldId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        const deletedField = config.customFields.find(f => f.id === fieldId)
        
        setConfig(prev => ({
          ...prev,
          customFields: prev.customFields.filter(f => f.id !== fieldId)
        }))
        
        // Remover valores de este campo de todos los casinos
        setCasinos(prev => prev.map(casino => ({
          ...casino,
          customFields: casino.customFields.filter(cf => cf.fieldId !== fieldId)
        })))
        
        console.log('✅ Campo personalizado eliminado exitosamente:', deletedField?.name)
      } else {
        throw new Error(response.error || 'Error deleting field')
      }
    } catch (error) {
      console.error('❌ Error deleting field:', error)
      throw error
    }
  }

  const reorderFields = async (fieldIds: string[]): Promise<void> => {
    try {
      console.log('📋 Reordenando campos personalizados')
      
      const response = await apiCall('/api/casinos/config', {
        method: 'PUT',
        body: JSON.stringify({ fieldIds })
      })
      
      if (response.success) {
        // Reordenar campos en el estado local
        const reorderedFields = fieldIds.map((id, index) => ({
          ...config.customFields.find(f => f.id === id)!,
          display_order: index + 1
        }))
        
        setConfig(prev => ({
          ...prev,
          customFields: reorderedFields
        }))
        
        console.log('✅ Campos reordenados exitosamente')
      } else {
        throw new Error(response.error || 'Error reordering fields')
      }
    } catch (error) {
      console.error('❌ Error reordering fields:', error)
      throw error
    }
  }

  const refreshData = async (): Promise<void> => {
    await loadData()
  }

  const clearError = (): void => {
    setError(null)
  }

  return {
    casinos,
    topThree,
    config,
    isLoading,
    error,
    createCasino,
    updateCasino, 
    deleteCasino,
    setTopThree,
    updateTopThreeImage,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    reorderFields,
    refreshData,
    clearError
  }
}