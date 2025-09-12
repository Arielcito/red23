// Tipos para la comparación de casinos
export interface CasinoField {
  id: string
  name: string
  type: 'text' | 'number' | 'badge' | 'percentage'
  required: boolean
  order: number
}

export interface CasinoBadgeValue {
  value: string
  color: 'red' | 'yellow' | 'green'
  label: string
}

export interface CasinoFieldValue {
  fieldId: string
  value: string | number | CasinoBadgeValue
}

export interface Casino {
  id: string
  name: string
  logo?: string
  // Campos fijos obligatorios
  plataforma: string
  tiempo: string
  potencial: CasinoBadgeValue
  similar: string
  // Campos dinámicos
  customFields: CasinoFieldValue[]
  isTopThree: boolean
  topThreePosition?: number
  imageUrl?: string // Para los top 3
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

export interface CasinoConfig {
  customFields: CasinoField[]
  topThreeIds: string[]
}

// Hook types
export interface CasinosDataHook {
  casinos: Casino[]
  topThree: TopCasino[]
  config: CasinoConfig
  isLoading: boolean
  error: string | null
  // Casino operations
  createCasino: (casino: Omit<Casino, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Casino>
  updateCasino: (id: string, updates: Partial<Casino>) => Promise<Casino>
  deleteCasino: (id: string) => Promise<void>
  // Top three operations
  setTopThree: (casinoIds: string[]) => Promise<void>
  updateTopThreeImage: (casinoId: string, imageUrl: string) => Promise<void>
  // Field configuration
  addCustomField: (field: Omit<CasinoField, 'id'>) => Promise<CasinoField>
  updateCustomField: (fieldId: string, updates: Partial<CasinoField>) => Promise<CasinoField>
  deleteCustomField: (fieldId: string) => Promise<void>
  reorderFields: (fieldIds: string[]) => Promise<void>
  // Utility functions
  refreshData: () => Promise<void>
  clearError: () => void
}

// Default potencial values
export const POTENCIAL_VALUES: Record<'high' | 'medium' | 'low', CasinoBadgeValue> = {
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

// Default field configuration
export const DEFAULT_CUSTOM_FIELDS: CasinoField[] = [
  {
    id: 'bonos',
    name: 'Bonos',
    type: 'text',
    required: false,
    order: 1
  },
  {
    id: 'metodos_pago',
    name: 'Métodos de Pago', 
    type: 'number',
    required: false,
    order: 2
  },
  {
    id: 'calificacion',
    name: 'Calificación',
    type: 'badge',
    required: false,
    order: 3
  }
]