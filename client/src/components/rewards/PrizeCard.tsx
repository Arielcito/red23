"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CountdownTimer } from "./CountdownTimer"
import { Star, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type PrizeTheme = "primary" | "amber" | "blue"

const THEME_STYLES: Record<PrizeTheme, { gradient: string; iconColor: string; starColor: string }> = {
  primary: {
    gradient: "from-primary/5 to-primary/20",
    iconColor: "text-primary",
    starColor: "text-yellow-500"
  },
  amber: {
    gradient: "from-amber-500/5 to-amber-600/20",
    iconColor: "text-amber-600",
    starColor: "text-amber-500"
  },
  blue: {
    gradient: "from-blue-600/5 to-blue-700/20",
    iconColor: "text-blue-600",
    starColor: "text-blue-500"
  }
}

interface PrizeCardProps {
  title: string
  description: string
  targetDate: Date
  prizeAmount: string
  icon: LucideIcon
  theme?: PrizeTheme
  className?: string
}

export function PrizeCard({
  title,
  description,
  targetDate,
  prizeAmount,
  icon: Icon,
  theme = "primary",
  className
}: PrizeCardProps) {
  const styles = THEME_STYLES[theme]

  console.log(`🎁 [PRIZE CARD - ${title}] Target date recibida:`, targetDate)
  console.log(`🎁 [PRIZE CARD - ${title}] Target date (locale):`, targetDate.toLocaleString())
  console.log(`🎁 [PRIZE CARD - ${title}] Target date (ISO):`, targetDate.toISOString())
  console.log(`🎁 [PRIZE CARD - ${title}] Premio:`, prizeAmount)
  console.log('---')

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br", styles.gradient)} />
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", styles.iconColor)} />
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <CountdownTimer
          targetDate={targetDate}
          label="Próximo sorteo en"
          className="mb-4"
        />
        <div className="flex items-center gap-2">
          <Star className={cn("h-4 w-4", styles.starColor)} />
          <span className="text-sm font-medium">Premio: {prizeAmount}</span>
        </div>
      </CardContent>
    </Card>
  )
}
