import { useState, useEffect, useCallback } from 'react'
import type { RewardImages } from '@/lib/supabase/types'

export interface UploadImageData {
  file: File
  name: string
  description?: string
  imageType: 'winner_avatar' | 'banner_image' | 'prize_image'
  uploadedBy?: string
}

interface UseRewardImagesReturn {
  images: RewardImages[]
  isLoading: boolean
  isUploading: boolean
  error: string | null
  uploadImage: (data: UploadImageData) => Promise<void>
  updateImage: (id: number, updates: Partial<RewardImages>) => Promise<void>
  deleteImage: (id: number) => Promise<void>
  refetch: () => Promise<void>
  clearError: () => void
}

export function useRewardImages(imageType?: string): UseRewardImagesReturn {
  const [images, setImages] = useState<RewardImages[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📋 Fetching reward images:', { imageType })
      
      // Construir query params
      const queryParams = new URLSearchParams()
      if (imageType) queryParams.append('type', imageType)
      
      const queryString = queryParams.toString()
      const url = `/api/admin/rewards/images${queryString ? `?${queryString}` : ''}`
      
      const response = await fetch(url)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch images')
      }

      console.log(`✅ Loaded ${result.data.images.length} reward images`)
      setImages(result.data.images)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images'
      console.error('❌ Error fetching reward images:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [imageType])

  const uploadImage = useCallback(async (data: UploadImageData) => {
    try {
      setIsUploading(true)
      setError(null)
      
      console.log('📤 Uploading reward image:', data.name)
      
      // Crear FormData para el upload
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('name', data.name)
      formData.append('imageType', data.imageType)
      
      if (data.description) {
        formData.append('description', data.description)
      }
      
      if (data.uploadedBy) {
        formData.append('uploadedBy', data.uploadedBy)
      }

      const response = await fetch('/api/admin/rewards/images', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to upload image')
      }

      console.log('✅ Image uploaded successfully:', result.data.id)
      
      // Refrescar la lista de imágenes
      await fetchImages()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      console.error('❌ Error uploading image:', errorMessage)
      setError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [fetchImages])

  const updateImage = useCallback(async (id: number, updates: Partial<RewardImages>) => {
    try {
      setError(null)
      
      console.log('📝 Updating reward image:', id, updates)
      
      const response = await fetch(`/api/admin/rewards/images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update image')
      }

      console.log('✅ Updated image:', result.data.id)
      
      // Actualizar imagen en el estado local
      setImages(prev => 
        prev.map(img => 
          img.id === id ? result.data : img
        )
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update image'
      console.error('❌ Error updating image:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }, [])

  const deleteImage = useCallback(async (id: number) => {
    try {
      setError(null)
      
      console.log('🗑️ Deleting reward image:', id)
      
      const response = await fetch(`/api/admin/rewards/images/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete image')
      }

      console.log('✅ Deleted image:', id)
      
      // Remover imagen del estado local
      setImages(prev => prev.filter(img => img.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image'
      console.error('❌ Error deleting image:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  return {
    images,
    isLoading,
    isUploading,
    error,
    uploadImage,
    updateImage,
    deleteImage,
    refetch: fetchImages,
    clearError
  }
}