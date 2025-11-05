"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PlayCircle,
  Clock,
  Users,
  Star,
  BookOpen,
  Heart,
  Share2,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  studentsCount: number
  rating: number
  reviewsCount: number
  thumbnail: string
  category: string
  level: "Principiante" | "Intermedio" | "Avanzado"
  price?: number
  originalPrice?: number
  isFree: boolean
  isPopular?: boolean
  isNew?: boolean
  progress?: number
  lessons: number
}

interface CourseCardProps {
  course: Course
  className?: string
}

export function CourseCard({ course, className }: CourseCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const levelColors = {
    Principiante: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300",
    Intermedio: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
    Avanzado: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300"
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200 overflow-hidden", className)}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary-400" />
            </div>
          )}
        </div>
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.isNew && (
            <Badge className="bg-primary dark:bg-primary text-primary-foreground text-xs">
              Nuevo
            </Badge>
          )}
          {course.isPopular && (
            <Badge className="bg-orange-500 dark:bg-orange-600 text-white text-xs">
              🔥 Popular
            </Badge>
          )}
          {course.isFree && (
            <Badge className="bg-green-500 dark:bg-green-600 text-white text-xs">
              Gratis
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-card/90 hover:bg-card dark:bg-card/80 dark:hover:bg-card"
            onClick={(e) => {
              e.preventDefault()
              setIsFavorited(!isFavorited)
            }}
          >
            <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-card/90 hover:bg-card dark:bg-card/80 dark:hover:bg-card"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Button
            size="lg"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 text-primary-600 dark:text-primary-400 hover:bg-card"
          >
            <PlayCircle className="h-6 w-6 mr-2" />
            Ver Curso
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={levelColors[course.level]}>
            {course.level}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 mr-1 fill-current text-yellow-400 dark:text-yellow-500" />
            <span className="font-medium">{course.rating}</span>
            <span className="ml-1">({course.reviewsCount})</span>
          </div>
        </div>

        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {course.title}
        </CardTitle>
        
        <CardDescription className="text-sm line-clamp-2 mt-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress Bar (if course is started) */}
        {course.progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium text-card-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {/* Course Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{course.lessons} lecciones</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.studentsCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Instructor */}
        <p className="text-sm text-muted-foreground mb-4">
          Por <span className="font-medium text-card-foreground">{course.instructor}</span>
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {course.isFree ? (
              <span className="text-lg font-bold text-green-600 dark:text-green-400">Gratis</span>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  ${course.price}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${course.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          <Link href={`/tutorials/${course.id}`}>
            <Button 
              size="sm" 
              className={cn(
                "group/btn",
                course.progress !== undefined ? "bg-secondary dark:bg-secondary hover:bg-secondary/90" : ""
              )}
            >
              {course.progress !== undefined ? "Continuar" : "Comenzar"}
              <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}