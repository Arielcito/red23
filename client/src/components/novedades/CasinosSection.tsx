import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Clock, Settings, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CasinoWithFields } from "@/lib/supabase/types"

interface CasinosSectionProps {
  casinos: CasinoWithFields[]
}

// Datos de ejemplo para desarrollo
const sampleCasinos: CasinoWithFields[] = [
  {
    id: "1",
    name: "Bet365",
    logo: null,
    plataforma: "Evolution Gaming",
    tiempo: "2-3 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "William Hill",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "500", label: "Hasta $500", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "premium", label: "Premium", color: "green" } }
    ]
  },
  {
    id: "2",
    name: "888 Casino",
    logo: null,
    plataforma: "Playtech",
    tiempo: "1-2 días",
    potencial: { value: "very_high", label: "Muy Alto", color: "green" },
    similar: "Paddy Power",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "300", label: "Hasta $300", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "gold", label: "Gold", color: "yellow" } }
    ]
  },
  {
    id: "3",
    name: "LeoVegas",
    logo: null,
    plataforma: "NetEnt",
    tiempo: "3-5 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "Casumo",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "200", label: "Hasta $200", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "silver", label: "Silver", color: "yellow" } }
    ]
  },
  {
    id: "4",
    name: "Unibet",
    logo: null,
    plataforma: "Evolution Gaming",
    tiempo: "2-4 días",
    potencial: { value: "medium", label: "Medio", color: "yellow" },
    similar: "Betsson",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "150", label: "Hasta $150", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "bronze", label: "Bronze", color: "red" } }
    ]
  },
  {
    id: "5",
    name: "Bwin",
    logo: null,
    plataforma: "Playtech",
    tiempo: "1-3 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "Bet-at-home",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "400", label: "Hasta $400", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "diamond", label: "Diamond", color: "green" } }
    ]
  },
  {
    id: "6",
    name: "Royal Panda",
    logo: null,
    plataforma: "Microgaming",
    tiempo: "4-6 días",
    potencial: { value: "low", label: "Bajo", color: "red" },
    similar: "Guts",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "100", label: "Hasta $100", color: "red" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "basic", label: "Basic", color: "red" } }
    ]
  },
  {
    id: "7",
    name: "Vegas Hero",
    logo: null,
    plataforma: "NetEnt",
    tiempo: "2-3 días",
    potencial: { value: "medium", label: "Medio", color: "yellow" },
    similar: "Thrills",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "250", label: "Hasta $250", color: "yellow" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "silver", label: "Silver", color: "yellow" } }
    ]
  },
  {
    id: "8",
    name: "Mr Green",
    logo: null,
    plataforma: "Evolution Gaming",
    tiempo: "3-4 días",
    potencial: { value: "high", label: "Alto", color: "green" },
    similar: "Casino Euro",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "350", label: "Hasta $350", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "gold", label: "Gold", color: "yellow" } }
    ]
  },
  {
    id: "9",
    name: "ComeOn",
    logo: null,
    plataforma: "Playtech",
    tiempo: "1-2 días",
    potencial: { value: "very_high", label: "Muy Alto", color: "green" },
    similar: "Mobilebet",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "450", label: "Hasta $450", color: "green" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "platinum", label: "Platinum", color: "green" } }
    ]
  },
  {
    id: "10",
    name: "Next Casino",
    logo: null,
    plataforma: "Microgaming",
    tiempo: "5-7 días",
    potencial: { value: "low", label: "Bajo", color: "red" },
    similar: "VideoSlots",
    isTopThree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: [
      { fieldId: "bonus", fieldName: "Bono de Bienvenida", fieldType: "badge", value: { value: "75", label: "Hasta $75", color: "red" } },
      { fieldId: "vip", fieldName: "Programa VIP", fieldType: "badge", value: { value: "basic", label: "Basic", color: "red" } }
    ]
  }
];

export function CasinosSection({ casinos }: CasinosSectionProps) {
  // Usar siempre datos de ejemplo por ahora
  const displayCasinos = sampleCasinos

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
            <div className="relative">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
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
                        displayCasinos[0]?.customFields?.slice(casino.customFields.length, 2).map((field, i) => (
                          <TableCell key={`empty-${casino.id}-${field.fieldId}`}>-</TableCell>
                        ))
                      }
                    </TableRow>
                  ))}
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

        {/* Show count info */}
        <div className="text-center mt-6 space-y-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {displayCasinos.length} casinos de ejemplo
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ChevronRight className="h-3 w-3" />
            <span>Desliza horizontalmente para ver más información</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </section>
  )
}