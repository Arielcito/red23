"use client"

import { Crown, Trophy, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WinnerBannerProps {
  winner: {
    name: string
    points: number
    avatar?: string
  }
  className?: string
}

export function WinnerBanner({ winner, className }: WinnerBannerProps) {
  return (
    <Card className={cn(
      "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800",
      className
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                {winner.avatar ? (
                  <img 
                    src={winner.avatar} 
                    alt={winner.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-yellow-800" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">
                  Ganador del Día
                </Badge>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {winner.name}
              </h3>
              <div className="flex items-center space-x-1 text-yellow-700 dark:text-yellow-300">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm sm:text-base font-semibold">
                  {winner.points.toLocaleString()} puntos
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
              ¡Felicidades!
            </span>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            🎉 <strong>{winner.name}</strong> lidera el ranking de hoy con la mayor cantidad de puntos ganados. 
            ¡Sigue generando contenido increíble!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}