import { Users, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"

export function ReferralBanner() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 relative" id="referrals">
      <div className="container mx-auto">
        <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Programa de <span className="text-cyan-400">Referidos</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>
                Cada <span className="text-cyan-400 font-bold">12 referidos</span> ganas
              </span>
              <span className="text-green-400 font-bold flex items-center gap-1">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                1.000.000
              </span>
            </p>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Comparte nuestro sistema con otros emprendedores y gana recompensas increíbles mientras ayudas a otros a
              crecer
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
