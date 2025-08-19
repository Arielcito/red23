"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  MessageCircle,
  Images,
  Upload,
  Smartphone,
  HelpCircle,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/lib/hooks/useSidebar"
import { useScheduledImages } from "@/lib/hooks/useScheduledImages"
import { cn } from "@/lib/utils"

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
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar()
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
    {
      title: "WhatsApp",
      href: "/whatsapp-setup",
      icon: Smartphone,
      badge: upcomingCount > 0 ? upcomingCount : undefined,
      description: "Configurar WhatsApp"
    },
    {
      title: "Ayuda",
      href: "/help",
      icon: HelpCircle,
      description: "Guías y soporte"
    },
    {
      title: "Configuración",
      href: "/settings",
      icon: Settings,
      description: "Ajustes"
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col",
          // Desktop states
          "lg:relative lg:z-auto",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile states
          isMobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Red23" className="h-8 w-8" />
              <span className="font-bold text-lg text-gray-900 dark:text-white">Red23</span>
            </div>
          )}
          
          {isCollapsed && (
            <div className="mx-auto">
              <img src="/logo.png" alt="Red23" className="h-8 w-8" />
            </div>
          )}

          {/* Toggle buttons */}
          <div className="flex items-center space-x-1">
            {/* Desktop collapse toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className="hidden lg:flex h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobile}
              className="lg:hidden h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative group",
                  active
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", active && "text-primary-600 dark:text-primary-400")} />
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                    {item.title}
                    {item.badge && (
                      <span className="ml-2 bg-gray-700 px-2 py-0.5 rounded text-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Red23 v1.0</p>
              <p>Marketing para casinos</p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden h-8 w-8 p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
}