import type { ApiConfig } from '@/lib/types/imageGeneration'

/**
 * Configuración de la API de Generación de Imágenes
 * Utiliza variables de entorno con valores por defecto para mantener compatibilidad
 */
export const getImageGeneratorConfig = (): ApiConfig => {
  return {
    baseUrl: process.env.NEXT_PUBLIC_IMAGE_GENERATOR_API_URL ||
             'https://imagesgeneratorapi-219275077232.us-central1.run.app',
    endpoint: process.env.IMAGE_GENERATOR_API_ENDPOINT || '/generate',
    authorizationToken: process.env.IMAGE_GENERATOR_API_TOKEN ||
                       'Bearer PpIaCbhaKLsMaJ659upB51zlG51LesQ9aX5cjoqlePew5mDWW1pH17Q0M76lBuo2'
  }
}

/**
 * Configuración por defecto (hardcoded) para mantener compatibilidad
 * Se usa cuando no se pueden acceder a las variables de entorno
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://imagesgeneratorapi-219275077232.us-central1.run.app',
  endpoint: '/generate',
  authorizationToken: 'Bearer PpIaCbhaKLsMaJ659upB51zlG51LesQ9aX5cjoqlePew5mDWW1pH17Q0M76lBuo2'
}

/**
 * Función helper para obtener la configuración con fallback
 */
export const getApiConfig = (): ApiConfig => {
  try {
    return getImageGeneratorConfig()
  } catch {
    console.warn('⚠️ No se pudieron cargar las variables de entorno, usando configuración por defecto')
    return DEFAULT_API_CONFIG
  }
}
