"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle, Clock, Settings, QrCode } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function WhatsAppSetupPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [autoPost, setAutoPost] = useState(false)
  const [postTime, setPostTime] = useState("09:00")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleConnect = () => {
    // Simulate WhatsApp connection
    setTimeout(() => {
      setIsConnected(true)
    }, 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAutoPost(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración WhatsApp</h1>
              <p className="text-gray-600 dark:text-gray-300">Conecta tu cuenta para publicaciones automáticas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className={isConnected ? "bg-tertiary-500 hover:bg-tertiary-600" : ""}
            >
              {isConnected ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Estado de Conexión</span>
            </CardTitle>
            <CardDescription>
              Conecta tu cuenta de WhatsApp para habilitar las publicaciones automáticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">WhatsApp no conectado</p>
                    <p className="text-sm text-yellow-600">
                      Necesitas conectar tu cuenta para usar las funciones automáticas
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Número de teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleConnect} className="flex-1 bg-primary-600 hover:bg-primary-700">
                      <QrCode className="h-4 w-4 mr-2" />
                      Conectar con QR
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Conectar con SMS
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-tertiary-50 border border-tertiary-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-tertiary-600" />
                  <div className="flex-1">
                    <p className="font-medium text-tertiary-800">WhatsApp conectado exitosamente</p>
                    <p className="text-sm text-tertiary-600">Cuenta: {phoneNumber || "+1234567890"}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    Desconectar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auto-posting Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Publicación Automática</span>
            </CardTitle>
            <CardDescription>Configura cuándo y cómo se publican automáticamente tus imágenes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-post" className="text-base font-medium">
                  Habilitar publicación automática
                </Label>
                <p className="text-sm text-gray-600">
                  Publica automáticamente una imagen diaria en tu historia de WhatsApp
                </p>
              </div>
              <Switch id="auto-post" checked={autoPost} onCheckedChange={setAutoPost} disabled={!isConnected} />
            </div>

            {autoPost && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label htmlFor="post-time">Hora de publicación</Label>
                  <Input
                    id="post-time"
                    type="time"
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
                    className="mt-1 w-40"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    La imagen se publicará automáticamente a esta hora todos los días
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de contenido</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="content-type" value="latest" defaultChecked />
                        <span className="text-sm">Última imagen generada</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="content-type" value="random" />
                        <span className="text-sm">Imagen aleatoria de favoritas</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="content-type" value="scheduled" />
                        <span className="text-sm">Solo imágenes programadas</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Días de la semana</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, index) => (
                        <label key={day} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked={index < 5} />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Configuración Avanzada</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="caption-template">Plantilla de descripción</Label>
                  <Input id="caption-template" placeholder="🎨 Creado con IA | #arte #creatividad" className="mt-1" />
                  <p className="text-xs text-gray-600 mt-1">Texto que se añadirá a cada publicación automática</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Notificaciones</Label>
                    <p className="text-xs text-gray-600">Recibir confirmación de publicaciones</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Backup automático</Label>
                    <p className="text-xs text-gray-600">Guardar copia de imágenes publicadas</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Modo privado</Label>
                    <p className="text-xs text-gray-600">Solo contactos pueden ver las historias</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline">Cancelar</Button>
          <Button disabled={!isConnected} className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400">
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  )
}
