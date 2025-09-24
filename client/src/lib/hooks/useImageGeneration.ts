import { useState, useCallback } from 'react'
import { generateImageRequestSchema, externalApiResponseSchema } from '@/lib/validations/imageGeneration'
import { getApiConfig } from '@/lib/config/imageGenerator'
import type {
  GenerateImageRequest,
  GenerateImageResponse,
  ImageGenerationHook,
  ExternalApiResponse
} from '@/lib/types/imageGeneration'

export const useImageGeneration = (): ImageGenerationHook => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = useCallback(async (request: GenerateImageRequest): Promise<GenerateImageResponse> => {
    try {
      // Validar la entrada usando Zod
      const validatedRequest = generateImageRequestSchema.parse(request)
      console.log('🎨 Iniciando generación de imagen con prompt validado:', validatedRequest.prompt)

      setIsGenerating(true)
      setError(null)

      // Obtener configuración de la API
      const apiConfig = getApiConfig()
      console.log('🔧 Usando configuración de API:', {
        baseUrl: apiConfig.baseUrl,
        endpoint: apiConfig.endpoint
      })

      // Crear el controlador de aborto
      const controller = new AbortController()
      console.log('🔧 Creando controlador de aborto:', {
        user_email: validatedRequest.user_email,
        images: validatedRequest.images
      })
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiConfig.authorizationToken
        },
        body: JSON.stringify({
          prompt: validatedRequest.prompt,
          images: validatedRequest.images,
          logo: validatedRequest.logo,
          position: validatedRequest.position,
          tokens: 1,
          user_email: validatedRequest.user_email,
          aspect_ratio: validatedRequest.aspect_ratio
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error en la respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })

        let errorMessage = 'Error en la generación de imagen'
        if (response.status === 401) {
          errorMessage = 'Error de autenticación con la API'
        } else if (response.status === 429) {
          errorMessage = 'Límite de solicitudes excedido, intenta más tarde'
        } else if (response.status >= 500) {
          errorMessage = 'Error interno del servidor, intenta más tarde'
        }

        throw new Error(`${errorMessage} (${response.status})`)
      }

      const data: ExternalApiResponse = await response.json()
      console.log('📦 Respuesta de la API recibida:', {
        status: data.status,
        message: data.message,
        requestId: data.request_id,
        hasResult: !!data.data?.result
      })

      // Validar la respuesta usando Zod
      const validatedResponse = externalApiResponseSchema.parse(data)

      // Extraer la URL de la imagen desde data.result
      const imageUrl = validatedResponse.data.result

      if (!imageUrl) {
        console.error('❌ No se encontró URL de imagen en la respuesta:', {
          data: validatedResponse.data,
          requestId: validatedResponse.request_id
        })
        throw new Error('La API no retornó una URL de imagen válida')
      }

      console.log('✅ Imagen generada exitosamente:', {
        imageUrl,
        requestId: validatedResponse.request_id,
        createdAt: validatedResponse.data.created_at
      })

      return {
        success: true,
        imageUrl
      }

    } catch (err) {
      let errorMessage = 'Error desconocido en la generación de imagen'

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'La solicitud fue cancelada'
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Error de conexión, verifica tu conexión a internet'
        } else {
          errorMessage = err.message
        }
      }

      console.error('❌ Error generando imagen:', {
        error: err,
        message: errorMessage
      })

      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    generateImage,
    isGenerating,
    error,
    clearError
  }
}
