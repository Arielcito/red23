"use client"

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function AuthHeader() {
  return (
    <CardHeader className="text-center relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-center mb-4">
        <Link href="/gallery" className="cursor-pointer hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
        </Link>
      </div>
      <CardTitle className="text-2xl md:text-3xl">Accede a Red23</CardTitle>
      <CardDescription className="text-lg">
        Inicia sesión en tu cuenta o solicita una demo personalizada
      </CardDescription>
    </CardHeader>
  )
}