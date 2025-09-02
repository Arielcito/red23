"use client"

import { useRewards } from "@/lib/hooks/useRewards"
import { CountdownTimer } from "./CountdownTimer"
import { RecentWinners } from "./RecentWinners"
import { Separator } from "@/components/ui/separator"
import { Gift } from "lucide-react"

interface RewardsSectionProps {
  className?: string
}

export function RewardsSection({ className }: RewardsSectionProps) {
  const { nextDailyPrize, nextMonthlyPrize, recentWinners, isLoading } = useRewards()

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold">Premios</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <CountdownTimer
            targetDate={nextDailyPrize}
            label="Próximo premio diario"
            className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
          />
          
          <CountdownTimer
            targetDate={nextMonthlyPrize}
            label="Premio mensual"
            className="p-3 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-lg border border-secondary/20"
          />
        </div>

        <Separator className="my-4" />

        <RecentWinners
          winners={recentWinners}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}