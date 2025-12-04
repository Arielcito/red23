import { z } from 'zod'

export const createNotificationSchema = z.object({
  type: z.enum(['success', 'warning', 'info', 'error', 'prize'], {
    required_error: 'El tipo de notificación es requerido',
    invalid_type_error: 'Tipo de notificación inválido'
  }),
  title: z.string()
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede exceder 100 caracteres')
    .trim(),
  message: z.string()
    .min(1, 'El mensaje es requerido')
    .max(500, 'El mensaje no puede exceder 500 caracteres')
    .trim(),
  data: z.object({
    prizeId: z.string().optional(),
    prizeName: z.string().optional(),
    prizeValue: z.number().positive().optional(),
    actionUrl: z.string().url('URL inválida').optional().or(z.literal('')),
    actionLabel: z.string().max(50).optional()
  }).optional()
})

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
