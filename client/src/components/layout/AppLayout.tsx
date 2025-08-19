"use client"

import { Sidebar } from "./Sidebar"
import { NavigationHeader } from "@/components/auth/NavigationHeader"
import { useSidebar } from "@/lib/hooks/useSidebar"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  badge?: {
    text: string
    variant?: "default" | "secondary" | "outline"
    className?: string
  }
  hideHeader?: boolean
  className?: string
}

export function AppLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  backHref = "/dashboard",
  badge,
  hideHeader = false,
  className
}: AppLayoutProps) {
  const { isCollapsed, isMobileOpen } = useSidebar()

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <Sidebar />
      
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          // Adjust for sidebar width
          "lg:ml-0", // Sidebar is relative, no margin needed
          // Mobile padding for menu button
          "pl-12 lg:pl-0"
        )}
      >
        {!hideHeader && (
          <NavigationHeader
            title={title}
            subtitle={subtitle}
            showBackButton={showBackButton}
            backHref={backHref}
            showLogo={false} // Logo is in sidebar
            badge={badge}
          />
        )}
        
        <main className={cn("flex-1 min-w-0 overflow-hidden", className)}>
          {children}
        </main>
      </div>

      {/* Mobile sidebar backdrop - handled in Sidebar component */}
    </div>
  )
}