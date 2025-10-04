"use client"

import { useState, useCallback, useEffect } from 'react'
import type { CasinoWithFields, TopCasino } from '@/lib/supabase/types'
import { CasinoService } from '@/lib/services/casinoService'

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
  reorderCasinos: (reorderedCasinos: CasinoWithFields[]) => Promise<void>
  revertCasinoReorder: () => void
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

  // Cargar datos reales desde la API
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🎰 Cargando datos de casinos desde API...')

      // Cargar solo casinos
      const casinosResponse = await apiCall('/api/casinos')

      if (casinosResponse.success && casinosResponse.data.length > 0) {
        setCasinos(casinosResponse.data)
        console.log('✅ Casinos cargados desde API:', casinosResponse.data.length)
      } else {
        throw new Error('No hay datos de casinos disponibles')
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
      logo: casino.logo,
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

  const reorderCasinos = async (reorderedCasinos: CasinoWithFields[]): Promise<void> => {
    // Actualizar estado local inmediatamente (optimista)
    setCasinos(reorderedCasinos)

    try {
      console.log('🔄 Reordenando casinos...')

      // Crear el payload con las nuevas posiciones
      const reorderData = reorderedCasinos.map((casino, index) => ({
        id: casino.id,
        position: index + 1
      }))

      const response = await apiCall('/api/casinos/reorder', {
        method: 'POST',
        body: JSON.stringify({ casinos: reorderData })
      })

      if (response.success) {
        console.log('✅ Casinos reordenados exitosamente')
      } else {
        throw new Error(response.error || 'Error reordering casinos')
      }
    } catch (error) {
      console.error('❌ Error reordering casinos:', error)
      // Revertir el estado local en caso de error
      // Como no tenemos el estado anterior aquí, lanzamos el error
      // El componente que llama manejará la reversión
      throw error
    }
  }

  // Función para revertir cambios optimistas
  const revertCasinoReorder = useCallback(() => {
    // Recargar datos desde la API para revertir cambios
    loadData()
  }, [loadData])


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
    reorderCasinos,
    revertCasinoReorder,
    refreshData,
    clearError
  }
}
