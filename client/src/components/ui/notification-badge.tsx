"use client"

import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  count: number
  className?: string
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count === 0) return null

  return (
    <Badge
      variant="destructive"
      className={cn(
        "absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-medium",
        "animate-pulse",
        "min-w-[20px]",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  )
}