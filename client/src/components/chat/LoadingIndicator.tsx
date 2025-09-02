import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Bot, Loader2, Sparkles, Wand2 } from "lucide-react"

const loadingMessages = [
  "Analizando tu prompt creativo...",
  "Generando imagen promocional...",
  "Aplicando estilos y efectos...",
  "Optimizando calidad de imagen...",
  "¡Casi listo! Procesando detalles finales..."
]

export const LoadingIndicator = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(10)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 15 + 5 // Avance aleatorio entre 5-20%
      })
    }, 800)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg rounded-tl-lg p-3 sm:p-4 shadow-lg max-w-[85%] sm:max-w-[70%]">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <div className="relative">
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-purple-500" />
                <Wand2 className="h-2 w-2 sm:h-3 sm:w-3 absolute -top-1 -right-1 text-pink-500 animate-bounce" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {loadingMessages[currentMessageIndex]}
              </p>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <Progress
                value={progress}
                className="flex-1 h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700"
              />
              <div className="flex items-center space-x-1">
                <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-500 animate-pulse" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 hidden sm:block">
              Esto puede tomar unos segundos. ¡Tu imagen estará lista pronto! ✨
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:hidden">
              ¡Casi listo! ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
