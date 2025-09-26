import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Settings, ChevronRight, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { CASINO_PRECIO_VALUES } from "@/lib/supabase/types"
import { useCasinosData } from "@/lib/hooks/useCasinosData"
import { LoadingState } from "./LoadingState"
import { ErrorState } from "./ErrorState"
import Image from "next/image"

export function CasinosSection() {
  const { casinos, isLoading, error } = useCasinosData()

  if (error) {
    return <ErrorState error={error} />
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <section className="py-6 md:py-12">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-6 md:mb-12">
          <h2 className="text-3xl font-bold">Comparación de Casinos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compara las características de nuestros casinos recomendados
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tabla Comparativa de Casinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Mobile and Desktop Table View */}
              <div className="block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Casino</TableHead>
                    <TableHead>Antigüedad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>RTP</TableHead>
                    <TableHead>Similar a</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casinos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay casinos disponibles para mostrar
                      </TableCell>
                    </TableRow>
                  ) : (
                    casinos.map((casino, index) => (
                    <TableRow key={casino.id} className="hover:bg-muted/50">
                      {/* Casino Name with Logo */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded bg-muted flex items-center justify-center">
                            {casino.coverImageUrl || casino.imageUrl ? (
                              <Image
                                src={casino.coverImageUrl || casino.imageUrl || '/placeholder-casino.svg'}
                                alt={casino.casinoName}
                                width={24}
                                height={24}
                                className="max-w-6 max-h-6 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  target.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <span className={cn(
                              "text-xs font-bold text-primary",
                              (casino.coverImageUrl || casino.imageUrl) && "hidden"
                            )}>
                              {casino.casinoName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold flex items-center gap-1">
                              {casino.position && casino.position <= 3 && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                              <span>{casino.casinoName}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">#{index + 1}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Antigüedad */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{casino.antiguedad}</span>
                        </div>
                      </TableCell>

                      {/* Precio */}
                      <TableCell>
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
                      </TableCell>

                      {/* RTP */}
                      <TableCell>
                        <span className="text-sm font-medium">
                          {casino.rtp?.toFixed(1) ?? '0.0'}%
                        </span>
                      </TableCell>

                      {/* Similar */}
                      <TableCell className="text-sm text-muted-foreground">
                        {casino.platSimilar || '-'}
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>

              {/* Indicador de scroll horizontal */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-center opacity-75">
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                  <ChevronRight className="h-3 w-3 animate-pulse" />
                  <span className="text-[10px] font-medium whitespace-nowrap">Scroll</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  )
}
