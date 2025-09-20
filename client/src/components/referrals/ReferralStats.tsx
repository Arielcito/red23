"use client"

import { Users, Clock, CheckCircle, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ReferralStatsProps } from '@/lib/types/referrals'

export function ReferralStats({ 
  stats, 
  isLoading = false, 
  className 
}: ReferralStatsProps) {
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Estadísticas no disponibles</CardTitle>
          <CardDescription>
            No se pudieron cargar las estadísticas de referidos
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const statsData = [
    {
      title: "Total Referidos",
      value: stats.totalReferrals,
      description: "Usuarios que has referido",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pendientes",
      value: stats.pendingReferrals,
      description: "Esperando confirmación",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Completados",
      value: stats.completedReferrals,
      description: "Referencias exitosas",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Tasa de Éxito",
      value: stats.totalReferrals > 0 
        ? `${Math.round((stats.completedReferrals / stats.totalReferrals) * 100)}%`
        : "0%",
      description: "Referencias completadas",
      icon: Trophy,
      color: "text-purple-600"
    }
  ]

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {statsData.map((stat) => {
        const IconComponent = stat.icon
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <IconComponent className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}