'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNotificationSchema, type CreateNotificationInput } from '@/lib/validations/notifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Send, Info } from 'lucide-react'

interface NotificationFormProps {
  onSubmit: (data: CreateNotificationInput) => Promise<void>
  isSubmitting: boolean
}

export function NotificationForm({ onSubmit, isSubmitting }: NotificationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreateNotificationInput>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      type: 'info',
      title: '',
      message: '',
      data: undefined
    }
  })

  const notificationType = watch('type')

  const handleFormSubmit = async (data: CreateNotificationInput) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Notificación *</Label>
        <Select
          value={notificationType}
          onValueChange={(value) => setValue('type', value as CreateNotificationInput['type'])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="success">✅ Éxito</SelectItem>
            <SelectItem value="info">ℹ️ Información</SelectItem>
            <SelectItem value="warning">⚠️ Advertencia</SelectItem>
            <SelectItem value="error">❌ Error</SelectItem>
            <SelectItem value="prize">🎁 Premio</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Ej: ¡Nueva funcionalidad disponible!"
          maxLength={100}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Escribe el mensaje de la notificación..."
          rows={4}
          maxLength={500}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Optional Data Section */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4" />
          <h3 className="text-sm font-medium">Datos Adicionales (Opcional)</h3>
        </div>

        <div className="space-y-4">
          {/* Prize ID (for prize type) */}
          {notificationType === 'prize' && (
            <div className="space-y-2">
              <Label htmlFor="data.prizeId">ID del Premio</Label>
              <Input
                id="data.prizeId"
                {...register('data.prizeId')}
                placeholder="Ej: daily-winner-001"
              />
            </div>
          )}

          {/* Prize Name */}
          {notificationType === 'prize' && (
            <div className="space-y-2">
              <Label htmlFor="data.prizeName">Nombre del Premio</Label>
              <Input
                id="data.prizeName"
                {...register('data.prizeName')}
                placeholder="Ej: 10% de reintegro"
              />
            </div>
          )}

          {/* Prize Value */}
          {notificationType === 'prize' && (
            <div className="space-y-2">
              <Label htmlFor="data.prizeValue">Valor del Premio</Label>
              <Input
                id="data.prizeValue"
                type="number"
                {...register('data.prizeValue', { valueAsNumber: true })}
                placeholder="Ej: 10"
              />
            </div>
          )}

          {/* Action URL */}
          <div className="space-y-2">
            <Label htmlFor="data.actionUrl">URL de Acción</Label>
            <Input
              id="data.actionUrl"
              {...register('data.actionUrl')}
              placeholder="Ej: /rewards o https://t.me/red23oficial"
            />
            {errors.data?.actionUrl && (
              <p className="text-sm text-red-500">{errors.data.actionUrl.message}</p>
            )}
          </div>

          {/* Action Label */}
          <div className="space-y-2">
            <Label htmlFor="data.actionLabel">Etiqueta del Botón</Label>
            <Input
              id="data.actionLabel"
              {...register('data.actionLabel')}
              placeholder="Ej: Ver más"
              maxLength={50}
            />
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Enviando...' : 'Enviar Notificación a Todos'}
      </Button>
    </form>
  )
}
