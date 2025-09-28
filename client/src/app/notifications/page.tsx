"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/lib/hooks/useNotifications"
import { NotificationItem } from "@/components/ui/notification-item"
import { AppLayout } from "@/components/layout/AppLayout"
import type { Notification } from "@/lib/types/notifications"
import { Bell, CheckCheck, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    router.push(`/notifications/${notification.id}`)
  }

  return (
    <AppLayout title="Notificaciones" showBackButton={true} backHref="/dashboard">
      <div className="flex flex-col h-full px-4 py-2 sm:px-6">
        {/* Header con estadísticas y acciones */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} notificaciones no leídas
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas como leídas
              </Button>
            )}
            
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                className="text-red-600 hover:text-red-700 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Limpiar todas
              </Button>
            )}
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="flex-1 min-h-0">
          {isLoading ? (
            <Card className="p-6 sm:p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Cargando notificaciones...</p>
              </div>
            </Card>
          ) : notifications.length === 0 ? (
            <Card className="p-6 sm:p-8">
              <div className="text-center">
                <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  No tienes notificaciones en este momento.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="h-full">
              <ScrollArea className="h-full">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 p-0 border-0 bg-transparent focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800/50"
                    >
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onRemove={removeNotification}
                        onActionClick={(notif) => {
                          if (notif.data?.actionUrl) {
                            if (notif.data.actionUrl.startsWith('http')) {
                              window.open(notif.data.actionUrl, '_blank')
                            } else {
                              router.push(notif.data.actionUrl)
                            }
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}