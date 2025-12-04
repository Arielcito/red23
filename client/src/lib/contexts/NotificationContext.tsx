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

  const markAsRead = useCallback(async (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id })

    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH'
      })
      if (!response.ok) throw new Error('Error marcando como leída')
    } catch (error) {
      console.error('❌ Error marking as read:', error)
      await refreshNotifications()
    }
  }, [])

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' })
  }, [])

  const removeNotification = useCallback(async (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Error eliminando notificación')
    } catch (error) {
      console.error('❌ Error removing notification:', error)
      await refreshNotifications()
    }
  }, [])

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
  }, [])

  const refreshNotifications = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      console.log('🔄 Context: Refreshing notifications from API')
      const response = await fetch('/api/notifications')

      if (!response.ok) {
        throw new Error('Error al obtener notificaciones')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido')
      }

      dispatch({ type: 'SET_NOTIFICATIONS', payload: result.data })
      console.log(`✅ Context: Loaded ${result.data.length} notifications`)
    } catch (error) {
      console.error('❌ Error refreshing notifications:', error)
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }, [])

  // Load notifications on mount
  useEffect(() => {
    refreshNotifications()
  }, [refreshNotifications])

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