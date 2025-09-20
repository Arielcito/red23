import { z } from 'zod'

export const uploadImageRequestSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'Al menos un archivo es requerido'),
  user_email: z.string().email('Email válido requerido'),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional()
})

export const uploadImageResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    message: z.string(),
    images: z.array(z.object({
      id: z.number(),
      filename: z.string(),
      url: z.string().url(),
      size: z.number(),
      type: z.string(),
      created_at: z.string()
    })),
    metadata: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string())
    })
  }).optional(),
  error: z.string().optional()
})