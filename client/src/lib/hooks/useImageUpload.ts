import { useState, useCallback } from 'react'
import { uploadImageRequestSchema } from '@/lib/validations/imageUpload'
import type {
  UploadImageRequest,
  UploadImageResponse,
  ImageUploadHook
} from '@/lib/types/imageGeneration'

export const useImageUpload = (): ImageUploadHook => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImages = useCallback(async (request: UploadImageRequest): Promise<UploadImageResponse> => {
    try {
      console.log('📤 Iniciando upload de imágenes:', {
        filesCount: request.files.length,
        user_email: request.user_email,
        hasTitle: !!request.title
      })

      // Validar la entrada usando Zod
      const validatedRequest = uploadImageRequestSchema.parse(request)
      
      setIsUploading(true)
      setError(null)

      // Crear FormData para enviar archivos
      const formData = new FormData()
      
      validatedRequest.files.forEach((file) => {
        formData.append('files', file)
      })
      
      formData.append('user_email', validatedRequest.user_email)
      
      if (validatedRequest.title) {
        formData.append('title', validatedRequest.title)
      }
      
      if (validatedRequest.description) {
        formData.append('description', validatedRequest.description)
      }
      
      if (validatedRequest.tags) {
        formData.append('tags', validatedRequest.tags)
      }

      console.log('🌐 Enviando archivos a la API /upload')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Error en la respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })

        let errorMessage = 'Error en la subida de imágenes'
        
        try {
          const parsedError = JSON.parse(errorData)
          errorMessage = parsedError.error || errorMessage
        } catch {
          if (response.status === 413) {
            errorMessage = 'Archivo demasiado grande. Máximo permitido: 10MB por imagen'
          } else if (response.status >= 500) {
            errorMessage = 'Error interno del servidor, intenta más tarde'
          }
        }

        throw new Error(`${errorMessage} (${response.status})`)
      }

      const data: UploadImageResponse = await response.json()
      
      console.log('📦 Respuesta de upload recibida:', {
        success: data.success,
        imagesCount: data.data?.images?.length || 0,
        message: data.data?.message
      })

      if (!data.success) {
        throw new Error(data.error || 'Error desconocido en el upload')
      }

      console.log('✅ Imágenes subidas exitosamente:', {
        totalImages: data.data?.images?.length || 0,
        message: data.data?.message
      })

      return data

    } catch (err) {
      let errorMessage = 'Error desconocido en la subida de imágenes'

      if (err instanceof Error) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Error de conexión, verifica tu conexión a internet'
        } else {
          errorMessage = err.message
        }
      }

      console.error('❌ Error subiendo imágenes:', {
        error: err,
        message: errorMessage
      })

      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsUploading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploadImages,
    isUploading,
    error,
    clearError
  }
}