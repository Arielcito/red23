"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, LogIn, Calendar } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginForm } from "@/components/auth/LoginForm"
import { DemoRequestForm } from "@/components/auth/DemoRequestForm"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { SuccessMessage } from "@/components/auth/SuccessMessage"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [referralCode, setReferralCode] = useState<string>("")

  useEffect(() => {
    const refParam = searchParams.get('ref')
    if (refParam) {
      setReferralCode(refParam)
      console.log('[AuthPage] Código de referido detectado:', refParam)
      // Auto-cambiar a la tab de demo si viene con código de referido
      setActiveTab("demo")
    }
  }, [searchParams])

  if (isSubmitted) {
    return <SuccessMessage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <Card className="w-full">
          <AuthHeader />
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar Sesión</span>
                </TabsTrigger>
                <TabsTrigger value="demo" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Solicitar Demo</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <LoginForm onSwitchToDemo={() => setActiveTab("demo")} />
              </TabsContent>

              <TabsContent value="demo" className="space-y-6 mt-6">
                <DemoRequestForm 
                  onSubmitSuccess={() => setIsSubmitted(true)} 
                  referralCode={referralCode}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}