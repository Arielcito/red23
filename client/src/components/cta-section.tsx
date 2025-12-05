import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section
      className="min-h-[35vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[75vh] flex items-start justify-center relative overflow-hidden bg-[center_20%] md:bg-[center_50%] bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'url(/stand-out-the-crowd.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/10 via-[#0a1628]/30 via-50% to-[#0a1628]/70 to-100%" />

      <div className="container text-center relative z-10 w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-balance drop-shadow-2xl px-4">
          Empezá hoy y comenzá a <br />
          <span className="text-cyan-400">diferenciarte de tu competencia</span>
        </h2>
        <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8 sm:px-12 py-6 sm:py-8 text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 mx-auto shadow-2xl shadow-cyan-500/20">
          <Link href="/login">
            Comenzar Ahora
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
