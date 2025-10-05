"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  MessageCircle,
  Calendar,
  Images,
  Upload,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const sections = [
    {
      id: "getting-started",
      title: "Primeros Pasos",
      icon: BookOpen,
      description: "Configuración inicial y conceptos básicos",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "generate-images",
      title: "Generar Imágenes con IA",
      icon: MessageCircle,
      description: "Cómo usar el chat para crear imágenes promocionales",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "whatsapp-scheduling",
      title: "Programar en WhatsApp",
      icon: Calendar,
      description: "Automatizar publicaciones en WhatsApp Stories",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "gallery-management",
      title: "Gestión de Galería",
      icon: Images,
      description: "Organizar y administrar tus imágenes",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "upload-images",
      title: "Subir Imágenes",
      icon: Upload,
      description: "Cargar tus propias imágenes al sistema",
      color: "bg-teal-100 text-teal-600",
    },
    {
      id: "account-settings",
      title: "Configuración de Cuenta",
      icon: Settings,
      description: "Personalizar tu perfil y preferencias",
      color: "bg-gray-100 text-gray-600",
    },
  ]

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
      color: "bg-green-600 hover:bg-green-700",
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
      question: "¿Cómo genero mi primera imagen?",
      answer: "Ve al Chat IA y describe lo que quieres crear. Por ejemplo: 'Banner promocional para jackpot de $1M con colores dorados'."
    },
    {
      question: "¿Puedo programar publicaciones automáticas?",
      answer: "Sí, desde cualquier imagen puedes programar cuándo se publique en WhatsApp Stories usando nuestro calendario integrado."
    },
    {
      question: "¿Qué formatos de imagen soporta?",
      answer: "Soportamos JPG, PNG, GIF y WebP. Recomendamos imágenes de al menos 1024x1024 píxeles para mejor calidad."
    },
    {
      question: "¿Cuántas imágenes puedo generar?",
      answer: "Depende de tu plan. El Plan Pro incluye 500 imágenes mensuales. Puedes ver tu uso actual en el inicio."
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
                  <Link key={index} href={action.href}>
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
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
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