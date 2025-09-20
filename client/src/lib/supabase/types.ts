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