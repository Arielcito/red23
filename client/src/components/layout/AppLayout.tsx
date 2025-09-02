"use client"

import { Sidebar } from "./Sidebar"
import { NavigationHeader } from "@/components/auth/NavigationHeader"
import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

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
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="w-full overflow-x-hidden md:m-0 md:rounded-none md:shadow-none">
        {!hideHeader && (
          <NavigationHeader
            title={title}
            subtitle={subtitle}
            showBackButton={showBackButton}
            backHref={backHref}
            showLogo={false}
            badge={badge}
          />
        )}
        <main className={cn("flex flex-col flex-1 min-w-0 min-h-0 w-full overflow-x-hidden", className)}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
