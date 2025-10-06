import { useState, useEffect } from "react"
import { useImageGeneration } from "./useImageGeneration"
import { useImagesApi } from "./useImagesApi"
import { useUser } from "./useUser"
import { chatStorage } from "@/lib/utils/chatStorage"

export interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  imageUrl?: string
  isGenerating?: boolean
}

export interface ChatStats {
  imagesGeneratedToday: number
  dailyLimit: number
  usagePercentage: number
}

export interface SendMessageOptions {
  logoUrl?: string
  logoPosition?: number
  userEmail?: string
  images?: string[]
  tokens?: number
  aspectRatio?: "9:16" | "16:9" | "1:1"
  originalPrompt?: string
}

export const useChat = () => {
  const defaultMessage: Message = {
    id: "1",
    type: "ai",
    content: "¡Hola! Soy tu asistente de IA especializado en marketing para casinos. ¿Qué tipo de imagen promocional te gustaría crear hoy?",
    timestamp: new Date(Date.now() - 60000),
  }

  const [messages, setMessages] = useState<Message[]>([defaultMessage])
  const [isLoadingFromCache, setIsLoadingFromCache] = useState(true)

  const [inputValue, setInputValue] = useState("")
  const { generateImage, isGenerating, error } = useImageGeneration()
  const { images: apiImages } = useImagesApi()
  const { user } = useUser()

  useEffect(() => {
    const loadCachedMessages = () => {
      const cachedMessages = chatStorage.loadMessages()

      if (cachedMessages && cachedMessages.length > 0) {
        setMessages(cachedMessages)
      }

      setIsLoadingFromCache(false)
    }

    loadCachedMessages()
  }, [])

  useEffect(() => {
    if (!isLoadingFromCache && messages.length > 0) {
      chatStorage.saveMessages(messages)
    }
  }, [messages, isLoadingFromCache])



  // Calcular estadísticas basadas en las imágenes de la API
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const imagesGeneratedToday = apiImages.filter(img =>
    new Date(img.created_at) >= today
  ).length

  const chatStats: ChatStats = {
    imagesGeneratedToday,
    dailyLimit: 50,
    usagePercentage: Math.min(Math.round((imagesGeneratedToday / 50) * 100), 100),
  }

  const sendMessage = async (content: string, options: SendMessageOptions = {}) => {
    if (!content.trim() || isGenerating) return

    console.log('💬 Enviando mensaje:', content)

    const trimmedLogoUrl = options.logoUrl?.trim()
    const normalizedLogo = trimmedLogoUrl ? trimmedLogoUrl : undefined
    const normalizedPosition = normalizedLogo && typeof options.logoPosition === 'number'
      ? options.logoPosition
      : undefined
    const normalizedEmail = options.userEmail?.trim() || user?.email || undefined
    const filteredImages = options.images && options.images.length > 0 ? options.images : undefined

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // Generar imagen usando la API real
    const result = await generateImage({
      prompt: content,
      logo: normalizedLogo,
      position: normalizedPosition,
      user_email: normalizedEmail,
      images: filteredImages,
      tokens: options.tokens,
      aspect_ratio: options.aspectRatio || "1:1"
    })
    
    let aiMessage: Message

    if (result.success && result.imageUrl) {
      console.log('🎉 Imagen generada correctamente')
      const promptToShow = options.originalPrompt || content.split('\n')[0] // Usar originalPrompt o primera línea si no está disponible
      aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `He creado una imagen de marketing para casino basada en tu descripción: "${promptToShow}". Aquí tienes el resultado optimizado para promociones:`,
        timestamp: new Date(),
        imageUrl: result.imageUrl,
      }
    } else {
      console.log('⚠️ Error generando imagen:', result.error)
      aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Lo siento, hubo un problema al generar la imagen: ${result.error || 'Error desconocido'}. Por favor, intenta con otro prompt.`,
        timestamp: new Date(),
      }
    }

    setMessages(prev => [...prev, aiMessage])
  }

  const setQuickPrompt = (prompt: string) => {
    setInputValue(prompt)
  }

  const clearInput = () => {
    setInputValue("")
  }

  const clearChat = () => {
    setMessages([defaultMessage])
    chatStorage.clearMessages()
    console.log('🗑️ Chat limpiado')
  }

  return {
    messages,
    isGenerating,
    inputValue,
    setInputValue,
    chatStats,
    sendMessage,
    setQuickPrompt,
    clearInput,
    clearChat,
    error,
  }
}
