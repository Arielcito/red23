import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Clock, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CasinoWithFields } from "@/lib/supabase/types"

interface CasinosSectionProps {
  casinos: CasinoWithFields[]
}

export function CasinosSection({ casinos }: CasinosSectionProps) {
  if (!casinos || casinos.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Comparación de Casinos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compara las características de nuestros casinos recomendados
            </p>
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay casinos adicionales disponibles</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Mostrar solo los primeros 10 casinos
  const displayCasinos = casinos.slice(0, 10)

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Casino</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Potencial</TableHead>
                    <TableHead>Similar a</TableHead>
                    {/* Dynamic custom fields headers */}
                    {displayCasinos[0]?.customFields?.slice(0, 2).map((field) => (
                      <TableHead key={field.fieldId}>{field.fieldName}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayCasinos.map((casino, index) => (
                    <TableRow key={casino.id} className="hover:bg-muted/50">
                      {/* Casino Name with Logo */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded bg-muted flex items-center justify-center">
                            {casino.logo ? (
                              <img
                                src={casino.logo}
                                alt={casino.name}
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
                              casino.logo && "hidden"
                            )}>
                              {casino.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">{casino.name}</div>
                            <div className="text-xs text-muted-foreground">#{index + 1}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Platform */}
                      <TableCell>{casino.plataforma}</TableCell>

                      {/* Implementation Time */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{casino.tiempo}</span>
                        </div>
                      </TableCell>

                      {/* Potential */}
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs font-medium",
                            casino.potencial.color === 'green' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300' :
                            casino.potencial.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300'
                          )}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          {casino.potencial.label}
                        </Badge>
                      </TableCell>

                      {/* Similar */}
                      <TableCell className="text-sm text-muted-foreground">
                        {casino.similar || '-'}
                      </TableCell>

                      {/* Custom Fields */}
                      {casino.customFields?.slice(0, 2).map((field) => (
                        <TableCell key={field.fieldId} className="text-sm">
                          {typeof field.value === 'object' && field.value && 'label' in field.value
                            ? (
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  field.value.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                                  field.value.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  field.value.color === 'red' ? 'bg-red-100 text-red-800 border-red-200' :
                                  ''
                                )}
                              >
                                {field.value.label}
                              </Badge>
                            )
                            : String(field.value)
                          }
                        </TableCell>
                      ))}

                      {/* Fill empty custom field columns if casino has fewer fields */}
                      {casino.customFields && casino.customFields.length < 2 && 
                        displayCasinos[0]?.customFields?.slice(casino.customFields.length, 2).map((_, i) => (
                          <TableCell key={`empty-${i}`}>-</TableCell>
                        ))
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Show count info */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Mostrando {displayCasinos.length} de {casinos.length} casinos disponibles
        </div>
      </div>
    </section>
  )
}