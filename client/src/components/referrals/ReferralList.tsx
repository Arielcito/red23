"use client"

import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Clock, CheckCircle, XCircle, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ReferralListProps } from '@/lib/types/referrals'

export function ReferralList({
  referrals,
  isLoading = false,
  className
}: ReferralListProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Mis Referencias</CardTitle>
          <CardDescription>Lista de usuarios que has referido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Completado',
          variant: 'default' as const,
          color: 'text-green-600'
        }
      case 'pending':
        return {
          icon: Clock,
          label: 'Pendiente',
          variant: 'secondary' as const,
          color: 'text-yellow-600'
        }
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'Cancelado',
          variant: 'destructive' as const,
          color: 'text-red-600'
        }
      default:
        return {
          icon: Clock,
          label: 'Desconocido',
          variant: 'outline' as const,
          color: 'text-gray-600'
        }
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Mis Referencias</CardTitle>
        <CardDescription>
          Lista de usuarios que has referido ({referrals.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {referrals.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No tienes referencias aún
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparte tu código de referido para empezar a ganar recompensas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => {
              const statusInfo = getStatusInfo(referral.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <div 
                  key={referral.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        Usuario #{referral.referredUserId.slice(-6)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(referral.createdAt), {
                          addSuffix: true,
                          locale: es
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}