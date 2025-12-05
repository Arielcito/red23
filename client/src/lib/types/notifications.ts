export interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error' | 'prize'
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: {
    prizeId?: string
    prizeName?: string
    prizeValue?: number
    actionUrl?: string
    actionLabel?: string
    [key: string]: any
  }
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

export interface NotificationProviderProps {
  children: React.ReactNode
}

// Database types
export interface NotificationDB {
  id: string
  type: 'success' | 'warning' | 'info' | 'error' | 'prize'
  title: string
  message: string
  data?: { [key: string]: any } | null
  created_at: string
  updated_at: string
}

export interface UserNotificationDB {
  id: string
  user_id: string
  notification_id: string
  read_at: string | null
  deleted_at: string | null
  created_at: string
}

// Admin API types
export interface CreateNotificationRequest {
  type: 'success' | 'warning' | 'info' | 'error' | 'prize'
  title: string
  message: string
  data?: {
    prizeId?: string
    prizeName?: string
    prizeValue?: number
    actionUrl?: string
    actionLabel?: string
    [key: string]: any
  }
}

export interface BroadcastNotificationResponse {
  success: boolean
  data?: {
    notification: NotificationDB
    broadcastCount: number
  }
  error?: string
}
