import { z } from 'zod'

// Validación para la solicitud de generación de imagen
export const generateImageRequestSchema = z.object({
  prompt: z.string()
    .min(1, 'El prompt es obligatorio')
    .max(1000, 'El prompt no puede tener más de 1000 caracteres')
    .refine(
      (prompt) => prompt.trim().length > 0,
      'El prompt no puede estar vacío'
    ),
  images: z.array(z.string().url('Cada imagen debe ser una URL válida'))
    .optional()
    .default([])
})

// Validación para la respuesta de la API
export const generateImageResponseSchema = z.object({
  success: z.boolean(),
  imageUrl: z.string().url('La URL de la imagen debe ser válida').optional(),
  error: z.string().optional()
})

// Tipos inferidos de los esquemas
export type GenerateImageRequest = z.infer<typeof generateImageRequestSchema>
export type GenerateImageResponse = z.infer<typeof generateImageResponseSchema>

// Validación para la respuesta completa de la API externa
export const externalApiResponseSchema = z.object({
  data: z.object({
    created_at: z.string(),
    logo: z.string().nullable(),
    position: z.string().nullable(),
    prompt: z.string(),
    result: z.string().url('La URL del resultado debe ser válida'),
    result_with_logo: z.string().nullable()
  }),
  message: z.string(),
  request_id: z.string(),
  status: z.string()
})
