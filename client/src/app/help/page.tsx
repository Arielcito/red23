"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  Images,
  HelpCircle,
  ExternalLink,
  Smartphone,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const quickActions = [
    {
      title: "Generar mi primera imagen",
      description: "Usar el chat IA para crear contenido",
      href: "/chat",
      icon: Sparkles,
      color: "bg-primary-600 hover:bg-primary-700",
    },
    {
      title: "Tutoriales",
      description: "Aprende a usar Red23",
      href: "/tutorials",
      icon: Smartphone,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Ver mis imágenes",
      description: "Explorar la galería de contenido",
      href: "/gallery",
      icon: Images,
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ]

  const faqs = [

    {
      question: "¿Qué es un prompt?",
      answer: "Un prompt es la descripción de la imagen que deseas crear."
    },
    {
      question: "¿Cómo agrego mi logo a las imágenes que creo?",
      answer: "Para agregar tu logo debes hacer click en subir archivo y elegir la posicion donde quieres que se vea."
    },
    {
      question: "¿Cómo reclamo mis premios en caso de haber ganado?",
      answer: "Una vez hayas ganado, alguien del equipo se va a contactar contigo por Telegram o WhatsApp."
    },
    {
      question: "¿Cómo me beneficio de las novedades?",
      answer: "Te beneficiarás con información exclusiva en tiempo real, que usarás para tomar ventaja de tu competencia."
    },
    {
      question: "¿En qué se basan para seleccionar las mejores tres plataformas?",
      answer: "Nos basamos en volumen, seguridad y experiencia de usuario. Información a la cual accedemos al trabajar de manera directa con ellos."
    },
    {
      question: "¿Qué es el porcentaje RTP?",
      answer: "El RTP es el porcentaje de retorno de dinero al jugador."
    },
    {
      question: "¿En la base de datos, a qué se refiere en plataforma similar?",
      answer: "Se refiere a que la plataforma mencionada comparte características similares a la principal."
    },
    {
      question: "¿Dónde puedo ver mis imágenes creadas?",
      answer: "Las imágenes previamente creadas las puedes ver desde la galería."
    },
    {
      question: "¿Cómo participo en los premios?",
      answer: "Al ser usuario activo de Red23 ya estás participando por los distintos premios."
    },
    {
      question: "¿Es necesario completar la ruta de aprendizaje?",
      answer: "Es indispensable completar la ruta de aprendizaje para poder usar y aprovechar al máximo todas las funciones del software."
    },
    {
      question: "¿Cómo generar más clientes con mis anuncios?",
      answer: "Para generar mejores anuncios debes completar el paso a paso de la ruta de aprendizaje."
    },
    {
      question: "¿Cómo referir a otras personas?",
      answer: "Debes generar tu enlace y compartir tu link a colegas, clientes y terceros."
    },
    {
      question: "¿A quién puedo referir el software?",
      answer: "El software se lo puedes referir a colegas, clientes y terceros."
    },
    {
      question: "¿Cómo reclamo las ganancias que me generan mis referidos?",
      answer: "Mantener tu suscripción activa y esperar a ser contactado por nosotros en un plazo de 48hs hábiles."
    },
    {
      question: "¿Es importante el grupo oficial de Telegram?",
      answer: "Es fundamental para estar al tanto de premios, descuentos, promociones, noticias y más."
    },
    {
      question: "¿Por qué debo renovar mi suscripción?",
      answer: "Es importante renovar tu suscripción para incrementar las ventas, ahorrar tiempo y contar con información exclusiva."
    },
    {
      question: "¿Cómo me contacto con soporte?",
      answer: "Te puedes contactar con soporte haciendo click aquí."
    },
  ]

  return (
    <AppLayout title="Centro de Ayuda" subtitle="Guías y soporte para Red23">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ¿Cómo podemos ayudarte?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Encuentra guías paso a paso, rutas de aprendizaje y respuestas a las preguntas más frecuentes sobre Red23.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Empieza ahora con estas acciones comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}>
                    <Button
                      variant="outline"
                      className={`w-full h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all ${action.color} text-white border-0`}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
            <CardDescription>Respuestas rápidas a las consultas más comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>¿Necesitas más ayuda?</span>
            </CardTitle>
            <CardDescription>
              Si no encuentras lo que buscas, nuestro equipo está aquí para ayudarte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-primary-600 hover:bg-primary-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentación Completa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p>¿Te falta alguna guía? <Link href="/contact" className="text-primary-600 hover:text-primary-700">Déjanos saber</Link> qué te gustaría aprender.</p>
        </div>
      </div>
    </AppLayout>
  )
}