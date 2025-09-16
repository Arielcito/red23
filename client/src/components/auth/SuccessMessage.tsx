"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, MessageCircle, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"

export function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">¡Solicitud Enviada!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Gracias por tu interés. Nuestro equipo revisará tu solicitud y te contactará en las próximas 24 horas
              para programar una demo personalizada.
            </p>
            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Te contactaremos por email y Telegram</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Demo personalizada en 24-48 horas</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Propuesta comercial adaptada a tu negocio</span>
              </div>
            </div>
            <Link href="/">
              <Button className="mt-6 bg-primary-600 hover:bg-primary-700">Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
