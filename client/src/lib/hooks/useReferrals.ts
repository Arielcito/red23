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

interface UseReferralsReturn {
  stats: ReferralStats | null
  myReferrals: ReferralData[]
  isLoading: boolean
  error: string | null
  validateCode: (code: string) => Promise<boolean>
  registerWithReferral: (referralCode?: string) => Promise<boolean>
  refreshStats: () => Promise<void>
}

export function useReferrals(): UseReferralsReturn {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [myReferrals, setMyReferrals] = useState<ReferralData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('[Referrals Hook] Estado de autenticación:', {
    isAuthenticated,
    authLoading,
    userId: user?.id
  })

  const fetchReferralData = useCallback(async () => {
    if (!isAuthenticated || !user?.id || authLoading) {
      console.log('[Referrals Hook] No hay usuario autenticado o está cargando')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      console.log('[Referrals Hook] Obteniendo datos de referidos para:', user.id)

      // Obtener estadísticas
      const statsResponse = await fetch('/api/referrals/my-stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats(statsData.data)
          console.log('[Referrals Hook] Estadísticas obtenidas:', statsData.data)
        }
      } else {
        console.log('[Referrals Hook] Error obteniendo estadísticas:', statsResponse.status)
      }

      // Obtener lista de referidos
      const referralsResponse = await fetch('/api/referrals/my-referrals')
      if (referralsResponse.ok) {
        const referralsData = await referralsResponse.json()
        if (referralsData.success) {
          setMyReferrals(referralsData.data)
          console.log('[Referrals Hook] Referidos obtenidos:', referralsData.data.length)
        }
      } else {
        console.log('[Referrals Hook] Error obteniendo referidos:', referralsResponse.status)
      }

    } catch (error) {
      console.error('[Referrals Hook] Error obteniendo datos:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id, authLoading])

  const validateCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      console.log('[Referrals Hook] Validando código:', code)
      
      const response = await fetch('/api/referrals/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode: code }),
      })

      const data = await response.json()
      const isValid = data.success && data.data.isValid
      
      console.log('[Referrals Hook] Código válido:', isValid)
      return isValid
    } catch (error) {
      console.error('[Referrals Hook] Error validando código:', error)
      return false
    }
  }, [])

  const registerWithReferral = useCallback(async (referralCode?: string): Promise<boolean> => {
    if (!user?.id) {
      console.log('[Referrals Hook] No hay usuario para registrar referido')
      return false
    }

    try {
      console.log('[Referrals Hook] Registrando usuario con referido:', {
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
        console.log('[Referrals Hook] Usuario registrado exitosamente en sistema de referidos')
        await fetchReferralData() // Refrescar datos
        return true
      } else {
        console.error('[Referrals Hook] Error registrando usuario:', data.error)
        setError(data.error)
        return false
      }
    } catch (error) {
      console.error('[Referrals Hook] Error en registro de referido:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      return false
    }
  }, [user?.id, fetchReferralData])

  const refreshStats = useCallback(async () => {
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
    error,
    validateCode,
    registerWithReferral,
    refreshStats
  }
}