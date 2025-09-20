"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { ReferralDashboard } from '@/components/referrals/ReferralDashboard'
import { useAuth } from '@/lib/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LogIn, Users } from 'lucide-react'
import Link from 'next/link'

export default function ReferralsPage() {
  const { isAuthenticated, isLoading } = useAuth()

  console.log('🎯 Referrals page loaded:', { isAuthenticated, isLoading })

  if (isLoading) {
    return (
      <AppLayout
        title="Sistema de Referidos"
        subtitle="Cargando tu información de referidos..."
        badge={{
          text: "Cargando",
          variant: "outline",
          className: "text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
        }}
      >
        <div className="p-6 space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!isAuthenticated) {
    return (
      <AppLayout
        title="Sistema de Referidos"
        subtitle="Comparte Red23 y gana recompensas"
        badge={{
          text: "Acceso Requerido",
          variant: "outline",
          className: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800"
        }}
        showBackButton={true}
        backHref="/dashboard"
      >
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl">¡Únete al Sistema de Referidos!</CardTitle>
                <CardDescription>
                  Gana recompensas compartiendo Red23 con tus amigos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Necesitas iniciar sesión para acceder a tu código de referido único 
                    y comenzar a ganar recompensas.
                  </p>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <span className="text-sm">Obtén tu código único</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <span className="text-sm">Comparte con amigos</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <span className="text-sm">Gana recompensas</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button asChild className="flex-1">
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Sistema de Referidos"
      subtitle="Refiere amigos y gana recompensas especiales"
      badge={{
        text: "Activo",
        variant: "secondary",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      }}
      showBackButton={true}
      backHref="/dashboard"
    >
      <div className="p-6">
        <ReferralDashboard />
      </div>
    </AppLayout>
  )
}