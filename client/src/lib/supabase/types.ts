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
  daily_prize_amount: string
  monthly_prize_amount: string
  rules_text?: string | null
}

export interface NewRewardSettings {
  banner_enabled?: boolean
  banner_title?: string
  banner_description?: string
  banner_cta_label?: string
  banner_cta_url?: string
  banner_theme?: 'emerald' | 'indigo' | 'amber'
  daily_prize_amount?: string
  monthly_prize_amount?: string
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

// Base interfaces for casino database tables
export interface Casino {
  id: string
  name: string
  logo?: string | null
  plataforma: string
  tiempo: string
  potencial_value: 'high' | 'medium' | 'low'
  potencial_color: 'green' | 'yellow' | 'red'
  potencial_label: string
  similar?: string | null
  is_top_three: boolean
  top_three_position?: number | null
  image_url?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewCasino {
  name: string
  logo?: string | null
  plataforma: string
  tiempo: string
  potencial_value: 'high' | 'medium' | 'low'
  potencial_color: 'green' | 'yellow' | 'red'
  potencial_label: string
  similar?: string | null
  is_top_three?: boolean
  top_three_position?: number | null
  image_url?: string | null
  is_active?: boolean
}

export interface CasinoField {
  id: string
  name: string
  field_type: 'text' | 'number' | 'badge' | 'percentage'
  is_required: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewCasinoField {
  name: string
  field_type: 'text' | 'number' | 'badge' | 'percentage'
  is_required?: boolean
  display_order?: number
  is_active?: boolean
}

export interface CasinoFieldValue {
  id: string
  casino_id: string
  field_id: string
  text_value?: string | null
  number_value?: number | null
  badge_value?: string | null
  badge_color?: 'red' | 'yellow' | 'green' | null
  badge_label?: string | null
  created_at: string
  updated_at: string
}

export interface NewCasinoFieldValue {
  casino_id: string
  field_id: string
  text_value?: string | null
  number_value?: number | null
  badge_value?: string | null
  badge_color?: 'red' | 'yellow' | 'green' | null
  badge_label?: string | null
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

// Enhanced interfaces for frontend use (matching the existing casino types)
export interface CasinoBadgeValue {
  value: string
  color: 'red' | 'yellow' | 'green'
  label: string
}

export interface CasinoFieldValueFormatted {
  fieldId: string
  fieldName: string
  fieldType: 'text' | 'number' | 'badge' | 'percentage'
  value: string | number | CasinoBadgeValue
}

export interface CasinoWithFields {
  id: string
  name: string
  logo?: string | null
  plataforma: string
  tiempo: string
  potencial: CasinoBadgeValue
  similar?: string | null
  customFields: CasinoFieldValueFormatted[]
  isTopThree: boolean
  topThreePosition?: number | null
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface TopCasino {
  id: string
  name: string
  plataforma: string
  imageUrl: string
  potencial: CasinoBadgeValue
  position: number
}

export interface CasinoConfigFormatted {
  customFields: CasinoField[]
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

export interface CasinoFieldsApiResponse {
  success: boolean
  data: CasinoField[]
}

export interface CasinoConfigApiResponse {
  success: boolean
  data: CasinoConfigFormatted
}

// Default values for casino potential
export const CASINO_POTENCIAL_VALUES: Record<'high' | 'medium' | 'low', CasinoBadgeValue> = {
  high: {
    value: 'high',
    color: 'green',
    label: 'Alto'
  },
  medium: {
    value: 'medium', 
    color: 'yellow',
    label: 'Medio'
  },
  low: {
    value: 'low',
    color: 'red', 
    label: 'Bajo'
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