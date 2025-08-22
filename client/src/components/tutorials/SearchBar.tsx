"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Buscar...",
  className 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange("")
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        isFocused && "ring-2 ring-primary-500 ring-offset-2 rounded-md"
      )}>
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            "focus:border-primary-500 focus:ring-0",
            "placeholder:text-gray-400"
          )}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search suggestions could be added here */}
      {isFocused && value && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {/* This could show search suggestions, recent searches, or popular courses */}
          <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
            Buscar "{value}" en todos los cursos...
          </div>
        </div>
      )}
    </div>
  )
}