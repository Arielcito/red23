"use client"

import { Button } from "./button"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"
import { Notification } from "@/lib/types/notifications"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { 
  Bell, 
  Gift, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  X,
  ExternalLink 
} from "lucide-react"
import Link from "next/link"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onRemove?: (id: string) => void
  onActionClick?: (notification: Notification) => void
  onNotificationClick?: (notification: Notification) => void
}

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: XCircle,
  prize: Gift,
}

const colorMap = {
  success: "text-green-500",
  warning: "text-yellow-500", 
  info: "text-blue-500",
  error: "text-red-500",
  prize: "text-purple-500",
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onRemove,
  onActionClick,
  onNotificationClick
}: NotificationItemProps) {
  const Icon = iconMap[notification.type]
  const iconColor = colorMap[notification.type]
  
  const timeAgo = formatDistanceToNow(notification.timestamp, {
    addSuffix: true,
    locale: es
  })

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onActionClick) {
      onActionClick(notification)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove(notification.id)
    }
  }

  return (
    <div
      className={cn(
        "group relative p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 ease-in-out",
        !notification.read && "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className={cn("flex-shrink-0 mt-0.5", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
              {notification.title}
            </p>
            
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              {!notification.read && (
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              )}
              <button
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo}
            </span>
            
            {notification.type === 'prize' && notification.data?.prizeValue && (
              <Badge variant="secondary" className="text-xs">
                ${notification.data.prizeValue}
              </Badge>
            )}
          </div>
          
          {/* Botones de acción para notificaciones */}
          {notification.data?.actionUrl && (
            <div className="mt-2 flex space-x-2">
              {notification.data.actionUrl.startsWith('http') ? (
                <a
                  href={notification.data.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors duration-200"
                  onClick={handleActionClick}
                >
                  {notification.data?.actionLabel ?? (notification.type === 'prize' ? 'Reclamar Premio' : 'Ver más')}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ) : (
                <Link href={notification.data.actionUrl}>
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                    onClick={handleActionClick}
                  >
                    {notification.data?.actionLabel ?? (notification.type === 'prize' ? 'Reclamar Premio' : 'Ver más')}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
