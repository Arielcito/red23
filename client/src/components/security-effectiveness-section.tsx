import Image from "next/image"

export function SecurityEffectivenessSection() {
  return (
    <section className="relative py-24 sm:py-32 md:py-40 lg:py-48 px-4 overflow-visible">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3a] to-[#0a1628]" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Hand with security image - responsive positioning */}
        <div className="relative md:absolute md:top-1/2 md:-translate-y-1/2 md:right-0 w-full md:w-[500px] lg:w-[600px] mb-12 md:mb-0 opacity-90 hover:opacity-100 transition-all duration-700 hover:scale-105 z-0">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl" />
          <Image
            src="/security.png"
            alt="Sistema Seguro y Eficaz"
            width={600}
            height={600}
            className="w-full h-auto object-contain relative z-10 mx-auto"
          />
        </div>

        {/* Section title */}
        <div className="text-center mb-12 sm:mb-16 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4">
            SISTEMA <span className="text-cyan-400">100% EFICAZ</span> Y <span className="text-cyan-400">SEGURO</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Tecnología de vanguardia que garantiza resultados excepcionales con la máxima seguridad
          </p>
        </div>

      </div>
    </section>
  )
}
