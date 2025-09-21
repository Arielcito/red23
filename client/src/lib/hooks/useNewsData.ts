"use client"

import { useState, useEffect, useCallback } from 'react'
import type { NewsFormatted } from '@/lib/supabase/types'

export interface NewsDataHook {
  // Public data
  featuredNews: NewsFormatted[]
  recentNews: NewsFormatted[]
  allNews: NewsFormatted[]
  // State
  isLoading: boolean
  error: string | null
  // Operations
  refreshNews: () => Promise<void>
  getNewsByCategory: (category: string) => Promise<NewsFormatted[]>
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

export function useNewsData(): NewsDataHook {
  const [featuredNews, setFeaturedNews] = useState<NewsFormatted[]>([])
  const [recentNews, setRecentNews] = useState<NewsFormatted[]>([])
  const [allNews, setAllNews] = useState<NewsFormatted[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all news data
  const loadNews = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📰 Cargando datos de noticias desde API...')
      
      // Load featured, recent, and all news in parallel
      const [featuredResponse, recentResponse, allResponse] = await Promise.all([
        apiCall('/api/news?featured=true'),
        apiCall('/api/news?limit=6'),
        apiCall('/api/news')
      ])
      
      if (featuredResponse.success) {
        setFeaturedNews(featuredResponse.data)
        console.log('✅ Noticias destacadas cargadas:', featuredResponse.data.length)
      }
      
      if (recentResponse.success) {
        setRecentNews(recentResponse.data)
        console.log('✅ Noticias recientes cargadas:', recentResponse.data.length)
      }
      
      if (allResponse.success) {
        setAllNews(allResponse.data)
        console.log('✅ Todas las noticias cargadas:', allResponse.data.length)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading news data'
      setError(errorMessage)
      console.error('❌ Error cargando datos de noticias:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load data on initialization
  useEffect(() => {
    loadNews()
  }, [loadNews])

  // Get news by category
  const getNewsByCategory = async (category: string): Promise<NewsFormatted[]> => {
    try {
      console.log(`📂 Obteniendo noticias de categoría: ${category}`)
      
      const response = await apiCall(`/api/news?category=${encodeURIComponent(category)}`)
      
      if (response.success) {
        console.log(`✅ ${response.data.length} noticias de categoría ${category} obtenidas`)
        return response.data
      }
      
      throw new Error(response.error || 'Error getting news by category')
    } catch (error) {
      console.error('❌ Error getting news by category:', error)
      throw error
    }
  }

  const refreshNews = async (): Promise<void> => {
    await loadNews()
  }

  const clearError = (): void => {
    setError(null)
  }

  return {
    featuredNews,
    recentNews,
    allNews,
    isLoading,
    error,
    refreshNews,
    getNewsByCategory,
    clearError
  }
}