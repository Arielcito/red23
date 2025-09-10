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
  clearAllNotifications: () => void
  refreshNotifications: () => Promise<void>
}

export interface NotificationProviderProps {
  children: React.ReactNode
}