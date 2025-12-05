import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funciones de utilidad para manejar fechas en GMT-3 (Argentina - Buenos Aires)

/**
 * Convierte una fecha a zona horaria GMT-3
 */
export function toGMTMinus3(date: Date | string): Date {
  const d = new Date(date)
  // GMT-3 = UTC-3, así que restamos 3 horas
  return new Date(d.getTime() - (3 * 60 * 60 * 1000))
}

/**
 * Formatea una fecha relativa (Hoy, Ayer, Hace X días) en GMT-3
 */
export function formatRelativeDate(date: Date | string): string {
  const nowGMT3 = toGMTMinus3(new Date())
  const targetGMT3 = toGMTMinus3(date)

  const diffTime = nowGMT3.getTime() - targetGMT3.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Ayer"
  if (diffDays === 2) return "Hace 2 días"
  if (diffDays < 7) return `Hace ${diffDays} días`

  // Para fechas más antiguas, mostrar fecha completa
  return targetGMT3.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short"
  })
}

/**
 * Formatea una fecha completa en GMT-3 con día de la semana
 */
export function formatFullDate(date: Date | string): string {
  const dateGMT3 = toGMTMinus3(date)
  return dateGMT3.toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Formatea fecha y hora en GMT-3
 */
export function formatDateTime(date: Date | string): string {
  const dateGMT3 = toGMTMinus3(date)
  return dateGMT3.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Convierte una fecha a formato ISO string en GMT-3
 */
export function toISOStringGMT3(date: Date | string): string {
  const dateGMT3 = toGMTMinus3(date)
  return dateGMT3.toISOString()
}

/**
 * Obtiene la fecha actual en GMT-3
 */
export function nowGMT3(): Date {
  return toGMTMinus3(new Date())
}

/**
 * Formatea fecha para noticias (día, mes, año) en GMT-3
 */
export function formatNewsDate(date: Date | string): string {
  const dateGMT3 = toGMTMinus3(date)
  return dateGMT3.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Formatea fecha corta (día, mes abreviado, año) en GMT-3
 */
export function formatShortDate(date: Date | string): string {
  const dateGMT3 = toGMTMinus3(date)
  return dateGMT3.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Convierte enlaces de Google Drive a enlaces directos para imágenes
 * @param url - URL de Google Drive
 * @returns URL directa o la URL original si no es de Drive
 */
export function convertDriveUrlToDirect(url: string): string {
  if (!url) return url

  // Patrón para enlaces de compartir de Google Drive
  const drivePattern = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/
  const match = url.match(drivePattern)

  if (match?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }

  // Patrón para enlaces directos que ya están convertidos
  const directPattern = /https:\/\/drive\.google\.com\/uc\?export=view&id=/
  if (directPattern.test(url)) {
    return url
  }

  return url
}

/**
 * Convierte enlaces de Google Drive a enlaces directos para videos
 * @param url - URL de Google Drive
 * @returns URL directa para video o la URL original si no es de Drive
 */
export function convertDriveUrlToVideo(url: string): string {
  if (!url) return url

  // Patrón para enlaces de compartir de Google Drive
  const drivePattern = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/view|\/preview)?/
  const match = url.match(drivePattern)

  if (match?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`
  }

  // Patrón para enlaces directos que ya están convertidos
  const directPattern = /https:\/\/drive\.google\.com\/uc\?export=download&id=/
  if (directPattern.test(url)) {
    return url
  }

  return url
}

/**
 * Valida si una URL es una imagen válida para nuestro sistema
 * @param url - URL a validar
 * @returns true si es una URL de imagen válida
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false

  try {
    const urlObj = new URL(url)

    // Verificar hostnames permitidos
    const allowedHostnames = [
      'drive.google.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
      'imgur.com',
      'i.imgur.com',
      'cdn.pixabay.com',
      'picsum.photos'
    ]

    if (!allowedHostnames.includes(urlObj.hostname)) {
      return false
    }

    // Verificar extensiones de imagen comunes
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const pathname = urlObj.pathname.toLowerCase()

    return imageExtensions.some(ext => pathname.endsWith(ext))
  } catch {
    return false
  }
}
