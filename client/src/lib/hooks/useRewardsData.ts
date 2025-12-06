import { useState, useEffect } from 'react'
import type { RewardWinner } from '@/lib/supabase/types'
import { getNextFridayArgentinaTime } from '@/lib/utils/dateHelpers'

export interface Winner {
  id: string
  name: string
  avatar?: string
  prize: string
  date: Date
  type: 'daily' | 'monthly'
}

interface UseRewardsDataReturn {
  nextWeeklyPrize: Date
  weeklyPrizeAmount: string
  recentWinners: Winner[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRewardsData(): UseRewardsDataReturn {
  const [recentWinners, setRecentWinners] = useState<Winner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Hardcodear premio semanal
  const weeklyPrizeAmount = "$1,000 - $3,000 USD"

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
    fetchRewards(undefined, 3)
  }, [])

  return {
    nextWeeklyPrize: getNextFridayArgentinaTime(),
    weeklyPrizeAmount,
    recentWinners,
    isLoading,
    error,
    refetch: fetchRewards
  }
}