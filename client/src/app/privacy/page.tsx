"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-muted-foreground">Última actualización: 28 de octubre de 2024</p>
          <p className="text-sm text-muted-foreground mt-1">Versión 1.0</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
            <p className="text-foreground/90 leading-relaxed">
              En Red23, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de
              Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información cuando utiliza
              nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">2.1 Información de Registro</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Cuando crea una cuenta en Red23, recopilamos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90 mt-2">
                  <li>Nombre y apellido</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Contraseña (almacenada de forma cifrada)</li>
                  <li>Información de perfil que decida proporcionar</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">2.2 Información de Uso</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Recopilamos información sobre cómo utiliza nuestra plataforma:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90 mt-2">
                  <li>Contenido generado mediante nuestras herramientas de IA</li>
                  <li>Imágenes y archivos que carga o crea</li>
                  <li>Interacciones con las funcionalidades de la plataforma</li>
                  <li>Preferencias y configuraciones de cuenta</li>
                  <li>Historial de actividad y uso de servicios</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">2.3 Información Técnica</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Recopilamos automáticamente cierta información técnica:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90 mt-2">
                  <li>Dirección IP</li>
                  <li>Tipo y versión del navegador</li>
                  <li>Sistema operativo</li>
                  <li>Páginas visitadas y tiempo de permanencia</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">2.4 Información de Referidos</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Si participa en nuestro programa de referidos, recopilamos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90 mt-2">
                  <li>Códigos de referido generados y utilizados</li>
                  <li>Información sobre usuarios referidos</li>
                  <li>Estadísticas de referidos y recompensas</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Cómo Utilizamos su Información</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Procesar sus solicitudes y transacciones</li>
              <li>Mejorar y personalizar su experiencia en la plataforma</li>
              <li>Generar contenido mediante IA según sus instrucciones</li>
              <li>Comunicarnos con usted sobre actualizaciones y novedades</li>
              <li>Gestionar su cuenta y preferencias</li>
              <li>Detectar y prevenir fraudes o usos no autorizados</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Analizar el uso de la plataforma para mejoras continuas</li>
            </ul>
          </section>

          <section className="border-l-4 border-blue-500 pl-6 bg-blue-50 dark:bg-blue-950/20 py-4 rounded-r-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
              4. Deslinde de Responsabilidad sobre Datos de Terceros
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              <strong>IMPORTANTE:</strong> Red23 actúa únicamente como proveedor de herramientas tecnológicas.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>
                <strong>NO recopilamos ni procesamos datos de clientes o usuarios finales</strong> de los negocios que
                utilizan nuestra plataforma
              </li>
              <li>
                Si un casino u otro negocio utiliza nuestras herramientas, ese negocio es el <strong>único responsable</strong> de
                la protección de datos de sus propios clientes
              </li>
              <li>
                No somos responsables por cómo nuestros usuarios utilizan el contenido generado ni qué información
                recopilan de sus propios usuarios finales
              </li>
              <li>
                Cada usuario de Red23 debe cumplir con sus propias obligaciones legales de protección de datos (GDPR,
                CCPA, etc.) con respecto a sus clientes
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Compartir Información</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              No vendemos su información personal a terceros. Podemos compartir su información únicamente en las
              siguientes circunstancias:
            </p>

            <div className="space-y-3 ml-4">
              <div>
                <h4 className="font-medium text-foreground mb-1">5.1 Proveedores de Servicios</h4>
                <p className="text-foreground/90 leading-relaxed">
                  Con proveedores que nos ayudan a operar la plataforma (hosting, procesamiento de pagos,
                  análisis, servicios de IA como OpenAI)
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">5.2 Obligaciones Legales</h4>
                <p className="text-foreground/90 leading-relaxed">
                  Cuando sea requerido por ley o para proteger nuestros derechos legales
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">5.3 Transferencias Empresariales</h4>
                <p className="text-foreground/90 leading-relaxed">
                  En caso de fusión, adquisición o venta de activos, su información puede ser transferida
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">5.4 Con su Consentimiento</h4>
                <p className="text-foreground/90 leading-relaxed">
                  Cuando usted nos autorice explícitamente a compartir su información
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Almacenamiento y Seguridad</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">6.1 Medidas de Seguridad</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Implementamos medidas técnicas y organizativas para proteger su información:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90 mt-2">
                  <li>Cifrado de datos en tránsito y en reposo</li>
                  <li>Autenticación segura y gestión de accesos</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Controles de acceso estrictos</li>
                  <li>Copias de seguridad regulares</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">6.2 Retención de Datos</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Conservamos su información personal mientras su cuenta esté activa o según sea necesario para
                  proporcionar nuestros servicios. Puede solicitar la eliminación de su cuenta en cualquier momento.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">6.3 Ubicación de Datos</h3>
                <p className="text-foreground/90 leading-relaxed">
                  Sus datos pueden ser almacenados y procesados en servidores ubicados en diferentes países. Nos
                  aseguramos de que cualquier transferencia internacional cumpla con las leyes aplicables de protección
                  de datos.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Sus Derechos</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              Usted tiene los siguientes derechos sobre su información personal:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li><strong>Acceso:</strong> Solicitar una copia de su información personal</li>
              <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de su información</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso común</li>
              <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos en ciertas circunstancias</li>
              <li><strong>Restricción:</strong> Solicitar la limitación del procesamiento de sus datos</li>
              <li><strong>Retirar Consentimiento:</strong> Retirar su consentimiento en cualquier momento</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mt-3">
              Para ejercer estos derechos, contáctenos a través de los canales proporcionados en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies y Tecnologías Similares</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Mantener su sesión activa</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de la plataforma</li>
              <li>Mejorar el rendimiento y la seguridad</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mt-3">
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad de la
              plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Menores de Edad</h2>
            <p className="text-foreground/90 leading-relaxed">
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información
              personal de menores. Si descubrimos que hemos recopilado información de un menor, eliminaremos esa
              información de inmediato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Enlaces a Terceros</h2>
            <p className="text-foreground/90 leading-relaxed">
              Nuestra plataforma puede contener enlaces a sitios web de terceros. No somos responsables de las prácticas
              de privacidad de esos sitios. Le recomendamos leer las políticas de privacidad de cualquier sitio web que
              visite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Cambios a esta Política</h2>
            <p className="text-foreground/90 leading-relaxed">
              Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio
              significativo publicando la nueva política en la plataforma y actualizando la fecha de "última
              actualización". Es su responsabilidad revisar esta política regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
            <p className="text-foreground/90 leading-relaxed">
              Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos su información personal, puede
              contactarnos a través de los canales oficiales proporcionados en la plataforma.
            </p>
          </section>

          <section className="bg-muted/50 p-6 rounded-lg border">
            <p className="text-foreground/90 leading-relaxed">
              <strong>Al utilizar Red23, usted reconoce que ha leído y comprendido esta Política de Privacidad y acepta
              el procesamiento de su información personal según lo descrito aquí.</strong>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t">
          <Link href="/terms">
            <Button variant="outline" className="w-full sm:w-auto">
              Ver Términos de Uso
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
