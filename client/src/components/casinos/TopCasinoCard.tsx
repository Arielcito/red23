"use client"

import type { TopCasino } from '@/lib/supabase/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CASINO_PRECIO_VALUES } from '@/lib/supabase/types'

interface TopCasinoCardProps {
  casino: TopCasino
  className?: string
}

export function TopCasinoCard({ casino, className }: TopCasinoCardProps) {
  const getPositionStyles = (position: number) => {
    switch (position) {
      case 1:
        return {
          gradient: 'from-yellow-400 to-yellow-600',
          shadow: 'shadow-yellow-200 dark:shadow-yellow-900/20',
          border: 'border-yellow-300 dark:border-yellow-700'
        }
      case 2:
        return {
          gradient: 'from-gray-300 to-gray-500', 
          shadow: 'shadow-gray-200 dark:shadow-gray-900/20',
          border: 'border-gray-300 dark:border-gray-700'
        }
      case 3:
        return {
          gradient: 'from-orange-400 to-orange-600',
          shadow: 'shadow-orange-200 dark:shadow-orange-900/20', 
          border: 'border-orange-300 dark:border-orange-700'
        }
      default:
        return {
          gradient: 'from-gray-200 to-gray-400',
          shadow: 'shadow-gray-200 dark:shadow-gray-900/20',
          border: 'border-gray-300 dark:border-gray-700'
        }
    }
  }

  const positionStyles = getPositionStyles(casino.position)

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg',
      positionStyles.shadow,
      positionStyles.border,
      className
    )}>
      {/* Position badge */}
      <div className={cn(
        'absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs z-10 bg-gradient-to-br',
        positionStyles.gradient
      )}>
        #{casino.position}
      </div>

      <CardHeader className="pb-1 p-2 pt-2">
        <div className="relative h-16 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {casino.logo ? (
            <Image
              src={casino.logo}
              alt={casino.casinoName}
              fill
              className="object-contain p-2 transition-transform duration-300 hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<span class="text-2xl font-bold text-muted-foreground">${casino.casinoName.charAt(0)}</span>`
                }
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">
              {casino.casinoName.charAt(0)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-1 p-2">
        <div>
          <h3 className="font-bold text-sm text-foreground mb-0.5">
            {casino.casinoName}
          </h3>
          <p className="text-xs text-muted-foreground leading-tight">
            Antigüedad: {casino.antiguedad}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            RTP: <span className="text-foreground font-medium">{casino.rtp.toFixed(1)}%</span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Rango de precio
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-medium px-1.5 py-0.5',
              casino.precio === 'muy barato' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300' :
              casino.precio === 'barato' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300' :
              'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300'
            )}
          >
            {CASINO_PRECIO_VALUES[casino.precio].label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
