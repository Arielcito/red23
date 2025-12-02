import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { TopCasino } from "@/lib/supabase/types"
import { CASINO_PRECIO_VALUES } from "@/lib/supabase/types"

interface TopThreeSectionProps {
  topThree: TopCasino[]
}

export function TopThreeSection({ topThree }: TopThreeSectionProps) {
  if (!topThree || topThree.length === 0) {
    return (
      <section className="py-12 border-x border-border">
        <div className="container mx-auto">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              <h2 className="text-3xl font-bold">MEJORES 3 PLATAFORMAS</h2>
            </div>
            <p className="text-muted-foreground">
              Estas son las mejores 3 plataformas de casino online seleccionadas por nuestro equipo de expertos, basados en volumen, seguridad y experiencia de usuario
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
    <section className="py-6 md:py-12 px-4 md:px-6 border-x border-border">
      <div className="container mx-auto">
        <div className="text-center space-y-4 pb-6 md:pb-12">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h2 className="text-2xl font-bold">MEJORES 3 PLATAFORMAS</h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Estas son las mejores 3 plataformas de casino online seleccionadas por nuestro equipo de expertos, basados en volumen, seguridad y experiencia de usuario
          </p>
        </div>

        <div className={cn(
          "gap-3 md:gap-4 max-w-4xl mx-auto",
          topThree.length === 1 && "grid grid-cols-1",
          topThree.length === 2 && "grid grid-cols-2",
          topThree.length === 3 && "grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {topThree.map((casino, index) => (
            <div key={casino.id} className="relative">
              {/* Position Badge - Outside Card */}
              <div className={cn(
                "absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-20 shadow-lg",
                index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                "bg-gradient-to-br from-orange-400 to-orange-600"
              )}>
                #{casino.position}
              </div>

              <Card
                className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <CardContent className="p-0">
                {/* Casino Logo */}
                <div className="relative aspect-[3/2] w-full bg-gray-800 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 flex items-center justify-center border border-gray-700 dark:border-gray-800">
                  {casino.logo ? (
                    <div className="relative w-full h-full p-4">
                      <Image
                        src={casino.logo}
                        alt={casino.casinoName}
                        fill
                        className="object-contain transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement?.parentElement
                          if (parent) {
                            parent.innerHTML = `<span class="text-4xl font-bold text-white">${casino.casinoName.charAt(0)}</span>`
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {casino.casinoName.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Casino Name */}
                <div className="p-2 text-center">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{casino.casinoName}</h3>
                </div>

                {/* Casino Info - Hidden on Mobile */}
                <div className="hidden md:block p-3 space-y-2">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Antigüedad: {casino.antiguedad}</p>
                    <p>RTP: <span className="font-medium text-foreground">{casino.rtp.toFixed(1)}%</span></p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        casino.precio === 'muy barato' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300' :
                        casino.precio === 'barato' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300'
                      )}
                    >
                      {CASINO_PRECIO_VALUES[casino.precio].label}
                    </Badge>

                    {index === 0 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Crown className="h-4 w-4" />
                        <span className="text-sm font-medium">Mejor opción</span>
                      </div>
                    )}
                  </div>

                </div>
              </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
