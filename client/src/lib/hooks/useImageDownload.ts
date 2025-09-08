import { useState, useCallback } from 'react'

interface UseImageDownloadReturn {
  downloadImage: (imageUrl: string, fileName?: string) => Promise<void>
  isDownloading: boolean
  error: string | null
  clearError: () => void
}

export const useImageDownload = (): UseImageDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadImage = useCallback(async (imageUrl: string, fileName?: string): Promise<void> => {
    try {
      setIsDownloading(true)
      setError(null)
      console.log('⬇️ Iniciando descarga de imagen:', imageUrl)
      
      const finalFileName = fileName || `imagen_${Date.now()}.png`
      
      // Estrategia 1: Si la imagen está en formato base64, usar directamente
      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = finalFileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log('✅ Descarga base64 exitosa')
        return
      }
      
      // Estrategia 2: Para URLs externas, intentar diferentes métodos
      if (imageUrl.startsWith('http')) {
        // Método 1: Intentar con Canvas (funciona con CORS habilitado)
        try {
          await downloadImageViaCanvas(imageUrl, finalFileName)
          console.log('✅ Descarga via Canvas exitosa')
          return
        } catch (canvasError) {
          console.warn('Canvas download failed:', canvasError)
        }

        // Método 2: Intentar crear blob URL
        try {
          const response = await fetch(imageUrl, { mode: 'cors' })
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = finalFileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
          console.log('✅ Descarga via blob exitosa')
          return
        } catch (fetchError) {
          console.warn('Fetch download failed:', fetchError)
        }

        // Método 3: Fallback - abrir en nueva pestaña
        console.warn('Abriendo imagen en nueva pestaña como fallback')
        window.open(imageUrl, '_blank')
        return
      }
      
      // Para otros tipos de URL
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = finalFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log('✅ Descarga directa exitosa')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al descargar imagen'
      console.error('Error downloading image:', error)
      setError(errorMessage)
      
      // Último recurso: abrir en nueva pestaña
      try {
        window.open(imageUrl, '_blank')
        console.log('Abriendo imagen en nueva pestaña como último recurso')
      } catch (openError) {
        console.error('No se pudo abrir la imagen:', openError)
        throw new Error('No se pudo descargar la imagen. Puedes hacer clic derecho en la imagen para guardarla manualmente.')
      }
    } finally {
      setIsDownloading(false)
    }
  }, [])

  // Función auxiliar para descargar usando Canvas
  const downloadImageViaCanvas = async (imageUrl: string, fileName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('No se pudo crear contexto canvas'))
            return
          }
          
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('No se pudo crear blob desde canvas'))
              return
            }
            
            const blobUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
            resolve()
          }, 'image/png')
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => {
        reject(new Error('No se pudo cargar la imagen'))
      }
      
      img.src = imageUrl
    })
  }

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    downloadImage,
    isDownloading,
    error,
    clearError
  }
}