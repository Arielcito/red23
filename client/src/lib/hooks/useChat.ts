import { useState } from "react"
import { useImageGeneration } from "./useImageGeneration"
import { useImagesApi } from "./useImagesApi"

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

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "¡Hola! Soy tu asistente de IA especializado en marketing para casinos. ¿Qué tipo de imagen promocional te gustaría crear hoy?",
      timestamp: new Date(Date.now() - 60000),
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const { generateImage, isGenerating, error } = useImageGeneration()
  const { images: apiImages } = useImagesApi()

  const mockImagePrompts = [
    "Banner promocional con jackpot de $1M",
    "Tarjeta de fidelidad VIP dorada",
    "Banner de bonificación de bienvenida",
    "Promoción de slots con premios",
    "Evento especial de blackjack",
  ]


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

  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return

    console.log('💬 Enviando mensaje:', content)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // Generar imagen usando la API real
    const result = await generateImage({ prompt: content })
    
    let aiMessage: Message

    if (result.success && result.imageUrl) {
      console.log('🎉 Imagen generada correctamente')
      aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `He creado una imagen de marketing para casino basada en tu descripción: "${content}". Aquí tienes el resultado optimizado para promociones:`,
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

  return {
    messages,
    isGenerating,
    inputValue,
    setInputValue,
    mockImagePrompts,
    chatStats,
    sendMessage,
    setQuickPrompt,
    clearInput,
    error,
  }
}
