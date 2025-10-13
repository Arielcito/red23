import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CommunicationCTA() {
  return (
    <div className="w-full bg-white py-12 md:py-20 px-4 flex justify-center">
      <Card className="w-full max-w-md md:max-w-2xl lg:max-w-4xl bg-[#0a1929] border-none shadow-2xl p-6 md:p-8 lg:p-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-6 leading-tight text-balance">
          Cambia tu vida gracias a la comunicación
        </h2>

        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
          En el Instituto de Comunicación te ayudamos a desarrollar la habilidad más poderosa del siglo XXI para
          multiplicar tu valor, generar oportunidades reales y vivir con libertad
        </p>

        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-base md:text-lg rounded-xl mb-8 w-full md:w-auto">
          Ir al método
        </Button>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <img
              src="/professional-business-people-shaking-hands.jpg"
              alt="Profesionales en comunicación"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <img
              src="/conference-presentation-audience-learning.jpg"
              alt="Conferencia de comunicación"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
