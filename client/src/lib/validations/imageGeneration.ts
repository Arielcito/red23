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
    .default([]),
  logo: z.string().url('El logo debe ser una URL válida').optional(),
  position: z.number().int().min(1).max(9).optional().default(9),
  tokens: z.number().int().min(0).optional().default(0),
  user_email: z.string().email('El email debe ser válido').optional(),
  aspect_ratio: z.enum(['9:16', '16:9', '1:1']).optional().default('1:1')
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
    position: z.number().nullable(),
    prompt: z.string(),
    result: z.string().url('La URL del resultado debe ser válida'),
    result_with_logo: z.string().nullable(),
    user_email: z.string().optional(),
    tokens: z.number().optional()
  }),
  message: z.string(),
  request_id: z.string(),
  status: z.string()
})

// Validación para el endpoint GET /images
export const getImagesRequestSchema = z.object({
  user_email: z.string().email('El email debe ser válido').optional(),
  limit: z.number().int().min(1).max(100).optional().default(20),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD').optional()
})

export const getImagesResponseSchema = z.object({
  count: z.number(),
  data: z.array(z.object({
    id: z.number(),
    created_at: z.string(),
    logo: z.string().nullable(),
    prompt: z.string(),
    request_id: z.string(),
    result: z.string().url('La URL debe ser válida'),
    result_with_logo: z.string().nullable(),
    tokens: z.number(),
    user_email: z.string()
  })),
  end_date: z.string().nullable(),
  limit: z.number(),
  start_date: z.string().nullable(),
  status: z.string()
})

// Validación para el endpoint GET /winners
export const getWinnersRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD').optional()
})

export const getWinnersResponseSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    first_name: z.string(),
    message: z.string(),
    user_id: z.number(),
    username: z.string().nullable(),
    won_at: z.string()
  })),
  status: z.string()
})
