import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  error: string
}

export function ErrorState({ error }: ErrorStateProps) {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-12">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Error al cargar contenido</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Hubo un problema al cargar las novedades. Por favor, inténtalo de nuevo.
              </p>
              <p className="text-sm text-muted-foreground">
                Error: {error}
              </p>
            </div>
            <Button onClick={handleReload} className="mt-4">
              Recargar página
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}