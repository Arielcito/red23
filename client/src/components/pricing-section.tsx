import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Plan Básico",
    price: 199,
    description: "Ideal para emprendedores que están comenzando",
    features: [
      "Generación de imágenes con IA",
      "Portal de noticias",
      "Tutoriales básicos",
      "Soporte por email",
      "Sistema de referidos",
    ],
    popular: false,
  },
  {
    name: "Plan Profesional",
    price: 349,
    description: "Para negocios que buscan escalar rápidamente",
    features: [
      "Todo en Básico",
      "Premios diarios y mensuales",
      "Tutoriales avanzados",
      "Soporte prioritario",
      "Análisis de competencia",
      "Optimización con IA",
    ],
    popular: true,
  },
  {
    name: "Plan Empresarial",
    price: 495,
    description: "Solución completa para empresas establecidas",
    features: [
      "Todo en Profesional",
      "Campañas ilimitadas",
      "Gerente de cuenta dedicado",
      "Soporte 24/7 premium",
      "Integración personalizada",
      "Consultoría estratégica",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 relative" id="pricing">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Planes de <span className="text-cyan-400">Precios</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg px-4">
            Elige el plan que se adapte a tus necesidades y comienza a multiplicar tu inversión hoy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-[#0f1f3a]/50 border-cyan-500/20 p-6 sm:p-8 hover:border-cyan-500/50 transition-all duration-300 ${
                plan.popular ? "ring-2 ring-cyan-500 shadow-xl shadow-cyan-500/20" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 right-4 sm:right-8 bg-cyan-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transform rotate-12">
                  POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl sm:text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 text-sm sm:text-base">/mes</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">{plan.description}</p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <p className="font-semibold text-white text-sm sm:text-base">Características:</p>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className={`w-full rounded-full py-5 sm:py-6 text-sm sm:text-base ${
                  plan.popular
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                    : "bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                }`}
              >
                <Link href="/login">
                  Comenzar Ahora
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
