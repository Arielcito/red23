"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LearningPathBreadcrumbProps {
  pathTitle?: string
  showBackButton?: boolean
}

export function LearningPathBreadcrumb({ 
  pathTitle, 
  showBackButton = true 
}: LearningPathBreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {showBackButton && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="p-2 h-auto"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Link 
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-3 w-3" />
        Inicio
      </Link>
      
      <span className="text-muted-foreground">/</span>
      
      <Link 
        href="/tutorials"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Tutoriales
      </Link>
      
      {pathTitle && (
        <>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground truncate max-w-xs">
            {pathTitle}
          </span>
        </>
      )}
    </nav>
  )
}