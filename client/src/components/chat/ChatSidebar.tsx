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
    <div className="w-72 border-l border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Sugerencias Casino</h3>
          <div className="space-y-1">
            {quickPrompts.slice(0, 3).map((prompt) => (
              <Button
                key={prompt}
                variant="ghost"
                size="sm"
                onClick={() => onQuickPrompt(prompt)}
                className="w-full justify-start text-left text-xs"
              >
                <Image className="h-3 w-3 mr-2" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Estadísticas</h3>
          <Card>
            <CardContent className="pt-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Imágenes generadas hoy:</span>
                  <span className="text-xs font-medium">{stats.imagesGeneratedToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Límite diario:</span>
                  <span className="text-xs font-medium">{stats.dailyLimit}</span>
                </div>
                <Progress value={stats.usagePercentage} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Configuración</h3>
          <div className="space-y-1">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Settings className="h-3 w-3 mr-2" />
              Estilo promocional
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Image className="h-3 w-3 mr-2" />
              Tamaño banner
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Sparkles className="h-3 w-3 mr-2" />
              Modelo de IA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
