"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Shield, FileText, Lock } from "lucide-react"

interface TermsAcceptanceModalProps {
  open: boolean
  onAccept: () => Promise<void>
  isAccepting: boolean
}

export function TermsAcceptanceModal({
  open,
  onAccept,
  isAccepting
}: TermsAcceptanceModalProps) {
  const [hasScrolled, setHasScrolled] = React.useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrolledToBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50

    if (scrolledToBottom && !hasScrolled) {
      setHasScrolled(true)
    }
  }

  return (
    <DialogPrimitive.Root open={open} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-[95vw] max-w-2xl translate-x-[-50%] translate-y-[-50%]",
            "border bg-background shadow-2xl duration-300",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "rounded-xl overflow-hidden"
          )}
        >
          <div className="flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10 px-6 py-6 border-b">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <DialogPrimitive.Title className="text-2xl font-bold">
                    Términos y Privacidad
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm text-muted-foreground mt-1">
                    Por favor, revisa y acepta nuestros términos para continuar
                  </DialogPrimitive.Description>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className="px-6 py-6 overflow-y-auto flex-1"
              onScroll={handleScroll}
            >
              <div className="space-y-6">
                {/* Important Notice */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                        Aviso Importante
                      </h3>
                      <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                        Al usar Red23, reconoces que somos un proveedor de herramientas tecnológicas.
                        No operamos, gestionamos ni regulamos casinos u otros negocios que utilicen nuestra plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Sections */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Deslinde de Responsabilidad
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Red23 se desliga de toda responsabilidad legal relacionada con el uso de la plataforma
                      por parte de casinos no regulados o cualquier actividad ilegal realizada por usuarios.
                      No verificamos licencias ni regulaciones de los negocios que usan nuestras herramientas.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Uso del Servicio
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Proporcionamos herramientas de generación de contenido y gestión de marketing. Eres
                      responsable de cumplir con todas las leyes aplicables en tu jurisdicción y obtener
                      las licencias necesarias para tu actividad comercial.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Privacidad
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Recopilamos y protegemos tu información personal según nuestra Política de Privacidad.
                      No somos responsables de los datos que tú recopiles de tus propios clientes o usuarios finales.
                    </p>
                  </div>
                </div>

                {/* Links to full documents */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium">
                    Para información completa, consulta nuestros documentos legales:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href="/terms"
                      target="_blank"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Términos Completos
                      </Button>
                    </Link>
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Política de Privacidad
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Los enlaces se abrirán en una nueva pestaña
                  </p>
                </div>

                {/* Scroll indicator - only show if not scrolled */}
                {!hasScrolled && (
                  <div className="text-center animate-pulse">
                    <p className="text-xs text-muted-foreground">
                      ↓ Desplázate para ver más ↓
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-muted/30">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    className="mt-1"
                    disabled={isAccepting}
                  />
                  <label
                    htmlFor="terms-checkbox"
                    className="text-sm leading-relaxed"
                  >
                    He leído y acepto los{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-primary hover:underline font-medium"
                    >
                      Términos de Uso
                    </Link>
                    {" "}y la{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-primary hover:underline font-medium"
                    >
                      Política de Privacidad
                    </Link>
                  </label>
                </div>

                <Button
                  onClick={onAccept}
                  disabled={isAccepting}
                  className="w-full"
                  size="lg"
                >
                  {isAccepting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Aceptar y Continuar
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Este modal no se puede cerrar sin aceptar los términos
                </p>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
