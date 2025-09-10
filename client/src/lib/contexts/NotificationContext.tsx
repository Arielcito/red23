"use client"

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { Notification, NotificationContextType, NotificationProviderProps } from '@/lib/types/notifications'

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }

interface NotificationState {
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, isLoading: false, error: null }
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        error: null 
      }
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        )
      }
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true }))
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      }
    case 'CLEAR_ALL':
      return { ...state, notifications: [] }
    default:
      return state
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  const unreadCount = state.notifications.filter(notification => !notification.read).length

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification })
  }, [])

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id })
  }, [])

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' })
  }, [])

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }, [])

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
  }, [])

  const refreshNotifications = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // TODO: Implementar llamada a la API
      // const response = await fetch('/api/notifications')
      // if (!response.ok) {
      //   throw new Error('Error al obtener notificaciones')
      // }
      // const data = await response.json()
      // dispatch({ type: 'SET_NOTIFICATIONS', payload: data.notifications })
      
      // Por ahora, simular datos mockeados
      await new Promise(resolve => setTimeout(resolve, 500))
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Error desconocido' })
    }
  }, [])

  // Inicializar con datos mockeados
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'prize',
        title: '¡FELICITACIONES! 🙌🏻',
        message: 'Fuiste el ganador del día, tenes un 10% de reintegro en todas las cargas de hoy!!! Manda una captura de este mensaje a tu proveedor para reclamar tu premio🙌🏻',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
        read: false,
        data: {
          prizeId: 'daily-winner-001',
          prizeName: '10% de reintegro',
          prizeValue: 10,
          actionUrl: '/rewards/claim'
        }
      },
      {
        id: '2',
        type: 'prize',
        title: '¡FELICITACIONES! 🙌🏻',
        message: 'Fuiste el ganador del premio semanal, ganaste una ...!!! Recorda estar atento a telegram ya que por ahi nos vamos a estar comunicando contigo para coordinar la entrega🙌🏻',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        data: {
          prizeId: 'weekly-winner-001',
          prizeName: 'Premio semanal',
          actionUrl: 'https://t.me/red23oficial'
        }
      },
      {
        id: '3',
        type: 'info',
        title: 'Bienvenido al software oficial de RED23 🙌🏻',
        message: 'Esta web esta llena de las mejores herramientas para que exprimas tus ventas al máximo!! Recorda estar atento al canal de telegram donde se van a anunciar muchisimas cosas, entre ellas los premios diarios, semanales y mensuales🙌🏻',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
        read: true,
        data: {
          actionUrl: 'https://t.me/red23oficial'
        }
      }
    ]

    dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications })
  }, [])

  const contextValue: NotificationContextType = {
    notifications: state.notifications,
    unreadCount,
    isLoading: state.isLoading,
    error: state.error,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    refreshNotifications
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext debe usarse dentro de un NotificationProvider')
  }
  return context
}