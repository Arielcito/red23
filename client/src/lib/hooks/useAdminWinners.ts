import { useState, useEffect, useCallback } from 'react'
import type { RewardWinner, NewRewardWinner } from '@/lib/supabase/types'

export interface WinnerFilters {
  type?: 'daily' | 'monthly'
  active?: boolean
  page?: number
  limit?: number
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UseAdminWinnersReturn {
  winners: RewardWinner[]
  pagination: PaginationInfo
  isLoading: boolean
  error: string | null
  createWinner: (data: NewRewardWinner) => Promise<void>
  updateWinner: (id: number, data: Partial<RewardWinner>) => Promise<void>
  deleteWinner: (id: number) => Promise<void>
  refetch: (filters?: WinnerFilters) => Promise<void>
  clearError: () => void
}

export function useAdminWinners(initialFilters?: WinnerFilters): UseAdminWinnersReturn {
  const [winners, setWinners] = useState<RewardWinner[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWinners = useCallback(async (filters?: WinnerFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📋 Fetching winners for admin:', filters)
      
      // Construir query params
      const queryParams = new URLSearchParams()
      const page = filters?.page || 1
      const limit = filters?.limit || 20
      
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())
      
      if (filters?.type) queryParams.append('type', filters.type)
      if (filters?.active !== undefined) queryParams.append('active', filters.active.toString())
      
      const response = await fetch(`/api/admin/rewards/winners?${queryParams.toString()}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch winners')
      }

      console.log(`✅ Loaded ${result.data.winners.length} winners for admin`)
      
      setWinners(result.data.winners)
      setPagination(result.data.pagination)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch winners'
      console.error('❌ Error fetching winners:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createWinner = useCallback(async (data: NewRewardWinner) => {
    try {
      setError(null)
      
      console.log('🆕 Creating winner:', data)
      
      const response = await fetch('/api/admin/rewards/winners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create winner')
      }

      console.log('✅ Created winner:', result.data.id)
      
      // Añadir nuevo ganador al estado local
      setWinners(prev => [result.data, ...prev])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create winner'
      console.error('❌ Error creating winner:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }, [])

  const updateWinner = useCallback(async (id: number, data: Partial<RewardWinner>) => {
    try {
      setError(null)
      
      console.log('📝 Updating winner:', id, data)
      
      const response = await fetch(`/api/admin/rewards/winners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update winner')
      }

      console.log('✅ Updated winner:', result.data.id)
      
      // Actualizar ganador en el estado local
      setWinners(prev => 
        prev.map(winner => 
          winner.id === id ? result.data : winner
        )
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update winner'
      console.error('❌ Error updating winner:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }, [])

  const deleteWinner = useCallback(async (id: number) => {
    try {
      setError(null)
      
      console.log('🗑️ Deleting winner:', id)
      
      const response = await fetch(`/api/admin/rewards/winners/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete winner')
      }

      console.log('✅ Deleted winner:', id)
      
      // Remover ganador del estado local
      setWinners(prev => prev.filter(winner => winner.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete winner'
      console.error('❌ Error deleting winner:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    fetchWinners(initialFilters)
  }, [fetchWinners, initialFilters])

  return {
    winners,
    pagination,
    isLoading,
    error,
    createWinner,
    updateWinner,
    deleteWinner,
    refetch: fetchWinners,
    clearError
  }
}