"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Bell,
  Palette,
  Shield,
  CreditCard,
  Globe,
  Camera,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <AppLayout title="Configuración" subtitle="Personaliza tu experiencia en Red23">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Perfil de Usuario</span>
            </CardTitle>
            <CardDescription>
              Gestiona tu información personal y preferencias de cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt="Usuario" />
                <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                  JP
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">Juan Pérez</h3>
                <p className="text-sm text-gray-500">juan@casino.com</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Camera className="h-4 w-4 mr-2" />
                  Cambiar foto
                </Button>
              </div>
              <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                Plan Pro
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" defaultValue="Juan Pérez" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="juan@casino.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" defaultValue="Casino Online S.A." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="timezone">Zona horaria</Label>
                <Select defaultValue="america/mexico_city">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america/mexico_city">Ciudad de México (GMT-6)</SelectItem>
                    <SelectItem value="america/new_york">Nueva York (GMT-5)</SelectItem>
                    <SelectItem value="europe/madrid">Madrid (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificaciones</span>
            </CardTitle>
            <CardDescription>
              Configura cuándo y cómo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Imágenes generadas</Label>
                <p className="text-sm text-gray-500">Notificar cuando se complete la generación</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Publicaciones programadas</Label>
                <p className="text-sm text-gray-500">Confirmación de publicaciones en WhatsApp</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Límite de uso</Label>
                <p className="text-sm text-gray-500">Avisar cuando te acerques al límite mensual</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Actualizaciones del producto</Label>
                <p className="text-sm text-gray-500">Nuevas funcionalidades y mejoras</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Apariencia</span>
            </CardTitle>
            <CardDescription>
              Personaliza la interfaz según tus preferencias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Tema</Label>
              <p className="text-sm text-gray-500 mb-3">Elige el tema de la interfaz</p>
              <Select defaultValue="system">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Automático (sistema)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base font-medium">Idioma</Label>
              <p className="text-sm text-gray-500 mb-3">Idioma de la interfaz</p>
              <Select defaultValue="es">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Seguridad</span>
            </CardTitle>
            <CardDescription>
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Autenticación de dos factores</Label>
                <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Cambiar contraseña</Label>
                <p className="text-sm text-gray-500">Última actualización: hace 3 meses</p>
              </div>
              <Button variant="outline" size="sm">
                Cambiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Plan y Facturación</span>
            </CardTitle>
            <CardDescription>
              Gestiona tu suscripción y métodos de pago
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div>
                <Label className="text-base font-medium">Plan Actual</Label>
                <p className="text-sm text-gray-500">500 imágenes/mes • Programación automática • Soporte prioritario</p>
              </div>
              <Badge className="bg-primary-600">Plan Pro</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Método de pago</Label>
                <p className="text-sm text-gray-500">•••• •••• •••• 4242</p>
              </div>
              <Button variant="outline" size="sm">
                Actualizar
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                Ver historial de facturación
              </Button>
              <Button className="flex-1 bg-primary-600 hover:bg-primary-700">
                Actualizar plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline">
            Cancelar cambios
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700">
            Guardar configuración
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}