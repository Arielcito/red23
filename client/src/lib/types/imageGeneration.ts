// Tipos para la generación de imágenes
export interface GenerateImageRequest {
  prompt: string
  images?: string[]
  logo?: string
  position?: number
  tokens?: number
  user_email?: string
  aspect_ratio?: "9:16" | "16:9" | "1:1"
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
  position: number | null
  prompt: string
  result: string
  result_with_logo: string | null
  user_email?: string
  tokens?: number
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

// Tipos para el endpoint GET /images
export interface GetImagesRequest {
  user_email?: string
  limit?: number
  start_date?: string // YYYY-MM-DD
  end_date?: string   // YYYY-MM-DD
}

export interface ImageRecord {
  id: number
  created_at: string
  logo: string | null
  prompt: string
  request_id: string
  result: string
  result_with_logo: string | null
  tokens: number
  user_email: string
}

export interface GetImagesResponse {
  count: number
  data: ImageRecord[]
  end_date: string | null
  limit: number
  start_date: string | null
  status: string
}

// Tipos para el endpoint GET /winners
export interface GetWinnersRequest {
  date?: string // YYYY-MM-DD
}

export interface WinnerRecord {
  id: number
  first_name: string
  message: string | null
  user_id: number
  username: string | null
  won_at: string
}

export interface GetWinnersResponse {
  data: WinnerRecord[]
  status: string
}

// Hook types para las nuevas funcionalidades
export interface ImagesApiHook {
  images: ImageRecord[]
  isLoading: boolean
  error: string | null
  getImages: (params?: GetImagesRequest) => Promise<GetImagesResponse | null>
  refreshImages: () => Promise<void>
  clearError: () => void
}

export interface WinnersApiHook {
  winners: WinnerRecord[]
  isLoading: boolean
  error: string | null
  getWinners: (params?: GetWinnersRequest) => Promise<GetWinnersResponse | null>
  refreshWinners: () => Promise<void>
  clearError: () => void
}

// Tipos para telegram_members
export interface TelegramMemberRecord {
  user_id: number
  first_name: string
  last_name: string | null
  username: string | null
  joined_at: string
  is_active: boolean
}

export interface GetTelegramMembersRequest {
  is_active?: boolean
  limit?: number
  offset?: number
}

export interface GetTelegramMembersResponse {
  data: TelegramMemberRecord[]
  total: number
  limit: number
  offset: number
  status: string
}

export interface TelegramMembersApiHook {
  members: TelegramMemberRecord[]
  isLoading: boolean
  error: string | null
  getMembers: (params?: GetTelegramMembersRequest) => Promise<GetTelegramMembersResponse | null>
  refreshMembers: () => Promise<void>
  clearError: () => void
}

// Tipos para upload de imágenes
export interface UploadImageRequest {
  files: File[]
  user_email: string
  title?: string
  description?: string
  tags?: string
}

export interface UploadedImageInfo {
  id: number
  filename: string
  url: string
  size: number
  type: string
  created_at: string
}

export interface UploadImageResponse {
  success: boolean
  data?: {
    message: string
    images: UploadedImageInfo[]
    metadata: {
      title?: string
      description?: string
      tags: string[]
    }
  }
  error?: string
}

export interface ImageUploadHook {
  uploadImages: (request: UploadImageRequest) => Promise<UploadImageResponse>
  isUploading: boolean
  error: string | null
  clearError: () => void
}
