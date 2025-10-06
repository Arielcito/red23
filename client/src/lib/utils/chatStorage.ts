import type { Message } from '@/lib/hooks/useChat'

const CHAT_STORAGE_KEY = 'red23_chat_messages'
const MAX_MESSAGES = 50 // Límite de mensajes guardados

interface SerializableMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
  imageUrl?: string
  isGenerating?: boolean
}

export const chatStorage = {
  saveMessages: (messages: Message[]): void => {
    try {
      const messagesToSave = messages.slice(-MAX_MESSAGES)

      const serializableMessages: SerializableMessage[] = messagesToSave.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))

      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(serializableMessages))

      console.log('💾 Chat guardado en localStorage:', serializableMessages.length, 'mensajes')
    } catch (error) {
      console.error('❌ Error guardando chat en localStorage:', error)
    }
  },

  loadMessages: (): Message[] | null => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY)

      if (!stored) {
        console.log('📭 No hay chat guardado en localStorage')
        return null
      }

      const parsed: SerializableMessage[] = JSON.parse(stored)

      const messages: Message[] = parsed.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))

      console.log('📬 Chat cargado desde localStorage:', messages.length, 'mensajes')

      return messages
    } catch (error) {
      console.error('❌ Error cargando chat desde localStorage:', error)
      return null
    }
  },

  clearMessages: (): void => {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY)
      console.log('🗑️ Chat eliminado de localStorage')
    } catch (error) {
      console.error('❌ Error eliminando chat de localStorage:', error)
    }
  },

  hasStoredMessages: (): boolean => {
    try {
      return localStorage.getItem(CHAT_STORAGE_KEY) !== null
    } catch (error) {
      return false
    }
  }
}
