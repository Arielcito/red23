"use client"

import { Winner } from "@/lib/hooks/useRewardsData"
import { Trophy, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatRelativeDate } from "@/lib/utils"

interface RecentWinnersProps {
  winners: Winner[]
  isLoading?: boolean
  className?: string
}

export function RecentWinners({ winners, isLoading, className }: RecentWinnersProps) {
  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Ganadores recientes</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <div className="h-6 w-6 bg-muted rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted rounded w-20" />
                <div className="h-2 bg-muted rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (winners.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No hay ganadores recientes</p>
      </div>
    )
  }


  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Últimos ganadores</span>
      </div>
      
      <div className="space-y-2">
        {winners.slice(0, 3).map((winner) => (
          <div key={winner.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
            <div className="flex-shrink-0">
              {winner.avatar ? (
                <img
                  src={winner.avatar}
                  alt={winner.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {getInitials(winner.name)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{winner.name}</p>
                {winner.type === 'monthly' && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    Mensual
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{formatRelativeDate(winner.date)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs font-medium text-primary">{winner.prize}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}