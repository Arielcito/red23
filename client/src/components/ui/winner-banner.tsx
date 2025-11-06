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
      "bg-gradient-to-r from-[var(--winner-card-bg-start)] to-[var(--winner-card-bg-end)] border-[var(--winner-card-border)]",
      className
    )}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--winner-avatar-start)] to-[var(--winner-avatar-end)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">
                  {winner.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--winner-crown-bg)] rounded-full flex items-center justify-center">
                <Crown className="h-2 w-2 text-[var(--winner-crown-text)]" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="h-3 w-3 text-[var(--winner-icon)]" />
                <Badge className="bg-[var(--winner-badge-bg)] text-[var(--winner-badge-text)] border-[var(--winner-badge-border)] text-xs px-2 py-0">
                  Ganador del Día
                </Badge>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--winner-title)]">
                Usuario Ganador
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--winner-avatar-start)] to-[var(--winner-avatar-end)] rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-[var(--winner-secondary-text)] font-medium">
              ¡Felicidades!
            </span>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 p-2 bg-[var(--winner-inner-bg)] rounded-lg">
          <p className="text-xs text-[var(--winner-text)] text-center">
            🎉 ¡Hay un nuevo ganador del día! ¡Sigue generando contenido increíble para tener la oportunidad de ganar!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}