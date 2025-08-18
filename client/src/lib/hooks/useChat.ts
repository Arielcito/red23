import { useState } from "react"

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
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const mockImagePrompts = [
    "Banner promocional con jackpot de $1M",
    "Tarjeta de fidelidad VIP dorada",
    "Banner de bonificación de bienvenida",
    "Promoción de slots con premios",
    "Evento especial de blackjack",
  ]

  const mockGeneratedImages = [
    "/placeholder.svg?height=400&width=800&text=Jackpot+$1M",
    "/placeholder.svg?height=400&width=800&text=VIP+Card",
    "/placeholder.svg?height=400&width=800&text=Welcome+Bonus",
    "/placeholder.svg?height=400&width=800&text=Slots+Promo",
    "/placeholder.svg?height=400&width=800&text=Blackjack+Event",
  ]

  const chatStats: ChatStats = {
    imagesGeneratedToday: 12,
    dailyLimit: 50,
    usagePercentage: 24,
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsGenerating(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `He creado una imagen de marketing para casino basada en tu descripción: "${content}". Aquí tienes el resultado optimizado para promociones:`,
        timestamp: new Date(),
        imageUrl: mockGeneratedImages[Math.floor(Math.random() * mockGeneratedImages.length)],
      }
      setMessages(prev => [...prev, aiMessage])
      setIsGenerating(false)
    }, 3000)
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
  }
}
