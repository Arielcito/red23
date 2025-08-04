"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

interface LoginFormProps {
  onSwitchToDemo: () => void
}

export function LoginForm({ onSwitchToDemo }: LoginFormProps) {
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = "/dashboard"
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">¿Ya tienes una cuenta?</h3>
        <p className="text-gray-600 dark:text-gray-300">Accede a tu plataforma de marketing</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700">
          <LogIn className="mr-2 h-4 w-4" />
          Iniciar Sesión
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Olvidaste tu contraseña?{" "}
          <Link href="#" className="text-primary-600 hover:text-primary-700">
            Recupérala aquí
          </Link>
        </p>
      </div>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">¿No tienes cuenta aún?</p>
        <Button
          variant="outline"
          onClick={onSwitchToDemo}
          className="bg-transparent border-secondary-300 text-secondary-600 hover:bg-secondary-50"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Solicitar Acceso
        </Button>
      </div>
    </div>
  )
}