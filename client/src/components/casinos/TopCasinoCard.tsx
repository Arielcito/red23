"use client"

import { TopCasino } from '@/lib/types/casino'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TopCasinoCardProps {
  casino: TopCasino
  className?: string
}

export function TopCasinoCard({ casino, className }: TopCasinoCardProps) {
  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800'
      case 'yellow': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800'
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800'
    }
  }

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
        'absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 bg-gradient-to-br',
        positionStyles.gradient
      )}>
        #{casino.position}
      </div>

      <CardHeader className="pb-3">
        <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={casino.imageUrl}
            alt={casino.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              if (!target.src.includes('placeholder-casino.svg')) {
                target.src = '/placeholder-casino.svg'
              } else {
                // If placeholder also fails, show a simple background
                target.style.display = 'none'
              }
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">
            {casino.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {casino.plataforma}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Potencial:
          </span>
          <Badge 
            variant="outline"
            className={cn(
              'text-xs font-medium',
              getBadgeColor(casino.potencial.color)
            )}
          >
            {casino.potencial.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}