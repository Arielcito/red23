"use client"

import { useState, useCallback, useEffect } from 'react'
import type { CasinoWithFields, TopCasino } from '@/lib/supabase/types'
import { CASINO_PRECIO_VALUES } from '@/lib/supabase/types'

// Mock data for development/fallback
const mockCasinos: CasinoWithFields[] = [
  {
    id: "mock-1",
    casinoName: "Bet365",
    logo: null,
    antiguedad: "5 años",
    precio: "muy barato",
    rtp: 96.5,
    platSimilar: "William Hill",
    position: 1,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-2",
    casinoName: "888 Casino",
    logo: null,
    antiguedad: "3 años",
    precio: "barato",
    rtp: 97.2,
    platSimilar: "Paddy Power",
    position: 2,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-3",
    casinoName: "LeoVegas",
    logo: null,
    antiguedad: "7 años",
    precio: "medio",
    rtp: 95.8,
    platSimilar: "Casumo",
    position: 3,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-4",
    casinoName: "Unibet",
    logo: null,
    antiguedad: "4 años",
    precio: "barato",
    rtp: 96.1,
    platSimilar: "Betsson",
    position: null,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-5",
    casinoName: "Bwin",
    logo: null,
    antiguedad: "2 años",
    precio: "muy barato",
    rtp: 97.8,
    platSimilar: "Bet-at-home",
    position: 4,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-6",
    casinoName: "Royal Panda",
    logo: null,
    antiguedad: "6 años",
    precio: "medio",
    rtp: 94.5,
    platSimilar: "Guts",
    position: null,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-7",
    casinoName: "Vegas Hero",
    logo: null,
    antiguedad: "1 año",
    precio: "barato",
    rtp: 96.8,
    platSimilar: "Thrills",
    position: null,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-8",
    casinoName: "Mr Green",
    logo: null,
    antiguedad: "8 años",
    precio: "muy barato",
    rtp: 98.1,
    platSimilar: "Casino Euro",
    position: 5,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-9",
    casinoName: "ComeOn",
    logo: null,
    antiguedad: "3 años",
    precio: "muy barato",
    rtp: 97.5,
    platSimilar: "Mobilebet",
    position: 6,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-10",
    casinoName: "Next Casino",
    logo: null,
    antiguedad: "2 años",
    precio: "medio",
    rtp: 95.2,
    platSimilar: "VideoSlots",
    position: null,
    imageUrl: "/placeholder-casino.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Updated hook types for simplified casino management
export interface CasinosDataHook {
  casinos: CasinoWithFields[]
  topThree: TopCasino[]
  isLoading: boolean
  error: string | null
  // Casino operations
  createCasino: (casino: Omit<CasinoWithFields, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CasinoWithFields>
  updateCasino: (id: string, updates: Partial<CasinoWithFields>) => Promise<CasinoWithFields>
  deleteCasino: (id: string) => Promise<void>
  // Top three operations
  updateTopThreeImage: (casinoId: string, imageUrl: string) => Promise<void>
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos reales desde la API o usar mock como fallback
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🎰 Cargando datos de casinos desde API...')

      try {
        // Cargar solo casinos
        const casinosResponse = await apiCall('/api/casinos')

        if (casinosResponse.success && casinosResponse.data.length > 0) {
          setCasinos(casinosResponse.data)
          console.log('✅ Casinos cargados desde API:', casinosResponse.data.length)
        } else {
          throw new Error('No hay datos de casinos disponibles')
        }

      } catch (apiError) {
        console.warn('⚠️ API no disponible, usando datos de mock para desarrollo:', apiError)

        // Simular tiempo de carga para datos de mock
        await new Promise(resolve => setTimeout(resolve, 500))

        setCasinos(mockCasinos)
        console.log('✅ Datos de mock cargados:', mockCasinos.length)
      }

    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Calcular Top 3 dinámicamente basado en position
  const topThree: TopCasino[] = casinos
    .filter(casino => casino.position !== null && casino.position !== undefined)
    .sort((a, b) => (a.position || 999) - (b.position || 999))
    .slice(0, 3)
    .map(casino => ({
      id: casino.id,
      casinoName: casino.casinoName,
      antiguedad: casino.antiguedad,
      precio: casino.precio,
      rtp: casino.rtp,
      imageUrl: casino.imageUrl || '/placeholder-casino.svg',
      position: casino.position!
    }))

  // CRUD Operations
  const createCasino = async (casinoData: Omit<CasinoWithFields, 'id' | 'createdAt' | 'updatedAt'>): Promise<CasinoWithFields> => {
    try {
      console.log('🆕 Creando nuevo casino...')
      
      // Convertir datos del frontend al formato de la API
      const apiData = {
        casino_name: casinoData.casinoName,
        logo: casinoData.logo,
        antiguedad: casinoData.antiguedad,
        precio: casinoData.precio,
        rtp: casinoData.rtp,
        plat_similar: casinoData.platSimilar,
        position: casinoData.position,
        image_url: casinoData.imageUrl
      }
      
      const response = await apiCall('/api/casinos', {
        method: 'POST',
        body: JSON.stringify(apiData)
      })
      
      if (response.success) {
        const newCasino = response.data
        setCasinos(prev => [...prev, newCasino])
        console.log('✅ Casino creado exitosamente:', newCasino.casinoName)
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
      if (updates.casinoName !== undefined) apiUpdates.casino_name = updates.casinoName
      if (updates.logo !== undefined) apiUpdates.logo = updates.logo
      if (updates.antiguedad !== undefined) apiUpdates.antiguedad = updates.antiguedad
      if (updates.precio !== undefined) apiUpdates.precio = updates.precio
      if (updates.rtp !== undefined) apiUpdates.rtp = updates.rtp
      if (updates.platSimilar !== undefined) apiUpdates.plat_similar = updates.platSimilar
      if (updates.position !== undefined) apiUpdates.position = updates.position
      if (updates.imageUrl !== undefined) apiUpdates.image_url = updates.imageUrl
      
      const response = await apiCall(`/api/casinos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(apiUpdates)
      })
      
      if (response.success) {
        const updatedCasino = response.data
        setCasinos(prev => prev.map(c => c.id === id ? updatedCasino : c))
        console.log('✅ Casino actualizado exitosamente:', updatedCasino.casinoName)
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
      
      const deletedCasino = casinos.find(c => c.id === id)
      
      const response = await apiCall(`/api/casinos/${id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        setCasinos(prev => prev.filter(c => c.id !== id))
        console.log('✅ Casino eliminado exitosamente:', deletedCasino?.casinoName)
      } else {
        throw new Error(response.error || 'Error deleting casino')
      }
    } catch (error) {
      console.error('❌ Error deleting casino:', error)
      throw error
    }
  }

  const updateTopThreeImage = async (casinoId: string, imageUrl: string): Promise<void> => {
    try {
      console.log('🖼️ Actualizando imagen de casino top 3:', casinoId)
      
      const response = await apiCall('/api/casinos/top-three', {
        method: 'PATCH',
        body: JSON.stringify({
          casinoId,
          imageUrl
        })
      })
      
      if (response.success) {
        setCasinos(prev => prev.map(casino => 
          casino.id === casinoId 
            ? { ...casino, imageUrl }
            : casino
        ))
        console.log('✅ Imagen de casino top 3 actualizada')
      } else {
        throw new Error(response.error || 'Error updating top three image')
      }
    } catch (error) {
      console.error('❌ Error updating top three image:', error)
      throw error
    }
  }

  // Utility functions
  const refreshData = useCallback(async () => {
    await loadData()
  }, [loadData])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    casinos,
    topThree,
    isLoading,
    error,
    createCasino,
    updateCasino,
    deleteCasino,
    updateTopThreeImage,
    refreshData,
    clearError
  }
}