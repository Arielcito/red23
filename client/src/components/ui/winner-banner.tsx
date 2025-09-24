"use client"

import { Crown, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WinnerBannerProps {
  winner: {
    name: string
    points?: number
    avatar?: string
  }
  className?: string
}

export function WinnerBanner({ winner, className }: WinnerBannerProps) {
  return (
    <Card className={cn(
      "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/40 border-gray-300 dark:border-gray-600",
      className
    )}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">
                  {winner.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                <Crown className="h-2 w-2 text-gray-900" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="h-3 w-3 text-gray-600" />
                <Badge className="bg-gray-200 text-gray-800 border-gray-400 dark:bg-gray-700/40 dark:text-gray-300 text-xs px-2 py-0">
                  Ganador del Día
                </Badge>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Usuario Ganador
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              ¡Felicidades!
            </span>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
            🎉 ¡Hay un nuevo ganador del día! ¡Sigue generando contenido increíble para tener la oportunidad de ganar!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}