import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32 md:py-40 lg:py-48 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/stand-out-the-crowd.jpg"
          alt="Stand out from the crowd"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 via-30% to-[#0a1628]/40 to-70%" />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 text-balance drop-shadow-2xl px-4">
          Empezá hoy y comenzá a <span className="text-cyan-400">diferenciarte de tu competencia</span>
        </h2>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8 sm:px-12 py-6 sm:py-8 text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 mx-auto shadow-2xl shadow-cyan-500/20">
          Comenzar Ahora
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>
    </section>
  )
}
