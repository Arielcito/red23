'use client'

import { useState } from 'react'
import type { CreateNotificationRequest } from '@/lib/types/notifications'

interface UseAdminNotificationsReturn {
  createBroadcast: (data: CreateNotificationRequest) => Promise<void>
  isCreating: boolean
  error: string | null
  success: boolean
  clearError: () => void
  clearSuccess: () => void
}

export function useAdminNotifications(): UseAdminNotificationsReturn {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createBroadcast = async (data: CreateNotificationRequest) => {
    setIsCreating(true)
    setError(null)
    setSuccess(false)

    try {
      console.log('📤 Hook: Creating broadcast notification')

      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error creando notificación')
      }

      console.log(`✅ Broadcast created: ${result.data.broadcastCount} users notified`)
      setSuccess(true)

    } catch (err) {
      console.error('❌ Error in createBroadcast:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  const clearError = () => setError(null)
  const clearSuccess = () => setSuccess(false)

  return {
    createBroadcast,
    isCreating,
    error,
    success,
    clearError,
    clearSuccess
  }
}
