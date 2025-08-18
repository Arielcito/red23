import { Progress } from "@/components/ui/progress"
import { Bot, Loader2 } from "lucide-react"

export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg rounded-tl-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="h-3 w-3 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-3 w-3 animate-spin text-purple-500" />
              <p className="text-xs">Generando imagen promocional...</p>
            </div>
            <Progress value={65} className="mt-2 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
