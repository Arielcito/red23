"use client"

import { useState, useEffect, useCallback } from 'react'
import type { UserLogo } from '@/lib/supabase/types'

interface UseUserLogoReturn {
  logo: UserLogo | null
  isLoading: boolean
  error: string | null
  uploadLogo: (file: File, userEmail: string) => Promise<void>
  deleteLogo: () => Promise<void>
  clearError: () => void
}

export function useUserLogo(): UseUserLogoReturn {
  const [logo, setLogo] = useState<UserLogo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogo = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔍 Obteniendo logo del usuario')

      const response = await fetch('/api/user-logo')

      if (!response.ok) {
        if (response.status === 401) {
          setLogo(null)
          return
        }
        throw new Error('Error al obtener el logo')
      }

      const data = await response.json()

      if (data.success) {
        setLogo(data.data)
        console.log('✅ Logo obtenido:', data.data ? 'encontrado' : 'no encontrado')
      } else {
        throw new Error(data.error || 'Error al obtener el logo')
      }
    } catch (err) {
      console.error('❌ Error obteniendo logo:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogo()
  }, [fetchLogo])

  const uploadLogo = useCallback(async (file: File, userEmail: string) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('📤 Subiendo logo del usuario')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('user_email', userEmail)

      const response = await fetch('/api/user-logo', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al subir el logo')
      }

      const data = await response.json()

      if (data.success) {
        setLogo(data.data.logo)
        console.log('✅ Logo subido exitosamente')
      } else {
        throw new Error(data.error || 'Error al subir el logo')
      }
    } catch (err) {
      console.error('❌ Error subiendo logo:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir el logo'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteLogo = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🗑️ Eliminando logo del usuario')

      const response = await fetch('/api/user-logo', {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el logo')
      }

      const data = await response.json()

      if (data.success) {
        setLogo(null)
        console.log('✅ Logo eliminado exitosamente')
      } else {
        throw new Error(data.error || 'Error al eliminar el logo')
      }
    } catch (err) {
      console.error('❌ Error eliminando logo:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el logo'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    logo,
    isLoading,
    error,
    uploadLogo,
    deleteLogo,
    clearError
  }
}
