"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/lib/hooks/useNotifications"
import { AppLayout } from "@/components/layout/AppLayout"
import type { Notification } from "@/lib/types/notifications"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  Bell, 
  Gift, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  ExternalLink,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

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

const backgroundMap = {
  success: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
  warning: "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800",
  error: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800",
  prize: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800",
}

export default function NotificationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { notifications, markAsRead, removeNotification } = useNotifications()
  const [notification, setNotification] = useState<Notification | null>(null)

  useEffect(() => {
    const notificationId = params.id as string
    const foundNotification = notifications.find(n => n.id === notificationId)
    
    if (foundNotification) {
      setNotification(foundNotification)
      if (!foundNotification.read) {
        markAsRead(foundNotification.id)
      }
    }
  }, [params.id, notifications, markAsRead])

  const handleRemove = () => {
    if (notification) {
      removeNotification(notification.id)
      router.push('/notifications')
    }
  }

  const handleActionClick = () => {
    if (notification?.data?.actionUrl) {
      if (notification.data.actionUrl.startsWith('http')) {
        window.open(notification.data.actionUrl, '_blank')
      } else {
        router.push(notification.data.actionUrl)
      }
    }
  }

  if (!notification) {
    return (
      <AppLayout title="Notificación no encontrada" showBackButton={true} backHref="/notifications">
        <div className="flex flex-col h-full px-4 py-2 sm:px-6 max-w-2xl mx-auto">
          <Card className="p-6 sm:p-8 flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                Notificación no encontrada
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                La notificación que buscas no existe o ha sido eliminada.
              </p>
              <Button 
                onClick={() => router.push('/notifications')}
                className="w-full sm:w-auto"
              >
                Volver a notificaciones
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const Icon = iconMap[notification.type]
  const iconColor = colorMap[notification.type]
  const backgroundClass = backgroundMap[notification.type]
  
  const timeAgo = formatDistanceToNow(notification.timestamp, {
    addSuffix: true,
    locale: es
  })
  
  const fullDate = format(notification.timestamp, "PPPp", { locale: es })

  return (
    <AppLayout title={notification.title} showBackButton={true} backHref="/notifications">
      <div className="flex flex-col h-full px-4 py-2 sm:px-6 max-w-2xl mx-auto">
        <div className="mb-4 flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Eliminar
          </Button>
        </div>

        <Card className={cn("border-2 flex-1", backgroundClass)}>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className={cn("flex-shrink-0 p-2 sm:p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm", iconColor)}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 space-y-2 sm:space-y-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {notification.title}
                  </h1>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge 
                      variant="secondary" 
                      className={cn("capitalize text-xs", iconColor)}
                    >
                      {notification.type === 'prize' ? 'Premio' : notification.type}
                    </Badge>
                    {notification.type === 'prize' && notification.data?.prizeValue && (
                      <Badge variant="default" className="bg-green-600 text-xs">
                        ${notification.data.prizeValue}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{timeAgo}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-xs">{fullDate}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        
          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mensaje
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border">
                <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                  {notification.message}
                </p>
              </div>
            </div>

            {notification.data && Object.keys(notification.data).length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Información adicional
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border">
                  <div className="space-y-2">
                    {notification.data.prizeName && (
                      <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Premio:</span>
                        <span className="text-sm font-medium">{notification.data.prizeName}</span>
                      </div>
                    )}
                    {notification.data.prizeValue && (
                      <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Valor:</span>
                        <span className="text-sm font-medium text-green-600">${notification.data.prizeValue}</span>
                      </div>
                    )}
                    {Object.entries(notification.data).map(([key, value]) => {
                      if (!['prizeId', 'prizeName', 'prizeValue', 'actionUrl', 'actionLabel'].includes(key) && value) {
                        return (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="text-sm font-medium">{String(value)}</span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              </div>
            )}

            {notification.data?.actionUrl && (
              <div className="flex justify-center pt-2 sm:pt-4">
                {notification.data.actionUrl.startsWith('http') ? (
                  <a
                    href={notification.data.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto justify-center"
                  >
                    {notification.data?.actionLabel ?? (notification.type === 'prize' ? 'Reclamar Premio' : 'Ver más')}
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                  </a>
                ) : (
                  <Button
                    size="lg"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto text-sm sm:text-base"
                    onClick={handleActionClick}
                  >
                    {notification.data?.actionLabel ?? (notification.type === 'prize' ? 'Reclamar Premio' : 'Ver más')}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
      </Card>
      </div>
    </AppLayout>
  )
}