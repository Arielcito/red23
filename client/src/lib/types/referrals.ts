export interface ReferralCode {
  id: number
  userId: string
  referralCode: string
  referredByCode?: string
  referredByUserId?: string
  createdAt: string
  updatedAt: string
}

export interface ReferralTracking {
  id: number
  referrerUserId: string
  referredUserId: string
  referralCode: string
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
  completedAt?: string
}

export interface ReferralStats {
  totalReferrals: number
  pendingReferrals: number
  completedReferrals: number
  myReferralCode: string
}

export interface ReferralData {
  id: number
  referredUserId: string
  referralCode: string
  status: string
  createdAt: string
  completedAt?: string
}

export interface CreateReferralRequest {
  userId: string
  referredByCode?: string
}

export interface ValidateCodeRequest {
  referralCode: string
}

export interface ValidateCodeResponse {
  isValid: boolean
  referralCode: string
}

export interface CustomReferralCodeRequest {
  referralCode: string
}

export interface CodeAvailabilityResponse {
  isAvailable: boolean
  referralCode: string
  error?: string
  suggestions?: string[]
}

export interface UpdateReferralCodeRequest {
  newReferralCode: string
}

export interface UpdateReferralCodeResponse {
  referralCode: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ReferralRegistrationResponse {
  id: number
  referralCode: string
  referredByCode?: string
  message: string
}

export interface MyCodeResponse {
  referralCode: string
  referredByCode?: string
  createdAt: string
}

// Estados del componente de referidos
export interface ReferralComponentState {
  showCodeInput: boolean
  referralCode: string
  isValidating: boolean
  isSubmitting: boolean
  validationError?: string
  submitError?: string
}

// Props para componentes
export interface ReferralCodeDisplayProps {
  code: string
  onCopy?: () => void
  className?: string
}

export interface ReferralStatsProps {
  stats: ReferralStats
  isLoading?: boolean
  className?: string
}

export interface ReferralInputProps {
  onSubmit: (code: string) => Promise<void>
  isLoading?: boolean
  error?: string
  placeholder?: string
  className?: string
}

export interface ReferralCodeEditorProps {
  currentCode: string
  onSave: (newCode: string) => Promise<void>
  onCancel: () => void
  isOpen: boolean
  isLoading?: boolean
  className?: string
}

export interface ReferralListProps {
  referrals: ReferralData[]
  isLoading?: boolean
  className?: string
}

// Hooks return types
export interface UseReferralsReturn {
  stats: ReferralStats | null
  myReferrals: ReferralData[]
  isLoading: boolean
  error: string | null
  validateCode: (code: string) => Promise<boolean>
  registerWithReferral: (referralCode?: string) => Promise<boolean>
  refreshStats: () => Promise<void>
}

export interface UseReferralCodeEditorReturn {
  isEditing: boolean
  newCode: string
  isValidating: boolean
  isSaving: boolean
  validationError: string | null
  isAvailable: boolean | null
  suggestions: string[]
  setNewCode: (code: string) => void
  startEditing: () => void
  cancelEditing: () => void
  saveCode: () => Promise<boolean>
  checkAvailability: (code: string) => Promise<void>
}

// Configuración y constantes
export interface ReferralConfig {
  codeLength: number
  maxValidationAttempts: number
  trackingStatuses: readonly ['pending', 'completed', 'cancelled']
}

export const REFERRAL_CONFIG: ReferralConfig = {
  codeLength: 8,
  maxValidationAttempts: 10,
  trackingStatuses: ['pending', 'completed', 'cancelled'] as const
} as const

// Utilidades de tipo
export type ReferralStatus = typeof REFERRAL_CONFIG.trackingStatuses[number]
export type ReferralFormData = Pick<CreateReferralRequest, 'referredByCode'>

// Errores específicos del sistema de referidos
export class ReferralError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'ReferralError'
  }
}

export const REFERRAL_ERRORS = {
  INVALID_CODE: 'INVALID_CODE',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CODE_ALREADY_EXISTS: 'CODE_ALREADY_EXISTS',
  SELF_REFERRAL: 'SELF_REFERRAL',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED'
} as const

export type ReferralErrorCode = typeof REFERRAL_ERRORS[keyof typeof REFERRAL_ERRORS]