export interface ImagesGenerator {
  id: number
  created_at: string
  user_email: string
  request_id: string
  prompt: string
  logo?: string | null
  result?: string | null
  result_with_logo?: string | null
  tokens: number
}

export interface NewImagesGenerator {
  user_email: string
  request_id: string
  prompt: string
  logo?: string | null
  result?: string | null
  result_with_logo?: string | null
  tokens?: number
}

export interface TelegramMember {
  user_id: number
  first_name: string
  last_name?: string | null
  username?: string | null
  joined_at?: string | null
  is_active?: boolean | null
}

export interface NewTelegramMember {
  user_id: number
  first_name: string
  last_name?: string | null
  username?: string | null
  is_active?: boolean
}

export interface TelegramWinner {
  id: number
  user_id: number
  first_name: string
  username?: string | null
  won_at?: string | null
  message?: string | null
}

export interface NewTelegramWinner {
  user_id: number
  first_name: string
  username?: string | null
  message?: string | null
}

export interface AutomaticPrompt {
  id: number
  created_at: string
  updated_at: string
  title: string
  content: string
  category: string
  is_active: boolean
  order_index: number
}

export interface NewAutomaticPrompt {
  title: string
  content: string
  category?: string
  is_active?: boolean
  order_index?: number
}

export interface UserReferral {
  id: number
  user_id: string
  referral_code: string
  referred_by_code?: string | null
  referred_by_user_id?: string | null
  created_at: string
  updated_at: string
}

export interface NewUserReferral {
  user_id: string
  referral_code: string
  referred_by_code?: string | null
  referred_by_user_id?: string | null
}

export interface ReferralTracking {
  id: number
  referrer_user_id: string
  referred_user_id: string
  referral_code: string
  status: string
  created_at: string
  completed_at?: string | null
}

export interface NewReferralTracking {
  referrer_user_id: string
  referred_user_id: string
  referral_code: string
  status?: string
  completed_at?: string | null
}

export interface RewardWinner {
  id: number
  created_at: string
  updated_at: string
  name: string
  user_email?: string | null
  avatar?: string | null
  prize: string
  prize_amount?: number | null
  type: 'daily' | 'monthly'
  won_at: string
  is_active: boolean
}

export interface NewRewardWinner {
  name: string
  user_email?: string | null
  avatar?: string | null
  prize: string
  prize_amount?: number | null
  type: 'daily' | 'monthly'
  won_at?: string
  is_active?: boolean
}

export interface RewardSettings {
  id: number
  created_at: string
  updated_at: string
  banner_enabled: boolean
  banner_title: string
  banner_description: string
  banner_cta_label: string
  banner_cta_url: string
  banner_theme: 'emerald' | 'indigo' | 'amber'
  banner_image_id?: number | null
  banner_image_url?: string | null
  banner_use_image?: boolean
  daily_prize_amount: string
  monthly_prize_amount: string
  daily_prize_draw_date?: string | null
  monthly_prize_draw_date?: string | null
  use_custom_dates: boolean
  rules_text?: string | null
}

export interface NewRewardSettings {
  banner_enabled?: boolean
  banner_title?: string
  banner_description?: string
  banner_cta_label?: string
  banner_cta_url?: string
  banner_theme?: 'emerald' | 'indigo' | 'amber'
  banner_image_id?: number | null
  banner_image_url?: string | null
  banner_use_image?: boolean
  daily_prize_amount?: string
  monthly_prize_amount?: string
  daily_prize_draw_date?: string | null
  monthly_prize_draw_date?: string | null
  use_custom_dates?: boolean
  rules_text?: string | null
}

export interface RewardImages {
  id: number
  created_at: string
  updated_at: string
  name: string
  description?: string | null
  image_url: string
  image_type: 'winner_avatar' | 'banner_image' | 'prize_image'
  uploaded_by?: string | null
  is_active: boolean
}

export interface NewRewardImages {
  name: string
  description?: string | null
  image_url: string
  image_type: 'winner_avatar' | 'banner_image' | 'prize_image'
  uploaded_by?: string | null
  is_active?: boolean
}

// =============================================
// CASINO SYSTEM TYPES
// =============================================

// Price options type
export type PrecioValue = 'medio' | 'barato' | 'muy barato'

// Base interfaces for casino database tables
export interface Casino {
  id: string
  casino_name: string
  logo?: string | null
  antiguedad: string
  precio: PrecioValue
  rtp: number
  plat_similar?: string | null
  position?: number | null
  image_url?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewCasino {
  casino_name: string
  logo?: string | null
  antiguedad: string
  precio: PrecioValue
  rtp: number
  plat_similar?: string | null
  position?: number | null
  image_url?: string | null
  is_active?: boolean
}

export interface CasinoConfig {
  id: string
  config_key: string
  config_value: any // JSONB field
  description?: string | null
  created_at: string
  updated_at: string
}

export interface NewCasinoConfig {
  config_key: string
  config_value: any
  description?: string | null
}

// Enhanced interfaces for frontend use
export interface PrecioBadgeValue {
  value: PrecioValue
  color: 'green' | 'yellow' | 'red'
  label: string
}

export interface CasinoWithFields {
  id: string
  casinoName: string
  logo?: string | null
  antiguedad: string
  precio: PrecioValue
  rtp: number
  platSimilar?: string | null
  position?: number | null
  coverImageUrl?: string | null
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface TopCasino {
  id: string
  casinoName: string
  antiguedad: string
  precio: PrecioValue
  rtp: number
  logo?: string | null
  position: number
}

export interface CasinoConfigFormatted {
  topThreeIds: string[]
  settings: Record<string, any>
}

// API Response types
export interface CasinosApiResponse {
  success: boolean
  data: CasinoWithFields[]
  meta?: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface CasinoApiResponse {
  success: boolean
  data: CasinoWithFields
}

export interface CasinoConfigApiResponse {
  success: boolean
  data: CasinoConfigFormatted
}

// Default values for casino price options
export const CASINO_PRECIO_VALUES: Record<PrecioValue, PrecioBadgeValue> = {
  'muy barato': {
    value: 'muy barato',
    color: 'green',
    label: 'Muy Barato'
  },
  'barato': {
    value: 'barato',
    color: 'yellow', 
    label: 'Barato'
  },
  'medio': {
    value: 'medio',
    color: 'red',
    label: 'Medio'
  }
}

// =============================================
// NEWS SYSTEM TYPES  
// =============================================

export interface News {
  id: string
  title: string
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  author: string
  category: string
  is_featured: boolean
  is_published: boolean
  publish_date: string
  created_at: string
  updated_at: string
}

export interface NewNews {
  title: string
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  author?: string
  category?: string
  is_featured?: boolean
  is_published?: boolean
  publish_date?: string
}

// Enhanced interfaces for frontend use
export interface NewsFormatted {
  id: string
  title: string
  excerpt?: string | null
  content?: string | null
  imageUrl?: string | null
  author: string
  category: string
  isFeatured: boolean
  isPublished: boolean
  publishDate: string
  createdAt: string
  updatedAt: string
}

// API Response types
export interface NewsApiResponse {
  success: boolean
  data: NewsFormatted[]
  meta?: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface SingleNewsApiResponse {
  success: boolean
  data: NewsFormatted
}

// =============================================
// LEARNING PATHS SYSTEM TYPES
// =============================================

export interface LearningPath {
  id: string
  title: string
  description: string
  level: 'Cajero' | 'Administrador' | 'Proveedor'
  duration: string
  course_count: number
  icon: string
  color_scheme: 'primary' | 'secondary' | 'tertiary'
  slug: string
  image_url?: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface NewLearningPath {
  title: string
  description: string
  level: 'Cajero' | 'Administrador' | 'Proveedor'
  duration: string
  course_count: number
  icon: string
  color_scheme: 'primary' | 'secondary' | 'tertiary'
  slug: string
  image_url?: string | null
  is_featured?: boolean
  is_active?: boolean
  display_order?: number
}

// Enhanced interfaces for frontend use
export interface LearningPathFormatted {
  id: string
  title: string
  description: string
  level: 'Cajero' | 'Administrador' | 'Proveedor'
  duration: string
  courseCount: number
  icon: string
  colorScheme: 'primary' | 'secondary' | 'tertiary'
  slug: string
  imageUrl?: string | null
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  href: string
}

// API Response types
export interface LearningPathsApiResponse {
  success: boolean
  data: LearningPathFormatted[]
  meta?: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface LearningPathApiResponse {
  success: boolean
  data: LearningPathFormatted
}

// =============================================
// TUTORIAL MODULES AND VIDEOS SYSTEM TYPES
// =============================================

// Base interfaces for tutorial database tables
export interface TutorialModule {
  id: string
  learning_path_id: string
  title: string
  description?: string | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewTutorialModule {
  learning_path_id: string
  title: string
  description?: string | null
  order_index?: number
  is_active?: boolean
}

export interface TutorialVideo {
  id: string
  module_id: string
  title: string
  description?: string | null
  video_url: string
  duration?: string | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewTutorialVideo {
  module_id: string
  title: string
  description?: string | null
  video_url: string
  duration?: string | null
  order_index?: number
  is_active?: boolean
}

// Enhanced interfaces for frontend use
export interface TutorialModuleFormatted {
  id: string
  learningPathId: string
  title: string
  description?: string | null
  order: number
  isActive: boolean
  videos: TutorialVideoFormatted[]
  createdAt: string
  updatedAt: string
}

export interface TutorialVideoFormatted {
  id: string
  title: string
  description?: string | null
  videoUrl: string
  duration?: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Extended Learning Path with modules and videos
export interface LearningPathWithContent extends LearningPathFormatted {
  modules: TutorialModuleFormatted[]
}

// API Response types
export interface TutorialModulesApiResponse {
  success: boolean
  data: TutorialModuleFormatted[]
}

export interface TutorialModuleApiResponse {
  success: boolean
  data: TutorialModuleFormatted
}

export interface TutorialVideosApiResponse {
  success: boolean
  data: TutorialVideoFormatted[]
}

export interface TutorialVideoApiResponse {
  success: boolean
  data: TutorialVideoFormatted
}

export interface LearningPathsWithContentApiResponse {
  success: boolean
  data: LearningPathWithContent[]
}
