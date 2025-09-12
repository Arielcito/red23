"use client"

import { Badge } from "@/components/ui/badge"
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
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { scheduledImages } = useScheduledImages()

  const upcomingCount = scheduledImages.filter(img =>
    img.status === "pending" && new Date(`${img.date}T${img.time}`) > new Date()
  ).length

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
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
    {
      title: "Subir",
      href: "/upload",
      icon: Upload,
      description: "Subir imágenes"
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
      title: "Premios",
      href: "/rewards",
      icon: Gift,
      description: "Sorteos y premios"
    },
    {
      title: "Tutoriales",
      href: "/tutorials",
      icon: GraduationCap,
      badge: "Nuevo",
      description: "Cursos de marketing"
    },
    {
      title: "Ayuda",
      href: "/help",
      icon: HelpCircle,
      description: "Guías y soporte"
    },
    {
      title: "Admin Casinos",
      href: "/admin/casinos",
      icon: Settings,
      badge: "Admin",
      description: "Gestión de casinos"
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <SidebarComponent variant="inset" {...{ className }}>
      <SidebarHeader>
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
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
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