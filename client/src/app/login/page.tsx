"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, MessageCircle, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessType: "",
    currentFollowers: "",
    goals: "",
    budget: "",
    timeline: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">¡Solicitud Enviada!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Gracias por tu interés. Nuestro equipo revisará tu solicitud y te contactará en las próximas 24 horas
                para programar una demo personalizada.
              </p>
              <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Te contactaremos por email y WhatsApp</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Demo personalizada en 24-48 horas</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Propuesta comercial adaptada a tu negocio</span>
                </div>
              </div>
              <Link href="/">
                <Button className="mt-6 bg-primary-600 hover:bg-primary-700">Volver al Inicio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Contact Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="/logo.png" alt="Logo" className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">Solicita tu Demo Personalizada</CardTitle>
            <CardDescription className="text-lg">
              Cuéntanos sobre tu negocio y te mostraremos cómo nuestra IA puede transformar tu contenido visual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nombre Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      WhatsApp/Teléfono <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa/Marca</Label>
                    <Input
                      id="company"
                      placeholder="Nombre de tu empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información del Negocio</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">
                      Tipo de Negocio <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("businessType", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="marketing">Agencia de Marketing</SelectItem>
                        <SelectItem value="restaurant">Restaurante/Gastronomía</SelectItem>
                        <SelectItem value="fashion">Moda/Belleza</SelectItem>
                        <SelectItem value="real-estate">Bienes Raíces</SelectItem>
                        <SelectItem value="fitness">Fitness/Salud</SelectItem>
                        <SelectItem value="education">Educación</SelectItem>
                        <SelectItem value="freelancer">Freelancer/Consultor</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentFollowers">Seguidores Actuales</Label>
                    <Select onValueChange={(value) => handleInputChange("currentFollowers", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tamaño de audiencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1k">0 - 1,000</SelectItem>
                        <SelectItem value="1k-5k">1,000 - 5,000</SelectItem>
                        <SelectItem value="5k-10k">5,000 - 10,000</SelectItem>
                        <SelectItem value="10k-50k">10,000 - 50,000</SelectItem>
                        <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                        <SelectItem value="100k+">100,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detalles del Proyecto</h3>
                <div className="space-y-2">
                  <Label htmlFor="goals">
                    ¿Cuáles son tus objetivos principales? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="Ej: Aumentar engagement, automatizar contenido, generar más leads, mejorar presencia visual..."
                    value={formData.goals}
                    onChange={(e) => handleInputChange("goals", e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Presupuesto Mensual</Label>
                    <Select onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rango de inversión" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-100">Menos de $100</SelectItem>
                        <SelectItem value="100-300">$100 - $300</SelectItem>
                        <SelectItem value="300-500">$300 - $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000+">Más de $1,000</SelectItem>
                        <SelectItem value="discuss">Prefiero discutirlo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">¿Cuándo quieres empezar?</Label>
                    <Select onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">Inmediatamente</SelectItem>
                        <SelectItem value="this-week">Esta semana</SelectItem>
                        <SelectItem value="this-month">Este mes</SelectItem>
                        <SelectItem value="next-month">Próximo mes</SelectItem>
                        <SelectItem value="exploring">Solo explorando opciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje Adicional</Label>
                  <Textarea
                    id="message"
                    placeholder="Cuéntanos más sobre tu negocio, desafíos actuales o preguntas específicas..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-lg py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enviando Solicitud...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Solicitar Demo Personalizada
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <h4 className="font-semibold text-primary-800 dark:text-primary-300 mb-2">¿Qué incluye tu demo?</h4>
              <ul className="text-sm text-primary-700 dark:text-primary-400 space-y-1">
                <li>✅ Análisis personalizado de tu negocio</li>
                <li>✅ Demo en vivo de la plataforma</li>
                <li>✅ Estrategia de contenido recomendada</li>
                <li>✅ Propuesta comercial adaptada</li>
                <li>✅ Configuración inicial gratuita</li>
              </ul>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🔒 Tus datos están seguros. No compartimos información con terceros.
                <br />📞 Te contactaremos en las próximas 24 horas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
