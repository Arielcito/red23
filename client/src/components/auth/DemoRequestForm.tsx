"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const WHATSAPP_CLOSER_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_CLOSER || "59899123456"
const COUNTRIES = ["Paraguay", "México", "Uruguay"] as const

interface ContactFormData {
  name: string
  email: string
  telegram: string
  country: string
}

interface DemoRequestFormProps {
  onSubmitSuccess: () => void
}

export function DemoRequestForm({ onSubmitSuccess }: DemoRequestFormProps) {
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    telegram: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleContactInputChange = (field: keyof ContactFormData, value: string) => {
    setContactFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!contactFormData.country) {
      alert("Por favor selecciona tu país")
      setIsLoading(false)
      return
    }

    const whatsappMessage = `Hola, soy ${contactFormData.name}. Me gustaría solicitar una demo de la plataforma Red23.\n\n` +
      `Correo: ${contactFormData.email}\n` +
      `Telegram: ${contactFormData.telegram}\n` +
      `País: ${contactFormData.country}`

    const whatsappUrl = `https://wa.me/${WHATSAPP_CLOSER_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

    try {
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error("No se pudo abrir WhatsApp", error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        onSubmitSuccess()
      }, 500)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Solicita tu Demo Personalizada
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Cuéntanos sobre tu negocio y te mostraremos cómo nuestra IA puede transformar tu contenido visual
        </p>
      </div>

      <form onSubmit={handleContactSubmit} className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Información Personal</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Tu nombre completo"
                value={contactFormData.name}
                onChange={(e) => handleContactInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-demo">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email-demo"
                type="email"
                placeholder="tu@email.com"
                value={contactFormData.email}
                onChange={(e) => handleContactInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telegram">
                Usuario de Telegram <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telegram"
                placeholder="@usuario"
                value={contactFormData.telegram}
                onChange={(e) => handleContactInputChange("telegram", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">
                País <span className="text-red-500">*</span>
              </Label>
              <Select
                value={contactFormData.country}
                onValueChange={(value) => handleContactInputChange("country", value)}
              >
                <SelectTrigger id="country" className="w-full">
                  <SelectValue placeholder="Selecciona tu país" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🔒 Tus datos están seguros. No compartimos información con terceros.
          <br />📞 Te contactaremos en las próximas 24 horas.
        </p>
      </div>
    </div>
  )
}
