"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ImageIcon,
  MessageCircle,
  Smartphone,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Target,
  BarChart3,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "María González",
      role: "Emprendedora Digital",
      content: "Desde que uso esta plataforma, mis historias de WhatsApp tienen 300% más engagement. ¡Es increíble!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=MG",
    },
    {
      name: "Carlos Ruiz",
      role: "Marketing Manager",
      content:
        "La automatización me ahorra 2 horas diarias. Ahora puedo enfocarme en estrategia mientras la IA trabaja.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=CR",
    },
    {
      name: "Ana Martín",
      role: "Creadora de Contenido",
      content: "Mis clientes están fascinados con la calidad de las imágenes. He aumentado mis tarifas un 50%.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=AM",
    },
  ]

  const features = [
    {
      icon: MessageCircle,
      title: "Chatbot IA Inteligente",
      description: "Genera imágenes profesionales con simples descripciones en texto",
      color: "text-primary-500",
    },
    {
      icon: Smartphone,
      title: "Publicación Automática",
      description: "Programa tus historias de WhatsApp para publicarse automáticamente",
      color: "text-secondary-500",
    },
    {
      icon: ImageIcon,
      title: "Galería Organizada",
      description: "Gestiona todas tus creaciones en un solo lugar con etiquetas inteligentes",
      color: "text-tertiary-500",
    },
    {
      icon: Clock,
      title: "Ahorra Tiempo",
      description: "Automatiza tu contenido visual y enfócate en hacer crecer tu negocio",
      color: "text-primary-600",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Imágenes Generadas", icon: ImageIcon },
    { number: "500+", label: "Usuarios Activos", icon: Users },
    { number: "98%", label: "Satisfacción", icon: Star },
    { number: "24/7", label: "Disponibilidad", icon: Clock },
  ]

  const benefits = [
    "Genera imágenes profesionales en segundos",
    "Automatiza tus publicaciones de WhatsApp",
    "Aumenta tu engagement hasta 300%",
    "Ahorra 2+ horas diarias de trabajo manual",
    "Acceso a IA de última generación",
    "Soporte técnico incluido",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Logo" className="h-12 w-12" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
                Red23
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Solicitar Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <Badge className="bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900 dark:text-primary-300">
              🚀 Más de 10,000 imágenes generadas
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-tertiary-400 bg-clip-text text-transparent">
                Crea Imágenes
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">con IA en Segundos</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transforma simples descripciones en imágenes profesionales y publícalas automáticamente en WhatsApp.
              <span className="text-primary-600 font-semibold"> Sin diseño, sin complicaciones.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-6">
                  <Calendar className="mr-2 h-5 w-5" />
                  Solicitar Demo Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                <Play className="mr-2 h-5 w-5" />
                Ver Casos de Éxito
              </Button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✅ Demo personalizada • ✅ Análisis de tu negocio • ✅ Propuesta comercial adaptada
            </p>
          </div>

          {/* Hero Image/Video Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-2xl p-8 shadow-2xl">
              <div className="aspect-video bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <Play className="h-10 w-10 text-primary-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Demo de la plataforma</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary-500" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Todo lo que necesitas para
              <span className="bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
                {" "}
                dominar WhatsApp
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Una plataforma completa que combina IA avanzada con automatización inteligente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-0 bg-white dark:bg-gray-800">
                <CardContent className="p-0">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                ¿Por qué elegir
                <span className="bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
                  {" "}
                  nuestra plataforma?
                </span>
              </h2>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-primary-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/login">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendar Demo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Resultados Garantizados</h4>
                      <p className="text-gray-600 dark:text-gray-300">O te devolvemos tu dinero</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Métricas en Tiempo Real</h4>
                      <p className="text-gray-600 dark:text-gray-300">Monitorea tu rendimiento</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-tertiary-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-tertiary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Comunidad Activa</h4>
                      <p className="text-gray-600 dark:text-gray-300">Aprende de otros usuarios</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Lo que dicen nuestros
              <span className="bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
                {" "}
                clientes
              </span>
            </h2>
          </div>

          <div className="relative">
            <Card className="max-w-4xl mx-auto p-8 border-0 shadow-2xl">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-500 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¿Listo para revolucionar tu contenido?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Agenda una demo personalizada y descubre cómo nuestra IA puede transformar tu estrategia de contenido visual
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 bg-white text-primary-600 hover:bg-gray-100"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Solicitar Demo Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-primary-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Demo personalizada</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Análisis de tu negocio</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Propuesta comercial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold">AI Creator</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                La plataforma más avanzada para crear imágenes con IA y automatizar tus publicaciones en WhatsApp.
              </p>
              <div className="flex space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Solicitar Demo
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Casos de Éxito
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Integraciones
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Solicitar Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    WhatsApp Business
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Comunidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Creator. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
