"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Clock,
  Star,
  Target,
} from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { useLearningPaths } from "@/lib/hooks/useLearningPaths"
import { LearningPathsSection } from "@/components/tutorials/LearningPathsSection"
import { LeadFormModal } from "@/components/tutorials/LeadFormModal"
import { useLeadFormModal } from "@/lib/hooks/useLeadFormModal"

export default function TutorialsPage() {
  const { learningPaths, isLoading } = useLearningPaths()
  const { isOpen, handleClose } = useLeadFormModal()

  const stats = [
    {
      title: "Rutas Disponibles",
      value: learningPaths.length.toString(),
      icon: Target,
      color: "text-primary-500"
    },
    {
      title: "Horas de Contenido",
      value: "156h",
      icon: Clock,
      color: "text-tertiary-500"
    },
    {
      title: "Satisfacción",
      value: "98%",
      icon: Star,
      color: "text-yellow-500"
    }
  ]

  return (
    <>
      <LeadFormModal open={isOpen} onOpenChange={handleClose} />
      <AppLayout
        title="Rutas de Aprendizaje"
        subtitle="Aprende marketing digital con nuestros cursos"
        badge={{
          text: "Nuevo",
          variant: "default",
          className: "bg-primary-500 text-white"
        }}
      >
        <div className="p-4 sm:p-6 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-3">
              <div className="flex flex-col items-center text-center space-y-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.title}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Learning Path Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-500" />
              Rutas de Aprendizaje
            </CardTitle>
            <CardDescription>
              Elige tu camino de aprendizaje y accede a cursos organizados por nivel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border-2 border-dashed border-gray-200 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <LearningPathsSection 
                learningPaths={learningPaths}
                showHeader={false}
                className="py-0"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
    </>
  )
}