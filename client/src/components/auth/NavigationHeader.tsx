"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut, User, ArrowLeft, Moon, Sun } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/hooks/useAuth"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "@/components/layout/Sidebar"

interface NavigationHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  showLogo?: boolean
  badge?: {
    text: string
    variant?: "default" | "secondary" | "outline"
    className?: string
  }
}

export function NavigationHeader({
  title,
  subtitle,
  showBackButton = false,
  backHref = "/dashboard",
  showLogo = true,
  badge
}: NavigationHeaderProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    logout()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 md:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
          <SidebarTrigger className="h-9 w-9 sm:h-10 sm:w-10" />

          {showBackButton && (
            <Link href={backHref}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm h-9 w-9 sm:h-10 sm:w-auto px-2 sm:px-3 touch-manipulation flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1 sm:ml-2">Volver</span>
              </Button>
            </Link>
          )}

          {showLogo && (
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-7 w-7 sm:h-8 sm:w-8 md:h-8 md:w-8 flex-shrink-0"
            />
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 truncate sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 flex-shrink-0">
          {badge && (
            <Badge
              variant={badge.variant || "outline"}
              className={badge.className || "text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"}
            >
              {badge.text}
            </Badge>
          )}

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full touch-manipulation p-0"
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "Usuario"} />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xs sm:text-sm">
                    {getUserInitials(user?.fullName || user?.firstName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 sm:w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {user?.fullName || user?.firstName || "Usuario"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.primaryEmailAddress?.emailAddress || "usuario@ejemplo.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="cursor-pointer h-10 sm:h-11 px-3 sm:px-4 touch-manipulation flex items-center"
                >
                  <User className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer h-10 sm:h-11 px-3 sm:px-4 touch-manipulation flex items-center"
                >
                  <Settings className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Configuración</span>
                </Link>
              </DropdownMenuItem>

              {/* Theme Toggle for Mobile */}
              <div className="sm:hidden">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={toggleTheme}
                  className="cursor-pointer h-10 px-3 touch-manipulation flex items-center"
                >
                  {theme === "dark" ? (
                    <Sun className="mr-3 h-4 w-4 flex-shrink-0" />
                  ) : (
                    <Moon className="mr-3 h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">
                    {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
                  </span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 h-10 sm:h-11 px-3 sm:px-4 touch-manipulation flex items-center"
              >
                <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}