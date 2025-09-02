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

const STORAGE_KEY = 'red23_generated_images'

export const useImageStorage = () => {
  const [images, setImages] = useState<StoredImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const saveImage = async (imageUrl: string, title: string, prompt: string) => {
    try {
      console.log('💾 Guardando imagen en localStorage:', title)
      
      // Convert image to base64 for local storage
      const base64Image = await convertImageToBase64(imageUrl)
      
      const newImage: StoredImage = {
        id: Date.now().toString(),
        url: base64Image,
        title,
        prompt,
        timestamp: new Date(),
        tags: extractTagsFromPrompt(prompt),
        favorite: false,
        scheduled: false
      }

      const updatedImages = [newImage, ...images]
      setImages(updatedImages)
      saveImagesToStorage(updatedImages)
      
      console.log('✅ Imagen guardada exitosamente')
      return newImage
    } catch (error) {
      console.error('Error saving image:', error)
      throw error
    }
  }

  const toggleFavorite = (imageId: string) => {
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, favorite: !img.favorite } : img
    )
    setImages(updatedImages)
    saveImagesToStorage(updatedImages)
  }

  const deleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId)
    setImages(updatedImages)
    saveImagesToStorage(updatedImages)
  }

  const downloadImage = async (image: StoredImage) => {
    try {
      console.log('⬇️ Descargando imagen:', image.title)
      
      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = image.url
      link.download = `${image.title.replace(/\s+/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ Descarga iniciada')
    } catch (error) {
      console.error('Error downloading image:', error)
      throw error
    }
  }

  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error converting image to base64:', error)
      throw error
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