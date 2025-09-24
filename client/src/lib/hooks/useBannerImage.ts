import { useState, useEffect, useCallback } from 'react'
import type { RewardImages } from '@/lib/supabase/types'

interface UseBannerImageReturn {
  bannerImage: string | null
  isLoading: boolean
  error: string | null
}

export function useBannerImage(imageId?: number | null): UseBannerImageReturn {
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBannerImage = useCallback(async () => {
    if (!imageId) {
      setBannerImage(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🖼️ Fetching banner image:', imageId)
      
      const response = await fetch(`/api/admin/rewards/images/${imageId}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch banner image')
      }

      const image = result.data as RewardImages
      
      console.log('✅ Loaded banner image:', image.name)
      setBannerImage(image.image_url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banner image'
      console.error('❌ Error fetching banner image:', errorMessage)
      setError(errorMessage)
      setBannerImage(null)
    } finally {
      setIsLoading(false)
    }
  }, [imageId])

  useEffect(() => {
    fetchBannerImage()
  }, [fetchBannerImage])

  return {
    bannerImage,
    isLoading,
    error
  }
}
