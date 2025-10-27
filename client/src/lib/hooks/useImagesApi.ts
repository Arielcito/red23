import { useState, useCallback, useEffect } from 'react'
import type {
  GetImagesRequest,
  GetImagesResponse,
  ImageRecord,
  ImagesApiHook
} from '@/lib/types/imageGeneration'
import { useUser } from './useUser'

// Función para construir URL de Google Storage basada en request_id
const buildStorageUrl = (requestId: string, withLogo: boolean = false): string => {
  const baseUrl = 'https://storage.googleapis.com/stories_ia'
  return withLogo ? `${baseUrl}/${requestId}.png` : `${baseUrl}/${requestId}.png`
}

// Función para procesar imágenes de la API y asegurar URLs correctas
const processApiImages = (images: ImageRecord[]): ImageRecord[] => {
  return images.map(image => ({
    ...image,
    // Asegurar que las URLs usen el patrón correcto
    result: image.result || buildStorageUrl(image.request_id, false),
    result_with_logo: image.result_with_logo || buildStorageUrl(image.request_id, true)
  }))
}

export const useImagesApi = (): ImagesApiHook => {
  const [images, setImages] = useState<ImageRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading: isUserLoading } = useUser()

  const userEmail = user?.email?.trim()

  const getImages = useCallback(async (params?: GetImagesRequest): Promise<GetImagesResponse | null> => {
    try {
      console.log('🔄 Obteniendo imágenes desde Supabase:', params)

      setIsLoading(true)
      setError(null)

      // Construir query params
      const queryParams = new URLSearchParams()
      const effectiveUserEmail = params?.user_email || userEmail || ''
      if (effectiveUserEmail) {
        queryParams.append('user_email', effectiveUserEmail)
      }
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)

      const queryString = queryParams.toString()
      const url = `/api/images${queryString ? `?${queryString}` : ''}`

      console.log('🌐 URL de consulta local:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error en la respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })

        let errorMessage = 'Error al obtener las imágenes'
        if (response.status === 401) {
          errorMessage = 'Error de autenticación con la API'
        } else if (response.status >= 500) {
          errorMessage = 'Error interno del servidor, intenta más tarde'
        }

        throw new Error(`${errorMessage} (${response.status})`)
      }

      const data: GetImagesResponse = await response.json()
      
      console.log('📦 Respuesta de imágenes recibida:', {
        count: data.count,
        status: data.status,
        imagesCount: data.data?.length || 0
      })

      if (data.status !== 'success') {
        throw new Error('La API retornó un estado de error')
      }

      // Procesar imágenes para asegurar URLs correctas
      const processedImages = processApiImages(data.data || [])

      const hasCustomFilters = Boolean(params && (params.limit || params.start_date || params.end_date))

      // Actualizar estado local solo cuando estamos haciendo la consulta principal para el usuario actual
      if (!hasCustomFilters) {
        setImages(processedImages)
      }

      console.log('✅ Imágenes obtenidas exitosamente:', data.data?.length || 0)
      return data

    } catch (err) {
      let errorMessage = 'Error desconocido al obtener imágenes'

      if (err instanceof Error) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Error de conexión, verifica tu conexión a internet'
        } else {
          errorMessage = err.message
        }
      }

      console.error('❌ Error obteniendo imágenes:', {
        error: err,
        message: errorMessage
      })

      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [userEmail])

  const refreshImages = useCallback(async (): Promise<void> => {
    if (!userEmail) {
      console.warn('⚠️ refreshImages: se intentó cargar imágenes sin email de usuario')
      setImages([])
      return
    }

    await getImages({ user_email: userEmail })
  }, [getImages, userEmail])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Cargar imágenes iniciales al montar el componente
  useEffect(() => {
    if (!isUserLoading) {
      refreshImages()
    }
  }, [refreshImages, isUserLoading])

  return {
    images,
    isLoading,
    error,
    getImages,
    refreshImages,
    clearError
  }
}
