"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@clerk/nextjs"
import { ShieldCheck, Bell, UserCircle2 } from "lucide-react"

const highlights = [
  {
    title: "Datos personales",
    description: "Actualiza tu nombre, foto y correo asociado a tu cuenta.",
    icon: UserCircle2,
    color: "bg-primary-100 text-primary-600",
  },
  {
    title: "Seguridad",
    description: "Gestiona contraseñas, sesiones activas y métodos de autenticación.",
    icon: ShieldCheck,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Notificaciones",
    description: "Elige cómo recibir alertas sobre novedades y recompensas.",
    icon: Bell,
    color: "bg-amber-100 text-amber-600",
  },
]

export default function ProfilePage() {
  return (
    <AppLayout
      title="Configuración de perfil"
      subtitle="Gestiona los datos de tu cuenta y preferencias de seguridad"
    >
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">Tu cuenta en Red23</CardTitle>
            <CardDescription>
              Utilizamos Clerk para asegurar tus datos. Desde aquí puedes mantener tu información al día y proteger tu acceso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highlights.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <UserProfile
          path="/profile"
          routing="path"
          appearance={{
            elements: {
              rootBox: "w-full px-0 shadow-none border border-border/80 rounded-xl",
              card: "w-full shadow-none",
              headerTitle: "text-lg font-semibold text-gray-900 dark:text-white",
              headerSubtitle: "text-sm text-muted-foreground",
              menuButton: "rounded-lg",
              menuItem: "rounded-lg",
              navbar: "border-b border-border/70",
              pageScrollBox: "p-6",
              formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-white",
            },
            variables: {
              fontFamily: "var(--font-sans)",
              colorPrimary: "#7C3AED",
              borderRadius: "12px",
            },
          }}
        />
      </div>
    </AppLayout>
  )
}
