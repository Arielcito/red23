"use client"

import { useRewards } from "@/lib/hooks/useRewards"
import { Gift } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RewardsMenuItemProps {
  className?: string
}

export function RewardsMenuItem({ className }: RewardsMenuItemProps) {
  const { nextDailyPrize } = useRewards()

  // Calcular tiempo restante para el Premio semanal
  const getTimeUntilDailyPrize = () => {
    const now = new Date()
    const target = nextDailyPrize
    const diff = target.getTime() - now.getTime()

    if (diff <= 0) return "¡Ya!"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex items-center gap-3">
        <Gift className="h-4 w-4" />
        <span>Premios</span>
      </div>
      <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
        {getTimeUntilDailyPrize()}
      </Badge>
    </div>
  )
}