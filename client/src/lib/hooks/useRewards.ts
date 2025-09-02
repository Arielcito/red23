"use client"

import { useState, useEffect } from "react"

export interface Winner {
  id: string
  name: string
  avatar?: string
  prize: string
  date: Date
  type: 'daily' | 'monthly'
}

interface UseRewardsReturn {
  nextDailyPrize: Date
  nextMonthlyPrize: Date
  recentWinners: Winner[]
  isLoading: boolean
}

export function useRewards(): UseRewardsReturn {
  const [recentWinners, setRecentWinners] = useState<Winner[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const generateMockWinners = (): Winner[] => {
    const names = [
      "Carlos M.",
      "Ana L.",
      "Miguel R.",
      "Sofia T.",
      "Roberto K.",
      "Elena P.",
      "Diego F.",
      "Carmen S."
    ]

    const prizes = [
      "$500 USD",
      "$1,000 USD", 
      "$250 USD",
      "iPhone 15",
      "$750 USD",
      "MacBook Air"
    ]

    const winners: Winner[] = []
    const today = new Date()

    for (let i = 0; i < 3; i++) {
      const winnerDate = new Date(today)
      winnerDate.setDate(winnerDate.getDate() - i)

      const randomName = names[Math.floor(Math.random() * names.length)]
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)]

      winners.push({
        id: `winner-${i}`,
        name: randomName,
        prize: randomPrize,
        date: winnerDate,
        type: i === 2 ? 'monthly' : 'daily'
      })
    }

    return winners.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  useEffect(() => {
    const loadWinners = async () => {
      setIsLoading(true)
      
      setTimeout(() => {
        const mockWinners = generateMockWinners()
        setRecentWinners(mockWinners)
        setIsLoading(false)
      }, 500)
    }

    loadWinners()
  }, [])

  return {
    nextDailyPrize: getNextDailyPrize(),
    nextMonthlyPrize: getNextMonthlyPrize(),
    recentWinners,
    isLoading
  }
}