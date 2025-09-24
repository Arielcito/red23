"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@clerk/nextjs"
import { Settings, Shield, Bell, Palette } from "lucide-react"

const settingsFeatures = [
  {
    title: "Configuración de cuenta",
    description: "Gestiona tu información personal, email y datos básicos de tu perfil.",
    icon: Settings,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "Seguridad avanzada",
    description: "Configura autenticación de dos factores, revisa sesiones activas y gestiona la seguridad.",
    icon: Shield,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    title: "Preferencias",
    description: "Personaliza notificaciones, tema y configuraciones de la aplicación.",
    icon: Bell,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
]

export default function SettingsPage() {
  return (
    <AppLayout
      title="Configuración"
      subtitle="Gestiona tu cuenta, seguridad y preferencias de la aplicación"
    >
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <UserProfile
          path="/settings"
          routing="path"
          appearance={{
            elements: {
              rootBox: "w-full px-0 shadow-none border border-border/80 rounded-xl bg-card",
              card: "w-full shadow-none bg-transparent",
              headerTitle: "text-lg font-semibold text-foreground",
              headerSubtitle: "text-sm text-muted-foreground",
              menuButton: "rounded-lg hover:bg-muted/50 transition-colors",
              menuItem: "rounded-lg hover:bg-muted/50 transition-colors",
              navbar: "border-b border-border/70 bg-muted/10",
              pageScrollBox: "p-6",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors",
              formButtonSecondary: "border-border hover:bg-muted/50 transition-colors",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80",
              formFieldLabel: "text-foreground",
              formFieldInput: "border-border bg-background text-foreground focus:ring-primary",
              alertText: "text-foreground",
              badge: "bg-primary/10 text-primary border-primary/20",
            },
            variables: {
              fontFamily: "var(--font-sans)",
              colorPrimary: "hsl(var(--primary))",
              colorBackground: "hsl(var(--background))",
              colorInputBackground: "hsl(var(--background))",
              colorInputText: "hsl(var(--foreground))",
              colorText: "hsl(var(--foreground))",
              colorTextSecondary: "hsl(var(--muted-foreground))",
              colorNeutral: "hsl(var(--muted))",
              borderRadius: "12px",
            },
          }}
        />
      </div>
    </AppLayout>
  )
}