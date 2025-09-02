import { Button } from "@/components/ui/button"
import { Download, Bot, User, Calendar } from "lucide-react"
import { Message } from "@/lib/hooks/useChat"
import { useImageStorage } from "@/lib/hooks/useImageStorage"
import { useEffect, useState } from "react"

interface ChatMessageProps {
  message: Message
  onSchedule?: (imageUrl: string, title: string) => void
}

export const ChatMessage = ({ message, onSchedule }: ChatMessageProps) => {
  const { saveImage } = useImageStorage()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Auto-save image to localStorage when message with image is received
  useEffect(() => {
    if (message.imageUrl && message.type === "ai" && !isSaved) {
      const autoSaveImage = async () => {
        try {
          const title = `Imagen generada ${new Date().toLocaleDateString()}`
          const prompt = message.content.includes('"') 
            ? message.content.split('"')[1] 
            : "Imagen promocional de casino"
          
          await saveImage(message.imageUrl!, title, prompt)
          setIsSaved(true)
          console.log('📦 Imagen guardada automáticamente en galería')
        } catch (error) {
          console.error('Error auto-saving image:', error)
        }
      }
      
      autoSaveImage()
    }
  }, [message.imageUrl, message.type, message.content, saveImage, isSaved])

  const handleDownload = async () => {
    if (!message.imageUrl) return
    
    try {
      setIsDownloading(true)
      console.log('⬇️ Iniciando descarga de imagen')
      
      const response = await fetch(message.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `casino_promo_${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
      console.log('✅ Descarga completada')
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Error al descargar la imagen')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[70%] md:max-w-[65%] ${
          message.type === "user"
            ? "bg-primary-500 text-white rounded-l-lg rounded-tr-lg"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg rounded-tl-lg"
        } p-3 sm:p-4`}
      >
        <div className="flex items-start space-x-2">
          {message.type === "ai" && (
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-xs sm:text-sm break-words">{message.content}</p>
            {message.imageUrl && (
              <div className="mt-2 sm:mt-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-0.5 sm:p-1 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <img
                    src={message.imageUrl}
                    alt="Imagen promocional de casino"
                    className="w-full h-auto max-h-48 sm:max-h-64 md:max-h-80 object-contain rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-8 flex-1 sm:flex-none"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {isDownloading ? 'Descargando...' : 'Descargar'}
                  </Button>
                  {onSchedule && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8 bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-800 flex-1 sm:flex-none"
                      onClick={() => onSchedule(message.imageUrl!, "Imagen promocional")}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Programar
                    </Button>
                  )}
                </div>
              </div>
            )}
            <p className="text-xs opacity-70 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
          {message.type === "user" && (
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
