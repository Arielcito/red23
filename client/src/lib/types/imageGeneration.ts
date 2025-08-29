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
export interface ExternalApiData {
  created_at: string
  logo: string | null
  position: string | null
  prompt: string
  result: string
  result_with_logo: string | null
}

export interface ExternalApiResponse {
  data: ExternalApiData
  message: string
  request_id: string
  status: string
}

// Configuración de la API externa
export interface ApiConfig {
  baseUrl: string
  endpoint: string
  authorizationToken: string
}
