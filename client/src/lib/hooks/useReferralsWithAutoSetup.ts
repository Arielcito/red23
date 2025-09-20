"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import type { ReferralStats } from '@/lib/services/referralService'

interface ReferralData {
  id: number
  referredUserId: string
  referralCode: string
  status: string
  createdAt: string
  completedAt?: string
}

interface UseReferralsWithAutoSetupReturn {
  stats: ReferralStats | null
  myReferrals: ReferralData[]
  isLoading: boolean
  isSettingUp: boolean
  hasSetupError: boolean
  error: string | null
  validateCode: (code: string) => Promise<boolean>
  registerWithReferral: (referralCode?: string) => Promise<boolean>
  refreshStats: () => Promise<void>
  retrySetup: () => Promise<void>
}

export function useReferralsWithAutoSetup(): UseReferralsWithAutoSetupReturn {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [myReferrals, setMyReferrals] = useState<ReferralData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [hasSetupError, setHasSetupError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log('🎯 [Referrals Auto Hook] Estado:', {
    isAuthenticated,
    authLoading,
    userId: user?.id,
    isSettingUp,
    hasSetupError
  })

  const setupUserInReferralSystem = useCallback(async () => {
    if (!user?.id) {
      console.log('🎯 [Auto Setup] No hay usuario para setup')
      return false
    }

    try {
      setIsSettingUp(true)
      setHasSetupError(false)
      setError(null)
      
      console.log('🚀 [Auto Setup] Iniciando setup automático para:', user.id)

      // Intentar registrar usuario en sistema de referidos (sin código de referido)
      const response = await fetch('/api/referrals/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
          // No enviamos referredByCode para que sea un registro nuevo
        }),
      })

      const result = await response.json()

      if (result.success) {
        console.log('✅ [Auto Setup] Usuario configurado en sistema de referidos:', result.data.referralCode)
        return true
      } else {
        // Si el error es que ya existe, eso está bien
        if (result.error && result.error.includes('ya tiene código')) {
          console.log('ℹ️ [Auto Setup] Usuario ya estaba en sistema de referidos')
          return true
        }
        
        console.error('❌ [Auto Setup] Error en configuración:', result.error)
        setError(result.error || 'Error configurando sistema de referidos')
        setHasSetupError(true)
        return false
      }
    } catch (err) {
      console.error('❌ [Auto Setup] Error inesperado:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido en setup')
      setHasSetupError(true)
      return false
    } finally {
      setIsSettingUp(false)
    }
  }, [user?.id])

  const fetchReferralData = useCallback(async () => {
    if (!isAuthenticated || !user?.id || authLoading) {
      console.log('🎯 [Auto Hook] No hay usuario autenticado o está cargando')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      console.log('📋 [Auto Hook] Obteniendo datos de referidos para:', user.id)

      // Primero intentar obtener estadísticas
      const statsResponse = await fetch('/api/referrals/my-stats')
      
      if (statsResponse.status === 404) {
        // Usuario no está en sistema de referidos, configurar automáticamente
        console.log('🔧 [Auto Hook] Usuario no encontrado, iniciando auto-setup')
        const setupSuccess = await setupUserInReferralSystem()
        
        if (!setupSuccess) {
          console.log('❌ [Auto Hook] Falló el auto-setup')
          return
        }
        
        // Reintentar obtener estadísticas después del setup
        console.log('🔄 [Auto Hook] Reintentando obtener estadísticas después del setup')
        await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar un poco
        return await fetchReferralData()
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats(statsData.data)
          console.log('✅ [Auto Hook] Estadísticas obtenidas:', statsData.data)
        }
      } else {
        console.log('❌ [Auto Hook] Error obteniendo estadísticas:', statsResponse.status)
        setError('Error obteniendo estadísticas de referidos')
      }

      // Obtener lista de referidos
      const referralsResponse = await fetch('/api/referrals/my-referrals')
      if (referralsResponse.ok) {
        const referralsData = await referralsResponse.json()
        if (referralsData.success) {
          setMyReferrals(referralsData.data)
          console.log('✅ [Auto Hook] Referidos obtenidos:', referralsData.data.length)
        }
      } else {
        console.log('⚠️ [Auto Hook] Error obteniendo referidos:', referralsResponse.status)
        // No es crítico, continúamos
      }

    } catch (error) {
      console.error('❌ [Auto Hook] Error obteniendo datos:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id, authLoading, setupUserInReferralSystem])

  const validateCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      console.log('🔍 [Auto Hook] Validando código:', code)
      
      const response = await fetch('/api/referrals/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode: code }),
      })

      const data = await response.json()
      const isValid = data.success && data.data.isValid
      
      console.log('✅ [Auto Hook] Código válido:', isValid)
      return isValid
    } catch (error) {
      console.error('❌ [Auto Hook] Error validando código:', error)
      return false
    }
  }, [])

  const registerWithReferral = useCallback(async (referralCode?: string): Promise<boolean> => {
    if (!user?.id) {
      console.log('❌ [Auto Hook] No hay usuario para registrar referido')
      return false
    }

    try {
      console.log('🎯 [Auto Hook] Registrando usuario con referido:', {
        userId: user.id,
        referralCode
      })

      const response = await fetch('/api/referrals/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          referredByCode: referralCode
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        console.log('✅ [Auto Hook] Usuario registrado exitosamente en sistema de referidos')
        await fetchReferralData() // Refrescar datos
        return true
      } else {
        console.error('❌ [Auto Hook] Error registrando usuario:', data.error)
        setError(data.error)
        return false
      }
    } catch (error) {
      console.error('❌ [Auto Hook] Error en registro de referido:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      return false
    }
  }, [user?.id, fetchReferralData])

  const refreshStats = useCallback(async () => {
    await fetchReferralData()
  }, [fetchReferralData])

  const retrySetup = useCallback(async () => {
    setHasSetupError(false)
    setError(null)
    await fetchReferralData()
  }, [fetchReferralData])

  useEffect(() => {
    if (!authLoading) {
      fetchReferralData()
    }
  }, [fetchReferralData, authLoading])

  return {
    stats,
    myReferrals,
    isLoading: isLoading || authLoading,
    isSettingUp,
    hasSetupError,
    error,
    validateCode,
    registerWithReferral,
    refreshStats,
    retrySetup
  }
}