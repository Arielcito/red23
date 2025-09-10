"use client"

import { useNotificationContext } from '@/lib/contexts/NotificationContext'
import { Notification } from '@/lib/types/notifications'

export function useNotifications() {
  const context = useNotificationContext()

  const createNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    data?: Notification['data']
  ) => {
    context.addNotification({
      type,
      title,
      message,
      read: false,
      data
    })
  }

  const createPrizeNotification = (
    prizeName: string,
    prizeValue: number,
    prizeId?: string,
    actionUrl?: string
  ) => {
    createNotification(
      'prize',
      '¡Felicidades! 🎉',
      `Has ganado: ${prizeName}`,
      {
        prizeId,
        prizeName,
        prizeValue,
        actionUrl: actionUrl || '/rewards/claim'
      }
    )
  }

  const createSuccessNotification = (title: string, message: string) => {
    createNotification('success', title, message)
  }

  const createErrorNotification = (title: string, message: string) => {
    createNotification('error', title, message)
  }

  const createInfoNotification = (title: string, message: string) => {
    createNotification('info', title, message)
  }

  const createWarningNotification = (title: string, message: string) => {
    createNotification('warning', title, message)
  }

  return {
    // Estado del contexto
    ...context,
    
    // Métodos de conveniencia para crear notificaciones
    createNotification,
    createPrizeNotification,
    createSuccessNotification,
    createErrorNotification,
    createInfoNotification,
    createWarningNotification,
  }
}