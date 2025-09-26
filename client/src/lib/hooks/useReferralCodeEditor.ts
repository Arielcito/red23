"use client"

import { useState, useCallback } from 'react'
import type { UseReferralCodeEditorReturn, CodeAvailabilityResponse } from '@/lib/types/referrals'

interface UseReferralCodeEditorProps {
  currentCode: string
  onCodeUpdated?: (newCode: string) => void
}

export function useReferralCodeEditor({ 
  currentCode, 
  onCodeUpdated 
}: UseReferralCodeEditorProps): UseReferralCodeEditorReturn {
  const [isEditing, setIsEditing] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  console.log('🎯 [ReferralCodeEditor Hook] Estado:', {
    isEditing,
    newCode,
    isValidating,
    isSaving,
    isAvailable
  })

  const startEditing = useCallback(() => {
    setIsEditing(true)
    setNewCode(currentCode)
    setValidationError(null)
    setIsAvailable(null)
    setSuggestions([])
  }, [currentCode])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setNewCode('')
    setValidationError(null)
    setIsAvailable(null)
    setSuggestions([])
    setIsValidating(false)
    setIsSaving(false)
  }, [])

  const checkAvailability = useCallback(async (code: string) => {
    if (!code.trim() || code === currentCode) {
      setIsAvailable(null)
      setValidationError(null)
      setSuggestions([])
      return
    }

    try {
      setIsValidating(true)
      setValidationError(null)
      setSuggestions([])

      console.log('🔍 [ReferralCodeEditor Hook] Verificando disponibilidad:', code)

      const response = await fetch('/api/referrals/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode: code }),
      })

      const result = await response.json()

      if (result.success) {
        const data: CodeAvailabilityResponse = result.data
        setIsAvailable(data.isAvailable)
        
        if (!data.isAvailable && data.error) {
          setValidationError(data.error)
          setSuggestions(data.suggestions || [])
        }
        
        console.log('✅ [ReferralCodeEditor Hook] Disponibilidad verificada:', data)
      } else {
        setValidationError(result.error || 'Error verificando código')
        setIsAvailable(false)
        setSuggestions([])
        console.error('❌ [ReferralCodeEditor Hook] Error en verificación:', result.error)
      }
    } catch (error) {
      console.error('❌ [ReferralCodeEditor Hook] Error inesperado:', error)
      setValidationError('Error de conexión')
      setIsAvailable(false)
      setSuggestions([])
    } finally {
      setIsValidating(false)
    }
  }, [currentCode])

  const saveCode = useCallback(async (): Promise<boolean> => {
    if (!newCode.trim() || newCode === currentCode) {
      setValidationError('El código debe ser diferente al actual')
      return false
    }

    if (isAvailable !== true) {
      setValidationError('Verifica que el código esté disponible')
      return false
    }

    try {
      setIsSaving(true)
      setValidationError(null)

      console.log('💾 [ReferralCodeEditor Hook] Guardando código:', newCode)

      const response = await fetch('/api/referrals/update-code', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newReferralCode: newCode }),
      })

      const result = await response.json()

      if (result.success) {
        console.log('✅ [ReferralCodeEditor Hook] Código guardado exitosamente')
        onCodeUpdated?.(result.data.referralCode)
        cancelEditing()
        return true
      } else {
        setValidationError(result.error || 'Error guardando código')
        console.error('❌ [ReferralCodeEditor Hook] Error guardando:', result.error)
        return false
      }
    } catch (error) {
      console.error('❌ [ReferralCodeEditor Hook] Error inesperado guardando:', error)
      setValidationError('Error de conexión al guardar')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [newCode, currentCode, isAvailable, onCodeUpdated, cancelEditing])

  const handleSetNewCode = useCallback((code: string) => {
    setNewCode(code)
    
    // Auto-verificar disponibilidad con debounce
    const timeoutId = setTimeout(() => {
      if (code !== currentCode && code.trim()) {
        checkAvailability(code)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [currentCode, checkAvailability])

  return {
    isEditing,
    newCode,
    isValidating,
    isSaving,
    validationError,
    isAvailable,
    suggestions,
    setNewCode: handleSetNewCode,
    startEditing,
    cancelEditing,
    saveCode,
    checkAvailability
  }
}