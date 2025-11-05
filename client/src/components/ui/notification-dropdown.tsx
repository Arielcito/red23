"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./dropdown-menu"
import { Button } from "./button"
import { ScrollArea } from "./scroll-area"
import { NotificationItem } from "./notification-item"
import { NotificationBadge } from "./notification-badge"
import { Bell, CheckCheck, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/lib/hooks/useNotifications"
import { Notification } from "@/lib/types/notifications"
import { useRouter } from "next/navigation"

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    isLoading
  } = useNotifications()
  
  const router = useRouter()

  const handleNotificationAction = (notification: Notification) => {
    if (notification.data?.actionUrl) {
      if (notification.data.actionUrl.startsWith('http')) {
        window.open(notification.data.actionUrl, '_blank')
      } else {
        router.push(notification.data.actionUrl)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 touch-manipulation hover:bg-gray-100 dark:hover:bg-gray-800",
            className
          )}
        >
          <Bell className={cn("h-4 w-4 sm:h-5 sm:w-5", className?.includes("text-white") && "text-white")} />
          <NotificationBadge count={unreadCount} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 sm:w-96 max-h-[80vh]" 
        align="end" 
        forceMount
        sideOffset={5}
      >
        <DropdownMenuHeader className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notificaciones
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({unreadCount} no leídas)
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
            
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </DropdownMenuHeader>
        
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Cargando notificaciones...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tienes notificaciones
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                  onActionClick={handleNotificationAction}
                  onNotificationClick={(notif) => {
                    if (!notif.read) {
                      markAsRead(notif.id)
                    }
                    router.push(`/notifications/${notif.id}`)
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => router.push('/notifications')}
              >
                Ver todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}