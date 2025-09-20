import { useState, useEffect } from 'react'
import type { RewardWinner } from '@/lib/supabase/types'

export interface Winner {
  id: string
  name: string
  avatar?: string
  prize: string
  date: Date
  type: 'daily' | 'monthly'
}

interface UseRewardsDataReturn {
  nextDailyPrize: Date
  nextMonthlyPrize: Date
  recentWinners: Winner[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRewardsData(): UseRewardsDataReturn {
  const [recentWinners, setRecentWinners] = useState<Winner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getNextDailyPrize = (): Date => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  const getNextMonthlyPrize = (): Date => {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    nextMonth.setHours(0, 0, 0, 0)
    return nextMonth
  }

  const fetchRewards = async (type?: 'daily' | 'monthly', limit?: number) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📋 Fetching rewards data from API')
      
      // Construir query params
      const queryParams = new URLSearchParams()
      if (type) queryParams.append('type', type)
      if (limit) queryParams.append('limit', limit.toString())
      
      const queryString = queryParams.toString()
      const url = `/api/rewards${queryString ? `?${queryString}` : ''}`
      
      const response = await fetch(url)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch rewards')
      }

      console.log(`✅ Loaded ${result.data.recentWinners.length} winners from API`)
      
      // Transform database winners to frontend format
      const transformedWinners: Winner[] = result.data.recentWinners.map((winner: RewardWinner) => ({
        id: winner.id.toString(),
        name: winner.name,
        avatar: winner.avatar || undefined,
        prize: winner.prize,
        date: new Date(winner.won_at),
        type: winner.type
      }))

      setRecentWinners(transformedWinners)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rewards'
      console.error('❌ Error fetching rewards:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  return {
    nextDailyPrize: getNextDailyPrize(),
    nextMonthlyPrize: getNextMonthlyPrize(),
    recentWinners,
    isLoading,
    error,
    refetch: fetchRewards
  }
}