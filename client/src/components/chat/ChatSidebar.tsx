import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Image, Settings, Sparkles } from "lucide-react"
import { ChatStats } from "@/lib/hooks/useChat"

interface ChatSidebarProps {
  quickPrompts: string[]
  onQuickPrompt: (prompt: string) => void
  stats: ChatStats
}

export const ChatSidebar = ({ quickPrompts, onQuickPrompt, stats }: ChatSidebarProps) => {
  return (
    <div className="w-full h-full border-l-0 lg:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">Sugerencias Casino</h3>
          <div className="space-y-2">
            {quickPrompts.slice(0, 3).map((prompt) => (
              <Button
                key={prompt}
                variant="ghost"
                size="sm"
                onClick={() => onQuickPrompt(prompt)}
                className="w-full justify-start text-left text-xs h-auto py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Image className="h-3 w-3 mr-2 flex-shrink-0 text-primary-600" />
                <span className="text-wrap text-left leading-tight">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">Estadísticas</h3>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="pt-4 pb-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Generadas hoy:</span>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{stats.imagesGeneratedToday}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Límite diario:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.dailyLimit}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Progreso</span>
                    <span>{stats.usagePercentage}%</span>
                  </div>
                  <Progress value={stats.usagePercentage} className="w-full h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">Configuración</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-auto py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Settings className="h-3 w-3 mr-2 flex-shrink-0 text-primary-600" />
              <span>Estilo promocional</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-auto py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Image className="h-3 w-3 mr-2 flex-shrink-0 text-primary-600" />
              <span>Tamaño banner</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-auto py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Sparkles className="h-3 w-3 mr-2 flex-shrink-0 text-primary-600" />
              <span>Modelo de IA</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
