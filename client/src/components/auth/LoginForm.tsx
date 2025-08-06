"use client"

import { SignIn } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

interface LoginFormProps {
  onSwitchToDemo: () => void
}

export function LoginForm({ onSwitchToDemo }: LoginFormProps) {
  console.log('[LoginForm] Renderizando componente de login con Clerk')

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">¿Ya tienes una cuenta?</h3>
        <p className="text-gray-600 dark:text-gray-300">Accede a tu plataforma de marketing</p>
      </div>

      <div className="flex justify-center">
        <SignIn 
          afterSignInUrl="/dashboard"
          signUpUrl="#"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0 bg-transparent",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "w-full",
              formButtonPrimary: "w-full bg-primary-600 hover:bg-primary-700",
              footerAction: "hidden"
            }
          }}
        />
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