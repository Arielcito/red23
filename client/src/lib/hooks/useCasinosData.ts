"use client"

import { useState, useEffect, useCallback } from 'react'
import { 
  Casino, 
  TopCasino, 
  CasinoConfig, 
  CasinoField, 
  CasinosDataHook,
  DEFAULT_CUSTOM_FIELDS,
  POTENCIAL_VALUES
} from '@/lib/types/casino'

// Mock data para desarrollo - hardcodeado según especificaciones
const MOCK_CASINOS: Casino[] = [
  {
    id: 'casino-1',
    name: 'Casino Royal',
    plataforma: 'Web/Mobile',
    tiempo: '2-4 semanas',
    potencial: POTENCIAL_VALUES.high,
    similar: 'Bet365, 888casino',
    customFields: [
      { fieldId: 'bonos', value: 'Bono de bienvenida 100%' },
      { fieldId: 'metodos_pago', value: 8 },
      { fieldId: 'calificacion', value: { value: 'excelente', color: 'green', label: 'Excelente' } }
    ],
    isTopThree: true,
    topThreePosition: 1,
    imageUrl: '/casino-royal.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'casino-2', 
    name: 'Golden Palace',
    plataforma: 'Web',
    tiempo: '3-5 semanas',
    potencial: POTENCIAL_VALUES.high,
    similar: 'William Hill, Pokerstars',
    customFields: [
      { fieldId: 'bonos', value: 'Bono + giros gratis' },
      { fieldId: 'metodos_pago', value: 6 },
      { fieldId: 'calificacion', value: { value: 'muy_bueno', color: 'green', label: 'Muy Bueno' } }
    ],
    isTopThree: true,
    topThreePosition: 2,
    imageUrl: '/golden-palace.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'casino-3',
    name: 'Lucky Stars',
    plataforma: 'Mobile App',
    tiempo: '1-3 semanas', 
    potencial: POTENCIAL_VALUES.medium,
    similar: 'Betway, LeoVegas',
    customFields: [
      { fieldId: 'bonos', value: 'Programa VIP' },
      { fieldId: 'metodos_pago', value: 5 },
      { fieldId: 'calificacion', value: { value: 'bueno', color: 'yellow', label: 'Bueno' } }
    ],
    isTopThree: true,
    topThreePosition: 3,
    imageUrl: '/lucky-stars.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'casino-4',
    name: 'Diamond Club',
    plataforma: 'Web/Mobile',
    tiempo: '2-4 semanas',
    potencial: POTENCIAL_VALUES.medium,
    similar: 'Unibet, Casumo',
    customFields: [
      { fieldId: 'bonos', value: 'Cashback semanal' },
      { fieldId: 'metodos_pago', value: 7 },
      { fieldId: 'calificacion', value: { value: 'bueno', color: 'yellow', label: 'Bueno' } }
    ],
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'casino-5',
    name: 'Neon Lights',
    plataforma: 'Web',
    tiempo: '4-6 semanas',
    potencial: POTENCIAL_VALUES.low,
    similar: 'Spin Palace, Royal Vegas',
    customFields: [
      { fieldId: 'bonos', value: 'Torneo mensual' },
      { fieldId: 'metodos_pago', value: 4 },
      { fieldId: 'calificacion', value: { value: 'regular', color: 'red', label: 'Regular' } }
    ],
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const MOCK_CONFIG: CasinoConfig = {
  customFields: DEFAULT_CUSTOM_FIELDS,
  topThreeIds: ['casino-1', 'casino-2', 'casino-3']
}

export function useCasinosData(): CasinosDataHook {
  const [casinos, setCasinos] = useState<Casino[]>([])
  const [config, setConfig] = useState<CasinoConfig>({ customFields: [], topThreeIds: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simular carga de datos
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCasinos(MOCK_CASINOS)
      setConfig(MOCK_CONFIG)
      
      console.log('✅ Datos de casinos cargados:', {
        total: MOCK_CASINOS.length,
        topThree: MOCK_CASINOS.filter(c => c.isTopThree).length
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading casino data')
      console.error('❌ Error cargando datos de casinos:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar datos al inicializar
  useEffect(() => {
    loadData()
  }, [loadData])

  // Top three computed
  const topThree: TopCasino[] = casinos
    .filter(casino => casino.isTopThree)
    .sort((a, b) => (a.topThreePosition || 0) - (b.topThreePosition || 0))
    .map(casino => ({
      id: casino.id,
      name: casino.name,
      plataforma: casino.plataforma,
      imageUrl: casino.imageUrl || '/placeholder-casino.svg',
      potencial: casino.potencial,
      position: casino.topThreePosition || 0
    }))

  // Casino CRUD operations
  const createCasino = async (casinoData: Omit<Casino, 'id' | 'createdAt' | 'updatedAt'>): Promise<Casino> => {
    const newCasino: Casino = {
      ...casinoData,
      id: `casino-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setCasinos(prev => [...prev, newCasino])
    console.log('✅ Casino creado:', newCasino.name)
    
    return newCasino
  }

  const updateCasino = async (id: string, updates: Partial<Casino>): Promise<Casino> => {
    const updatedCasino = {
      ...casinos.find(c => c.id === id)!,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    setCasinos(prev => prev.map(c => c.id === id ? updatedCasino : c))
    console.log('✅ Casino actualizado:', updatedCasino.name)
    
    return updatedCasino
  }

  const deleteCasino = async (id: string): Promise<void> => {
    const casino = casinos.find(c => c.id === id)
    setCasinos(prev => prev.filter(c => c.id !== id))
    
    // Actualizar config si era top three
    if (casino?.isTopThree) {
      setConfig(prev => ({
        ...prev,
        topThreeIds: prev.topThreeIds.filter(cId => cId !== id)
      }))
    }
    
    console.log('✅ Casino eliminado:', casino?.name)
  }

  // Top three operations
  const setTopThree = async (casinoIds: string[]): Promise<void> => {
    setCasinos(prev => prev.map(casino => ({
      ...casino,
      isTopThree: casinoIds.includes(casino.id),
      topThreePosition: casinoIds.includes(casino.id) 
        ? casinoIds.indexOf(casino.id) + 1 
        : undefined
    })))
    
    setConfig(prev => ({ ...prev, topThreeIds: casinoIds }))
    console.log('✅ Top 3 actualizado:', casinoIds)
  }

  const updateTopThreeImage = async (casinoId: string, imageUrl: string): Promise<void> => {
    await updateCasino(casinoId, { imageUrl })
    console.log('✅ Imagen actualizada para casino:', casinoId)
  }

  // Field configuration
  const addCustomField = async (fieldData: Omit<CasinoField, 'id'>): Promise<CasinoField> => {
    const newField: CasinoField = {
      ...fieldData,
      id: `field-${Date.now()}`
    }
    
    setConfig(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }))
    
    console.log('✅ Campo personalizado agregado:', newField.name)
    return newField
  }

  const updateCustomField = async (fieldId: string, updates: Partial<CasinoField>): Promise<CasinoField> => {
    const updatedField = {
      ...config.customFields.find(f => f.id === fieldId)!,
      ...updates
    }
    
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.map(f => f.id === fieldId ? updatedField : f)
    }))
    
    console.log('✅ Campo personalizado actualizado:', updatedField.name)
    return updatedField
  }

  const deleteCustomField = async (fieldId: string): Promise<void> => {
    const field = config.customFields.find(f => f.id === fieldId)
    
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== fieldId)
    }))
    
    // Remover valores de este campo de todos los casinos
    setCasinos(prev => prev.map(casino => ({
      ...casino,
      customFields: casino.customFields.filter(cf => cf.fieldId !== fieldId)
    })))
    
    console.log('✅ Campo personalizado eliminado:', field?.name)
  }

  const reorderFields = async (fieldIds: string[]): Promise<void> => {
    const reorderedFields = fieldIds.map((id, index) => ({
      ...config.customFields.find(f => f.id === id)!,
      order: index + 1
    }))
    
    setConfig(prev => ({
      ...prev,
      customFields: reorderedFields
    }))
    
    console.log('✅ Campos reordenados')
  }

  const refreshData = async (): Promise<void> => {
    await loadData()
  }

  const clearError = (): void => {
    setError(null)
  }

  return {
    casinos,
    topThree,
    config,
    isLoading,
    error,
    createCasino,
    updateCasino, 
    deleteCasino,
    setTopThree,
    updateTopThreeImage,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    reorderFields,
    refreshData,
    clearError
  }
}