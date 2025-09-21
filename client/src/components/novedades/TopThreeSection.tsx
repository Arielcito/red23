import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { TopCasino } from "@/lib/supabase/types"

interface TopThreeSectionProps {
  topThree: TopCasino[]
}

export function TopThreeSection({ topThree }: TopThreeSectionProps) {
  if (!topThree || topThree.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              <h2 className="text-3xl font-bold">Top 3 Casinos</h2>
            </div>
            <p className="text-muted-foreground">
              Los mejores casinos seleccionados por nuestro equipo
            </p>
            <div className="text-center py-8 text-muted-foreground">
              <Crown className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay casinos top 3 configurados</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Top 3 Casinos</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Los mejores casinos seleccionados por nuestro equipo de expertos, 
            evaluados por su calidad, seguridad y experiencia de usuario
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {topThree.map((casino, index) => (
            <Card 
              key={casino.id} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
                index === 0 && "ring-2 ring-yellow-400 shadow-lg"
              )}
            >
              {/* Position Badge */}
              <div className={cn(
                "absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 shadow-lg",
                index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                "bg-gradient-to-br from-orange-400 to-orange-600"
              )}>
                #{casino.position}
              </div>

              {/* Winner Badge for First Place */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Ganador
                  </Badge>
                </div>
              )}

              <CardContent className="p-0">
                {/* Casino Image */}
                <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <Image
                    src={casino.imageUrl || '/placeholder-casino.svg'}
                    alt={casino.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-casino.svg'
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Casino Info */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{casino.name}</h3>
                    <p className="text-muted-foreground">{casino.plataforma}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline"
                      className={cn(
                        "font-medium",
                        casino.potencial.color === 'green' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300' :
                        casino.potencial.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300'
                      )}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {casino.potencial.label}
                    </Badge>

                    {index === 0 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Crown className="h-4 w-4" />
                        <span className="text-sm font-medium">Mejor Opción</span>
                      </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}