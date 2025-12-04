'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { NotificationForm } from '@/app/admin/notifications/components/NotificationForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAdminNotifications } from '@/lib/hooks/useAdminNotifications'
import type { CreateNotificationRequest } from '@/lib/types/notifications'

export default function AdminNotificationsPage() {
  const { createBroadcast, isCreating, error, success, clearError, clearSuccess } = useAdminNotifications()
  const [lastBroadcast, setLastBroadcast] = useState<CreateNotificationRequest | null>(null)

  const handleSubmit = async (data: CreateNotificationRequest) => {
    try {
      clearError()
      clearSuccess()
      await createBroadcast(data)
      setLastBroadcast(data)
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <AppLayout
      title="Administración de Notificaciones"
      subtitle="Enviar notificaciones a todos los usuarios"
      badge={{
        text: 'Admin',
        variant: 'secondary',
        className: 'text-xs'
      }}
    >
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Success Alert */}
        {success && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Notificación Enviada
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              La notificación "{lastBroadcast?.title}" ha sido enviada exitosamente a todos los usuarios.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Crear Notificación
            </CardTitle>
            <CardDescription>
              Esta notificación será enviada a TODOS los usuarios de la plataforma inmediatamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationForm onSubmit={handleSubmit} isSubmitting={isCreating} />
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800 dark:text-blue-200">
              Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Las notificaciones se envían inmediatamente a todos los usuarios</li>
              <li>Los usuarios pueden marcarlas como leídas o eliminarlas</li>
              <li>El campo "data" es opcional y se usa para premios o URLs de acción</li>
              <li>Revisa cuidadosamente antes de enviar, no se puede deshacer</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
