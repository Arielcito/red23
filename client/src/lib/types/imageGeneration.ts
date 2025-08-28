// Tipos para la generación de imágenes
export interface GenerateImageRequest {
  prompt: string
  images?: string[]
}

export interface GenerateImageResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export interface ImageGenerationHook {
  generateImage: (request: GenerateImageRequest) => Promise<GenerateImageResponse>
  isGenerating: boolean
  error: string | null
  clearError: () => void
}

// Tipos para la respuesta de la API externa
export interface ExternalApiResponse {
  image_url?: string
  imageUrl?: string
  url?: string
  error?: string
  success?: boolean
}

// Configuración de la API externa
export interface ApiConfig {
  baseUrl: string
  endpoint: string
  authorizationToken: string
  timeout: number
}
