"use client"

import type { CasinoWithFields } from '@/lib/supabase/types'
import { CASINO_PRECIO_VALUES } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface DynamicCasinoTableProps {
  casinos: CasinoWithFields[]
  className?: string
}

export function DynamicCasinoTable({ casinos, className }: DynamicCasinoTableProps) {
  const getBadgeColor = (precio: 'medio' | 'barato' | 'muy barato') => {
    switch (precio) {
      case 'muy barato':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800'
      case 'barato': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800'
      case 'medio':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800'
    }
  }

  // Filtrar solo casinos que no son top 3 para la tabla
  const tableCasinos = casinos.filter(casino => 
    casino.position === null || casino.position === undefined || casino.position > 3
  )

  return (
    <div className={cn('w-full overflow-auto', className)}>
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="font-semibold text-foreground">
              Casino
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Antigüedad
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Precio
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              RTP
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Plat. Similar
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableCasinos.map((casino) => (
            <TableRow 
              key={casino.id}
              className="border-border hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {casino.logo && (
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img
                        src={casino.logo}
                        alt={casino.casinoName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-foreground">
                      {casino.casinoName}
                    </div>
                    {casino.position && (
                      <div className="text-xs text-muted-foreground">
                        Posición #{casino.position}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {casino.antiguedad}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={cn(
                    'text-xs font-medium',
                    getBadgeColor(casino.precio)
                  )}
                >
                  {CASINO_PRECIO_VALUES[casino.precio].label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {casino.rtp}%
                  </span>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, casino.rtp))}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-foreground max-w-xs">
                <div className="truncate" title={casino.platSimilar || undefined}>
                  {casino.platSimilar || '-'}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {tableCasinos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No hay casinos para mostrar en la tabla</p>
          <p className="text-xs mt-1">Los casinos del top 3 se muestran arriba</p>
        </div>
      )}
    </div>
  )
}