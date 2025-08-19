import { Button } from "@/components/ui/button"
import { Download, Share2, Bot, User, Calendar } from "lucide-react"
import { Message } from "@/lib/hooks/useChat"

interface ChatMessageProps {
  message: Message
  onSchedule?: (imageUrl: string, title: string) => void
}

export const ChatMessage = ({ message, onSchedule }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] ${
          message.type === "user"
            ? "bg-primary-500 text-white rounded-l-lg rounded-tr-lg"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg rounded-tl-lg"
        } p-4`}
      >
        <div className="flex items-start space-x-2">
          {message.type === "ai" && (
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm">{message.content}</p>
            {message.imageUrl && (
              <div className="mt-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-lg">
                  <img
                    src={message.imageUrl}
                    alt="Imagen promocional de casino"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Share2 className="h-3 w-3 mr-1" />
                    Compartir
                  </Button>
                  {onSchedule && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs bg-green-50 hover:bg-green-100 border-green-200"
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
