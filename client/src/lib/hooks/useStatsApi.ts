import { useState, useCallback, useEffect } from 'react'
import { useImagesApi } from './useImagesApi'
import { useWinnersApi } from './useWinnersApi'
import type { ImageRecord } from '@/lib/types/imageGeneration'

export interface StatsData {
  imagesGenerated: number
  whatsappPosts: number
  galleryItems: number
  monthlyLimit: number
  recentImagesCount: number
  totalTokens: number
}

export interface StatsApiHook {
  stats: StatsData
  isLoading: boolean
  error: string | null
  refreshStats: () => Promise<void>
  clearError: () => void
}

export const useStatsApi = (): StatsApiHook => {
  const [stats, setStats] = useState<StatsData>({
    imagesGenerated: 0,
    whatsappPosts: 0,
    galleryItems: 0,
    monthlyLimit: 500,
    recentImagesCount: 0,
    totalTokens: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { images: apiImages, isLoading: imagesLoading, error: imagesError } = useImagesApi()
  const { winners, isLoading: winnersLoading, error: winnersError } = useWinnersApi()

  const calculateStats = useCallback(async (): Promise<void> => {
    try {
      console.log('📊 Calculando estadísticas desde la API')
      setIsLoading(true)
      setError(null)

      // Calcular estadísticas basadas en las imágenes de la API
      const imagesGenerated = apiImages.length

      // Calcular imágenes recientes (últimos 30 días)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentImages = apiImages.filter(img =>
        new Date(img.created_at) >= thirtyDaysAgo
      )
      const recentImagesCount = recentImages.length

      // Calcular total de tokens usados
      const totalTokens = apiImages.reduce((sum, img) => sum + (img.tokens || 0), 0)

      // Para WhatsApp posts, podríamos calcular basándonos en las imágenes programadas
      // Por ahora usamos un cálculo basado en las imágenes recientes
      const whatsappPosts = Math.floor(recentImagesCount * 0.7) // Asumiendo que 70% de imágenes recientes se usan en WhatsApp

      // Gallery items es el mismo que imagesGenerated por ahora
      const galleryItems = imagesGenerated

      const newStats: StatsData = {
        imagesGenerated,
        whatsappPosts,
        galleryItems,
        monthlyLimit: 500, // Esto podría venir de la API en el futuro
        recentImagesCount,
        totalTokens
      }

      console.log('📊 Estadísticas calculadas:', newStats)
      setStats(newStats)

    } catch (err) {
      let errorMessage = 'Error desconocido al calcular estadísticas'

      if (err instanceof Error) {
        errorMessage = err.message
      }

      console.error('❌ Error calculando estadísticas:', {
        error: err,
        message: errorMessage
      })

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [apiImages])

  const refreshStats = useCallback(async (): Promise<void> => {
    await calculateStats()
  }, [calculateStats])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Calcular estadísticas cuando cambian los datos de la API
  useEffect(() => {
    if (!imagesLoading && !winnersLoading) {
      calculateStats()
    }
  }, [calculateStats, imagesLoading, winnersLoading])

  // Combinar errores de ambas APIs
  useEffect(() => {
    if (imagesError || winnersError) {
      const combinedError = imagesError || winnersError
      setError(combinedError)
    }
  }, [imagesError, winnersError])

  return {
    stats,
    isLoading: isLoading || imagesLoading || winnersLoading,
    error,
    refreshStats,
    clearError
  }
}
