"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useReferrals } from '@/lib/hooks/useReferrals'
import { useReferralUrl } from '@/lib/hooks/useReferralUrl'

interface ReferralAutoSetupProps {
  onSetupComplete?: (hasReferralCode: boolean) => void
}

export function ReferralAutoSetup({ onSetupComplete }: ReferralAutoSetupProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { registerWithReferral, stats } = useReferrals()
  const { referralCode, clearReferralCode } = useReferralUrl()
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  useEffect(() => {
    // Solo ejecutar cuando el usuario esté autenticado y no esté cargando
    if (!authLoading && isAuthenticated && user?.id && !isSetupComplete) {
      handleAutoSetup()
    }
  }, [authLoading, isAuthenticated, user?.id, isSetupComplete])

  const handleAutoSetup = async () => {
    try {
      console.log('[ReferralAutoSetup] Iniciando configuración automática:', {
        userId: user?.id,
        hasReferralCode: !!referralCode,
        hasExistingStats: !!stats
      })

      // Si el usuario ya tiene stats, significa que ya está registrado
      if (stats?.myReferralCode) {
        console.log('[ReferralAutoSetup] Usuario ya registrado en sistema de referidos')
        setIsSetupComplete(true)
        clearReferralCode()
        onSetupComplete?.(false)
        return
      }

      // Registrar usuario con código de referido (si existe) o sin él
      const success = await registerWithReferral(referralCode || undefined)
      
      if (success) {
        console.log('[ReferralAutoSetup] Usuario registrado exitosamente')
        clearReferralCode() // Limpiar código usado
        onSetupComplete?.(!!referralCode)
      } else {
        console.error('[ReferralAutoSetup] Error registrando usuario')
        onSetupComplete?.(false)
      }
      
      setIsSetupComplete(true)
    } catch (error) {
      console.error('[ReferralAutoSetup] Error en configuración automática:', error)
      setIsSetupComplete(true)
      onSetupComplete?.(false)
    }
  }

  // Este componente no renderiza nada visible
  return null
}