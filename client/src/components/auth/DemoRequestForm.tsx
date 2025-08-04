"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
}

interface DemoRequestFormProps {
  onSubmitSuccess: () => void
}

export function DemoRequestForm({ onSubmitSuccess }: DemoRequestFormProps) {
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleContactInputChange = (field: string, value: string) => {
    setContactFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      onSubmitSuccess()
    }, 2000)
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
              <Label htmlFor="phone">
                WhatsApp/Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={contactFormData.phone}
                onChange={(e) => handleContactInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa/Marca</Label>
              <Input
                id="company"
                placeholder="Nombre de tu empresa"
                value={contactFormData.company}
                onChange={(e) => handleContactInputChange("company", e.target.value)}
              />
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