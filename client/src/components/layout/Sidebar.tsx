"use client"

import { Badge } from "@/components/ui/badge"
// Algunos imports se usan en elementos temporalmente comentados (ej: Smartphone para WhatsApp)
import {
  Home,
  MessageCircle,
  Images,
  Upload,
  Smartphone,
  HelpCircle,
  GraduationCap,
  Gift,
  Settings,
  Megaphone,
  Users,
  Newspaper,
  UserCog,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useScheduledImages } from "@/lib/hooks/useScheduledImages"
import { RewardsMenuItem } from "@/components/rewards/RewardsMenuItem"
import { useUser } from "@/lib/hooks/useUser"
import Image from "next/image"

interface SidebarProps {
  className?: string
}

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  description?: string
  isAdmin?: boolean
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { scheduledImages } = useScheduledImages()
  const { user } = useUser()

  // upcomingCount se usa en el elemento de WhatsApp (temporalmente comentado)
  const upcomingCount = scheduledImages.filter(img =>
    img.status === "pending" && new Date(`${img.date}T${img.time}`) > new Date()
  ).length

  // IDs de usuarios admin autorizados
  const adminUserIds = [
    'user_31DCO0Te7aX1F7a8KOO7CZwNbTA',
    'user_32TNG7qogCbcPn03Ad1BS95i3Pf',
    'user_32zPCd7JmFUeJvJPAB0ksLcbD4k',
    'user_32zZf6gn0Y24LMMl8qM81hjojMk'

  ]

  const isAdminUser = user && adminUserIds.includes(user.id)

  const menuItems: MenuItem[] = [
    {
      title: "INICIO",
      href: "/dashboard",
      icon: Home,
      description: "Panel principal"
    },
    {
      title: "Chat IA",
      href: "/chat",
      icon: MessageCircle,
      description: "Generar imágenes"
    },
    {
      title: "Galería",
      href: "/gallery",
      icon: Images,
      description: "Ver imágenes"
    },
    /* Temporalmente oculto
    {
      title: "WhatsApp",
      href: "/whatsapp-setup",
      icon: Smartphone,
      badge: upcomingCount > 0 ? upcomingCount : undefined,
      description: "Configurar WhatsApp"
    },
    */
    {
      title: "Novedades",
      href: "/novedades",
      icon: Newspaper,
      description: "Últimas noticias y casinos"
    },
    {
      title: "Premios",
      href: "/rewards",
      icon: Gift,
      description: "Sorteos y premios"
    },
    {
      title: "Rutas de Aprendizaje",
      href: "/tutorials",
      icon: GraduationCap,
      description: "Cursos de marketing"
    },
    {
      title: "Referidos",
      href: "/referrals",
      icon: Users,
      description: "Sistema de referidos"
    },
    {
      title: "Ayuda",
      href: "/help",
      icon: HelpCircle,
      description: "Guías y soporte"
    },
    {
      title: "Admin Premios",
      href: "/admin/rewards",
      icon: Megaphone,
      badge: "Admin",
      description: "Configurar premios",
      isAdmin: true
    },
    {
      title: "Admin Casinos",
      href: "/admin/casinos",
      icon: Settings,
      badge: "Admin",
      description: "Gestión de casinos",
      isAdmin: true
    },
    {
      title: "Admin Prompts",
      href: "/admin/prompts",
      icon: MessageCircle,
      badge: "Admin",
      description: "Editar prompts automáticos",
      isAdmin: true
    },
    {
      title: "Admin Rutas de aprendizaje",
      href: "/admin/tutorials",
      icon: GraduationCap,
      badge: "Admin",
      description: "Gestión de rutas de aprendizaje",
      isAdmin: true
    },
  ]

  const isActive = (href: string) => pathname === href

  // Filtrar elementos del menú basándose en permisos de admin
  const filteredMenuItems = menuItems.filter(item => {
    // Si el elemento es de admin y el usuario no es admin, no mostrarlo
    if (item.isAdmin && !isAdminUser) {
      return false
    }
    return true
  })

  return (
    <SidebarComponent variant="inset" {...{ className }}>
      <SidebarHeader>
        <Link href="/dashboard" className="cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2 px-4 py-2">
            <Image
              src="/logo.png"
              alt="Red23"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-bold text-lg">Red23</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href}>
                        {item.href === "/rewards" ? (
                          <RewardsMenuItem />
                        ) : (
                          <>
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <p className="font-medium">Red23 v1.0</p>
          <p>Marketing para casinos</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  )
}

// Exportar SidebarTrigger para uso en el header
export { SidebarTrigger }
