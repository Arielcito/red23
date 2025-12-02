"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlagIcon } from "@/components/ui/flag-icon"

const WHATSAPP_CLOSER_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_CLOSER || "59899123456"
const COUNTRIES = [
  "Argentina",
  "Brasil", 
  "Paraguay",
  "Uruguay",
  "México",
  "Colombia",
  "Chile",
  "Perú",
  "Ecuador",
  "Venezuela",
  "Bolivia"
] as const

interface ContactFormData {
  name: string
  email: string
  telegram: string
  country: string
  referralCode: string
}

interface DemoRequestFormProps {
  onSubmitSuccess: () => void
  referralCode?: string
}

export function DemoRequestForm({ onSubmitSuccess, referralCode }: DemoRequestFormProps) {
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    telegram: "",
    country: "",
    referralCode: referralCode || "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Actualizar código de referido cuando cambie la prop
  useEffect(() => {
    if (referralCode && referralCode !== contactFormData.referralCode) {
      setContactFormData(prev => ({ ...prev, referralCode }))
    }
  }, [referralCode, contactFormData.referralCode])

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
      `País: ${contactFormData.country}` +
      (contactFormData.referralCode ? `\nCódigo de referido: ${contactFormData.referralCode}` : '')

    const whatsappUrl = `https://wa.me/${WHATSAPP_CLOSER_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

    try {
      // Primero crear el registro de usuario pendiente
      const pendingUserResponse = await fetch('/api/referrals/pending-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contactFormData.email,
          name: contactFormData.name,
          telegram: contactFormData.telegram,
          country: contactFormData.country,
          referralCode: contactFormData.referralCode || undefined,
          whatsappMessage
        }),
      })

      const pendingUserData = await pendingUserResponse.json()
      
      if (pendingUserData.success) {
        console.log('✅ Usuario pendiente creado:', pendingUserData.data)
        // Si se creó exitosamente, abrir WhatsApp
        window.open(whatsappUrl, "_blank")
      } else {
        console.error('Error creando usuario pendiente:', pendingUserData.error)
        // Aún así abrir WhatsApp, pero mostrar advertencia
        if (pendingUserData.error.includes('ya existe una solicitud pendiente')) {
          alert('Ya tienes una solicitud pendiente. Te contactaremos pronto.')
        }
        window.open(whatsappUrl, "_blank")
      }
    } catch (error) {
      console.error("Error en el proceso:", error)
      // En caso de error, aún abrir WhatsApp
      window.open(whatsappUrl, "_blank")
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
                Usuario de Telegram <span className="text-red-500"></span>
              </Label>
              <Input
                id="telegram"
                placeholder="@usuario"
                value={contactFormData.telegram}
                onChange={(e) => handleContactInputChange("telegram", e.target.value)}
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
                      <div className="flex items-center gap-2">
                        <FlagIcon country={country} size="sm" />
                        {country}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Campo de código de referido */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Código de Referido</h4>
          <div className="space-y-2">
            <Label htmlFor="referral-code">
              Código de Referido (Opcional)
            </Label>
            <Input
              id="referral-code"
              placeholder="Ingresa tu código de referido"
              value={contactFormData.referralCode}
              onChange={(e) => handleContactInputChange("referralCode", e.target.value)}
              className={referralCode ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}
            />
            {referralCode && (
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ Código de referido detectado automáticamente
              </p>
            )}
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
