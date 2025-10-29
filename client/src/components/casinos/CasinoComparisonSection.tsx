"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Disclaimer } from '@/components/ui/disclaimer'
import { TopCasinoCard } from './TopCasinoCard'
import { DynamicCasinoTable } from './DynamicCasinoTable'
import { useCasinosData } from '@/lib/hooks/useCasinosData'
import { cn } from '@/lib/utils'
import { TrendingUp, Settings, Crown } from 'lucide-react'
import Link from 'next/link'

interface CasinoComparisonSectionProps {
  className?: string
  showAdminButton?: boolean
}

export function CasinoComparisonSection({ 
  className, 
  showAdminButton = false 
}: CasinoComparisonSectionProps) {
  const { topThree, casinos, isLoading, error, refreshData } = useCasinosData()

  if (error) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <p className="text-destructive text-sm">
              Error al cargar datos de comparación: {error}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshData}
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Top 3 skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-32 w-full rounded-lg" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            Comparación de Casinos
          </h2>
          <p className="text-sm text-muted-foreground">
            Análisis competitivo de las principales plataformas
          </p>
        </div>
        
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Top 3 Casinos */}
          {topThree.length > 0 && (
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-lg">Top 3 Casinos</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Recomendados
                  </Badge>
                </div>
                <CardDescription>
                  Las mejores opciones basadas en potencial y rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topThree.map((casino) => (
                    <TopCasinoCard 
                      key={casino.id} 
                      casino={casino}
                      className="h-full"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Table */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Análisis Comparativo
                  </CardTitle>
                  <CardDescription>
                    Comparación detallada de características y métricas
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {casinos.filter(c => !topThree.some(t => t.id === c.id)).length} casinos
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DynamicCasinoTable
                casinos={casinos}
                className="px-6 pb-6"
              />
            </CardContent>
          </Card>

          {/* Stats Summary */}

        </>
      )}
    </div>
  )
}