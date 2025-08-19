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
import { Settings, LogOut, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/hooks/useAuth"

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

  const handleLogout = () => {
    logout()
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {showBackButton && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Volver</span>
                <span className="sm:hidden">←</span>
              </Button>
            </Link>
          )}
          
          {showLogo && (
            <img src="/logo.png" alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
          )}
          
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
          {badge && (
            <Badge
              variant={badge.variant || "outline"}
              className={badge.className || "text-xs sm:text-sm"}
            >
              {badge.text}
            </Badge>
          )}
          
          <ThemeToggle />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "Usuario"} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {getUserInitials(user?.fullName || user?.firstName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || user?.firstName || "Usuario"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || "usuario@ejemplo.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}