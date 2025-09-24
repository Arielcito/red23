"use client"

import { useState, useEffect, useCallback } from 'react'
import type { NewsFormatted } from '@/lib/supabase/types'

export interface NewsDetailHook {
  // Data
  article: NewsFormatted | null
  relatedArticles: NewsFormatted[]
  // State
  isLoading: boolean
  error: string | null
  // Operations
  refetch: () => Promise<void>
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

export function useNewsDetail(newsId: string): NewsDetailHook {
  const [article, setArticle] = useState<NewsFormatted | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsFormatted[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load article and related articles
  const loadArticleDetail = useCallback(async () => {
    if (!newsId) return

    try {
      setIsLoading(true)
      setError(null)

      console.log(`📰 Cargando detalles de noticia: ${newsId}`)

      // Load article details
      const articleResponse = await apiCall(`/api/news/${newsId}`)

      if (!articleResponse.success) {
        throw new Error(articleResponse.error || 'Error loading article')
      }

      const articleData = articleResponse.data
      setArticle(articleData)

      console.log('✅ Detalles de noticia cargados:', articleData.title)

      // Load related articles (same category, excluding current article)
      try {
        const relatedResponse = await apiCall(`/api/news?category=${encodeURIComponent(articleData.category)}&limit=4`)

        if (relatedResponse.success) {
          // Filter out current article and limit to 3
          const filteredRelated = relatedResponse.data
            .filter((item: NewsFormatted) => item.id !== articleData.id)
            .slice(0, 3)

          setRelatedArticles(filteredRelated)
          console.log(`✅ ${filteredRelated.length} artículos relacionados cargados`)
        }
      } catch (relatedError) {
        console.warn('⚠️ Error cargando artículos relacionados:', relatedError)
        // Don't fail the whole operation if related articles fail
        setRelatedArticles([])
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading article details'
      setError(errorMessage)
      console.error('❌ Error cargando detalles de noticia:', err)
    } finally {
      setIsLoading(false)
    }
  }, [newsId])

  // Load data on initialization or when newsId changes
  useEffect(() => {
    loadArticleDetail()
  }, [loadArticleDetail])

  const refetch = async (): Promise<void> => {
    await loadArticleDetail()
  }

  const clearError = (): void => {
    setError(null)
  }

  return {
    article,
    relatedArticles,
    isLoading,
    error,
    refetch,
    clearError
  }
}
