import { useState, useEffect } from 'react'

interface TermsStatus {
  hasAccepted: boolean
  acceptedAt?: string | null
  acceptedVersion?: string | null
  currentVersion: string
  needsAcceptance: boolean
}

interface UseTermsAcceptanceReturn {
  needsAcceptance: boolean
  isLoading: boolean
  isAccepting: boolean
  error: string | null
  acceptTerms: () => Promise<void>
  termsStatus: TermsStatus | null
}

export function useTermsAcceptance(): UseTermsAcceptanceReturn {
  const [termsStatus, setTermsStatus] = useState<TermsStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkTermsStatus()
  }, [])

  async function checkTermsStatus() {
    try {
      console.log('🔍 Checking terms acceptance status')
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/users/terms-status')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al verificar términos')
      }

      if (result.success && result.data) {
        console.log('✅ Terms status retrieved:', result.data)
        setTermsStatus(result.data)
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (err) {
      console.error('❌ Error checking terms status:', err)
      setError(err instanceof Error ? err.message : 'Error al verificar términos')
    } finally {
      setIsLoading(false)
    }
  }

  async function acceptTerms() {
    try {
      console.log('✍️ Accepting terms')
      setIsAccepting(true)
      setError(null)

      const response = await fetch('/api/users/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al aceptar términos')
      }

      if (result.success) {
        console.log('✅ Terms accepted successfully')
        // Refresh terms status after acceptance
        await checkTermsStatus()
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (err) {
      console.error('❌ Error accepting terms:', err)
      setError(err instanceof Error ? err.message : 'Error al aceptar términos')
      throw err // Re-throw to allow component to handle it
    } finally {
      setIsAccepting(false)
    }
  }

  return {
    needsAcceptance: termsStatus?.needsAcceptance ?? false,
    isLoading,
    isAccepting,
    error,
    acceptTerms,
    termsStatus
  }
}
