"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Category {
  id: string
  name: string
  count: number
  icon?: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className 
}: CategoryFilterProps) {
  const allCategory: Category = { id: "all", name: "Todas las categorías", count: categories.reduce((sum, cat) => sum + cat.count, 0) }
  const allCategories = [allCategory, ...categories]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop Filter - Horizontal Buttons */}
      <div className="hidden md:flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center space-x-2 transition-all",
              selectedCategory === category.id 
                ? "bg-primary-500 text-white hover:bg-primary-600" 
                : "hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300"
            )}
          >
            {category.icon && <span className="text-sm">{category.icon}</span>}
            <span>{category.name}</span>
            <Badge 
              variant="secondary" 
              className={cn(
                "ml-1 text-xs",
                selectedCategory === category.id 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Mobile Filter - Dropdown */}
      <div className="md:hidden">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Seleccionar categoría" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {allCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    {category.icon && <span className="text-sm">{category.icon}</span>}
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}