import { useState } from 'react'

export interface GenerateImageRequest {
  prompt: string
  images?: string[]
}

export interface GeneratedImageResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async (request: GenerateImageRequest): Promise<GeneratedImageResponse> => {
    if (!request.prompt.trim()) {
      return { success: false, error: 'El prompt es obligatorio' }
    }

    setIsGenerating(true)
    setError(null)

    try {
      console.log('🎨 Generando imagen con prompt:', request.prompt)
      
      const response = await fetch('https://imagesgeneratorapi-219275077232.us-central1.run.app/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'PpIaCbhaKLsMaJ659upB51zlG51LesQ9aX5cjoqlePew5mDWW1pH17Q0M76lBuo2'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          images: request.images || []
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error en la generación de imagen:', errorText)
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Imagen generada exitosamente')
      
      return { 
        success: true, 
        imageUrl: data.image_url || data.imageUrl || data.url 
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('❌ Error generando imagen:', errorMessage)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateImage,
    isGenerating,
    error,
    clearError: () => setError(null)
  }
}