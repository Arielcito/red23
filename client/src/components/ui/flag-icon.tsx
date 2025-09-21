"use client"

import { cn } from "@/lib/utils"

const countryFlags: Record<string, string> = {
  "Argentina": "🇦🇷",
  "Brasil": "🇧🇷", 
  "Paraguay": "🇵🇾",
  "Uruguay": "🇺🇾",
  "México": "🇲🇽",
  "Colombia": "🇨🇴",
  "Chile": "🇨🇱",
  "Perú": "🇵🇪",
  "Ecuador": "🇪🇨",
  "Venezuela": "🇻🇪",
  "Bolivia": "🇧🇴"
}

interface FlagIconProps {
  country: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function FlagIcon({ country, className, size = "md" }: FlagIconProps) {
  const flag = countryFlags[country]
  
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg"
  }

  if (!flag) {
    return null
  }

  return (
    <span 
      className={cn(
        "inline-block",
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={`Bandera de ${country}`}
    >
      {flag}
    </span>
  )
}