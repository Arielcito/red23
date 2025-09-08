// DEPRECATED: Este hook fue reemplazado por useImagesApi para usar la API en lugar de localStorage
// Se mantiene temporalmente para compatibilidad con tipos exportados
import { useState, useEffect } from 'react'

export interface StoredImage {
  id: string
  url: string
  title: string
  prompt: string
  timestamp: Date
  tags: string[]
  favorite: boolean
  scheduled: boolean
}

// DEPRECATED: Ya no se usa localStorage
const STORAGE_KEY = 'red23_generated_images'

// DEPRECATED: Este hook ya no se debe usar - usar useImagesApi en su lugar
export const useImageStorage = () => {
  // DEPRECATED: Funcionalidad deshabilitada - usar useImagesApi
  const [images, setImages] = useState<StoredImage[]>([])
  const [isLoading, setIsLoading] = useState(false) // Ya no carga desde localStorage

  /* DEPRECATED: Ya no se carga desde localStorage
  useEffect(() => {
    loadImagesFromStorage()
  }, [])

  const loadImagesFromStorage = () => {
    try {
      const storedImages = localStorage.getItem(STORAGE_KEY)
      if (storedImages) {
        const parsedImages = JSON.parse(storedImages).map((img: any) => ({
          ...img,
          timestamp: new Date(img.timestamp)
        }))
        setImages(parsedImages)
      }
    } catch (error) {
      console.error('Error loading images from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveImagesToStorage = (imagesToSave: StoredImage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imagesToSave))
    } catch (error) {
      console.error('Error saving images to localStorage:', error)
    }
  }
  */

  // DEPRECATED: Ya no se guardan imágenes en localStorage
  const saveImage = async (imageUrl: string, title: string, prompt: string) => {
    console.warn('⚠️  saveImage está deprecado - las imágenes ahora se manejan por la API')
    // Ya no guarda en localStorage, retorna un objeto mock para compatibilidad
    return {
      id: Date.now().toString(),
      url: imageUrl,
      title,
      prompt,
      timestamp: new Date(),
      tags: extractTagsFromPrompt(prompt),
      favorite: false,
      scheduled: false
    }
  }

  // DEPRECATED: Funciones ya no operan en localStorage
  const toggleFavorite = (imageId: string) => {
    console.warn('⚠️  toggleFavorite está deprecado - usar funcionalidad de la API')
    // Ya no opera en localStorage
  }

  const deleteImage = (imageId: string) => {
    console.warn('⚠️  deleteImage está deprecado - usar funcionalidad de la API')
    // Ya no opera en localStorage
  }

  const downloadImage = async (image: StoredImage) => {
    try {
      console.log('⬇️ Descargando imagen:', image.title)
      
      const fileName = `${image.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.png`
      
      // Estrategia 1: Si la imagen está en formato base64, usar directamente
      if (image.url.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = image.url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log('✅ Descarga base64 exitosa')
        return
      }
      
      // Estrategia 2: Para URLs externas, intentar diferentes métodos
      if (image.url.startsWith('http')) {
        // Método 1: Intentar con Canvas (funciona con CORS habilitado)
        try {
          await downloadImageViaCanvas(image.url, fileName)
          console.log('✅ Descarga via Canvas exitosa')
          return
        } catch (canvasError) {
          console.warn('Canvas download failed:', canvasError)
        }

        // Método 2: Intentar crear blob URL
        try {
          const response = await fetch(image.url, { mode: 'cors' })
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = fileName
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
        window.open(image.url, '_blank')
        return
      }
      
      // Para otros tipos de URL
      const link = document.createElement('a')
      link.href = image.url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log('✅ Descarga directa exitosa')
      
    } catch (error) {
      console.error('Error downloading image:', error)
      // Último recurso: abrir en nueva pestaña
      try {
        window.open(image.url, '_blank')
        console.log('Abriendo imagen en nueva pestaña como último recurso')
      } catch (openError) {
        console.error('No se pudo abrir la imagen:', openError)
        alert('No se pudo descargar la imagen. Puedes hacer clic derecho en la imagen para guardarla manualmente.')
        throw new Error('No se pudo descargar la imagen')
      }
    }
  }

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

  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      // Si ya es base64, retornar directamente
      if (imageUrl.startsWith('data:')) {
        return imageUrl
      }

      // Intentar fetch con diferentes configuraciones CORS
      let response: Response
      try {
        // Primer intento: sin CORS específico
        response = await fetch(imageUrl, {
          mode: 'cors'
        })
      } catch (corsError) {
        try {
          // Segundo intento: no-cors (limitado pero puede funcionar)
          response = await fetch(imageUrl, {
            mode: 'no-cors'
          })
        } catch (noCorsError) {
          console.warn('No se pudo obtener imagen via fetch, usando URL directa:', noCorsError)
          // Si falla completamente, devolver la URL original para descarga directa
          return imageUrl
        }
      }

      if (!response.ok && response.type !== 'opaque') {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => {
          console.warn('FileReader error, usando URL original:', error)
          // Si falla el FileReader, devolver URL original
          resolve(imageUrl)
        }
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.warn('Error converting image to base64, usando URL original:', error)
      // En caso de cualquier error, devolver la URL original
      return imageUrl
    }
  }

  const extractTagsFromPrompt = (prompt: string): string[] => {
    // Extract relevant tags from the prompt
    const commonCasinoTerms = [
      'casino', 'jackpot', 'slots', 'poker', 'blackjack', 'roulette', 
      'bonus', 'vip', 'promoción', 'premio', 'winner', 'gold', 'luxury'
    ]
    
    const lowerPrompt = prompt.toLowerCase()
    const tags = commonCasinoTerms.filter(term => lowerPrompt.includes(term))
    
    // Add generic tags based on content
    if (lowerPrompt.includes('banner')) tags.push('banner')
    if (lowerPrompt.includes('tarjeta')) tags.push('tarjeta')
    if (lowerPrompt.includes('evento')) tags.push('evento')
    
    return [...new Set(tags)] // Remove duplicates
  }

  const getFilteredImages = (filter: 'all' | 'favorites' | 'scheduled', searchTerm?: string) => {
    let filtered = images

    // Apply filter
    if (filter === 'favorites') {
      filtered = images.filter(img => img.favorite)
    } else if (filter === 'scheduled') {
      filtered = images.filter(img => img.scheduled)
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(img =>
        img.title.toLowerCase().includes(term) ||
        img.prompt.toLowerCase().includes(term) ||
        img.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    return filtered
  }

  return {
    images,
    isLoading,
    saveImage,
    toggleFavorite,
    deleteImage,
    downloadImage,
    getFilteredImages
  }
}