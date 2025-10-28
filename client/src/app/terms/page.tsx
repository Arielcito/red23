"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Términos de Uso</h1>
          <p className="text-muted-foreground">Última actualización: 28 de octubre de 2024</p>
          <p className="text-sm text-muted-foreground mt-1">Versión 1.0</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
            <p className="text-foreground/90 leading-relaxed">
              Al acceder y utilizar Red23 (en adelante, "la Plataforma"), usted acepta estar sujeto a estos
              Términos de Uso. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              Red23 es una plataforma tecnológica que proporciona herramientas de generación de contenido visual
              mediante inteligencia artificial, gestión de marketing digital y recursos educativos. Nuestro servicio
              está diseñado como una herramienta neutral que puede ser utilizada por diversos tipos de negocios y
              organizaciones.
            </p>
          </section>

          <section className="border-l-4 border-amber-500 pl-6 bg-amber-50 dark:bg-amber-950/20 py-4 rounded-r-lg">
            <h2 className="text-2xl font-semibold mb-4 text-amber-900 dark:text-amber-100">
              3. Deslinde de Responsabilidad sobre el Uso de la Plataforma
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-amber-800 dark:text-amber-200">3.1 Uso Independiente</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Red23 es una plataforma tecnológica que opera como proveedor de herramientas. <strong>NO controlamos,
                  supervisamos ni somos responsables de cómo nuestros usuarios utilizan las herramientas proporcionadas.</strong>
                  Cada usuario es completamente responsable del contenido que genera y de cómo utiliza nuestros servicios.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2 text-amber-800 dark:text-amber-200">3.2 Casinos y Establecimientos de Juego</h3>
                <p className="text-foreground/90 leading-relaxed mb-3">
                  Reconocemos que algunos usuarios de nuestra plataforma pueden operar casinos, plataformas de juego o
                  establecimientos relacionados con apuestas. <strong>Red23 NO opera, gestiona, regula ni tiene control
                  sobre ningún casino o establecimiento de juego.</strong>
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  <strong>IMPORTANTE:</strong> No verificamos ni garantizamos que los casinos u operadores que utilizan
                  nuestra plataforma cuenten con las licencias o regulaciones correspondientes en sus jurisdicciones.
                  Esta verificación y cumplimiento es responsabilidad exclusiva de cada operador.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2 text-amber-800 dark:text-amber-200">3.3 Deslinde Total de Responsabilidad Legal</h3>
                <p className="text-foreground/90 leading-relaxed mb-2">
                  <strong>Red23 se desliga completamente de cualquier responsabilidad legal, civil, penal, administrativa
                  o de cualquier otra naturaleza que pueda derivarse de:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
                  <li>La operación de casinos no regulados o sin licencia por parte de nuestros usuarios</li>
                  <li>Actividades de juego ilegales realizadas por usuarios de la plataforma</li>
                  <li>Incumplimiento de leyes locales, nacionales o internacionales por parte de los usuarios</li>
                  <li>Problemas de adicción al juego o ludopatía relacionados con establecimientos que usan nuestra plataforma</li>
                  <li>Fraudes, estafas o actividades ilícitas realizadas por usuarios</li>
                  <li>Daños económicos, morales o de cualquier tipo sufridos por terceros en relación con servicios de usuarios</li>
                  <li>Contenido generado por usuarios que viole derechos de terceros</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2 text-amber-800 dark:text-amber-200">3.4 Naturaleza de la Plataforma</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Nuestra plataforma es comparable a un proveedor de servicios tecnológicos neutral (como servicios de
                  hosting, herramientas de diseño gráfico, etc.). Proporcionamos la tecnología, pero no participamos ni
                  nos beneficiamos directamente de las actividades comerciales específicas de nuestros usuarios.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Responsabilidades del Usuario</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              Al utilizar Red23, usted se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Cumplir con todas las leyes y regulaciones aplicables en su jurisdicción</li>
              <li>Obtener todas las licencias, permisos y autorizaciones necesarias para su actividad comercial</li>
              <li>No utilizar la plataforma para actividades ilegales o fraudulentas</li>
              <li>No generar contenido que viole derechos de propiedad intelectual de terceros</li>
              <li>No utilizar la plataforma para promover actividades ilegales o dañinas</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>Ser el único responsable de todo el contenido que genere o publique</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              El contenido generado a través de nuestra plataforma utilizando herramientas de IA es propiedad del usuario
              que lo genera. Sin embargo, usted es responsable de:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Verificar que el contenido generado no infrinja derechos de terceros</li>
              <li>Obtener las licencias necesarias para cualquier material de terceros que incorpore</li>
              <li>Cumplir con las restricciones de uso de las herramientas de IA que utilizamos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitación de Responsabilidad</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              <strong>Red23 proporciona sus servicios "TAL CUAL" y "SEGÚN DISPONIBILIDAD".</strong> No garantizamos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>La disponibilidad ininterrumpida del servicio</li>
              <li>La ausencia de errores o fallos técnicos</li>
              <li>Que el servicio satisfará sus necesidades específicas</li>
              <li>La calidad o exactitud del contenido generado por IA</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mt-3">
              En ningún caso Red23 será responsable por daños indirectos, incidentales, especiales o consecuentes,
              incluyendo pérdida de beneficios, datos o uso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Suspensión y Terminación</h2>
            <p className="text-foreground/90 leading-relaxed">
              Nos reservamos el derecho de suspender o terminar su acceso a la plataforma si:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90 mt-3">
              <li>Viola estos Términos de Uso</li>
              <li>Utiliza la plataforma para actividades ilegales</li>
              <li>Causa daño a otros usuarios o a la plataforma</li>
              <li>Proporciona información falsa o fraudulenta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Modificaciones</h2>
            <p className="text-foreground/90 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor
              inmediatamente después de su publicación en la plataforma. Es su responsabilidad revisar periódicamente
              estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Jurisdicción y Ley Aplicable</h2>
            <p className="text-foreground/90 leading-relaxed">
              Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables en la jurisdicción donde
              opera Red23, sin dar efecto a ningún principio de conflictos de ley.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contacto</h2>
            <p className="text-foreground/90 leading-relaxed">
              Si tiene preguntas sobre estos Términos de Uso, puede contactarnos a través de los canales oficiales
              proporcionados en la plataforma.
            </p>
          </section>

          <section className="bg-muted/50 p-6 rounded-lg border">
            <p className="text-foreground/90 leading-relaxed">
              <strong>Al utilizar Red23, usted reconoce que ha leído, entendido y aceptado estos Términos de Uso en su totalidad,
              incluyendo específicamente el deslinde de responsabilidad establecido en la Sección 3.</strong>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t">
          <Link href="/privacy">
            <Button variant="outline" className="w-full sm:w-auto">
              Ver Política de Privacidad
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
