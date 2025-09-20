"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface UseReferralUrlReturn {
  referralCode: string | null
  hasReferralCode: boolean
  clearReferralCode: () => void
}

export function useReferralUrl(): UseReferralUrlReturn {
  const searchParams = useSearchParams()
  const [referralCode, setReferralCode] = useState<string | null>(null)

  useEffect(() => {
    // Verificar parámetros de URL para código de referido
    const urlRef = searchParams?.get('ref')
    const urlReferral = searchParams?.get('referral')
    const urlCode = searchParams?.get('code')

    const codeFromUrl = urlRef || urlReferral || urlCode

    if (codeFromUrl) {
      console.log('[ReferralUrl] Código encontrado en URL:', codeFromUrl)
      setReferralCode(codeFromUrl.toUpperCase())
      
      // Guardar en localStorage para persistencia
      try {
        localStorage.setItem('pending_referral_code', codeFromUrl.toUpperCase())
      } catch (error) {
        console.error('[ReferralUrl] Error guardando en localStorage:', error)
      }
    } else {
      // Verificar si hay código guardado en localStorage
      try {
        const savedCode = localStorage.getItem('pending_referral_code')
        if (savedCode) {
          console.log('[ReferralUrl] Código encontrado en localStorage:', savedCode)
          setReferralCode(savedCode)
        }
      } catch (error) {
        console.error('[ReferralUrl] Error leyendo localStorage:', error)
      }
    }
  }, [searchParams])

  const clearReferralCode = () => {
    setReferralCode(null)
    try {
      localStorage.removeItem('pending_referral_code')
    } catch (error) {
      console.error('[ReferralUrl] Error eliminando de localStorage:', error)
    }
  }

  return {
    referralCode,
    hasReferralCode: !!referralCode,
    clearReferralCode
  }
}