"use client"

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AuthHeader() {
  return (
    <CardHeader className="text-center">
      <div className="flex items-center justify-center mb-4">
        <img src="/logo.png" alt="Logo" className="h-12 w-12" />
      </div>
      <CardTitle className="text-2xl md:text-3xl">Accede a Red23</CardTitle>
      <CardDescription className="text-lg">
        Inicia sesión en tu cuenta o solicita una demo personalizada
      </CardDescription>
    </CardHeader>
  )
}