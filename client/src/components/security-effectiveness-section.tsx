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
        <div className="relative mb-8 sm:mb-12">
          {/* Security lock - floating left */}
          <div className="absolute -top-8 sm:-top-12 md:-top-16 lg:-top-20 left-0 sm:left-10 w-32 sm:w-48 md:w-64 lg:w-80 opacity-80 hover:opacity-100 transition-opacity duration-500 z-0">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl" />
            <Image
              src="/security-lock-dark.png"
              alt="Sistema Seguro"
              width={300}
              height={300}
              className="w-full h-full object-contain relative z-10"
            />
          </div>

          {/* Growth chart - floating right */}
          <div className="absolute -top-6 sm:-top-10 md:-top-14 lg:-top-16 right-0 sm:right-10 w-40 sm:w-56 md:w-72 lg:w-96 opacity-80 hover:opacity-100 transition-opacity duration-500 z-0">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl" />
            <Image
              src="/growth-metrics-dark.png"
              alt="Sistema Eficaz"
              width={400}
              height={240}
              className="w-full h-full object-contain relative z-10"
            />
          </div>
        </div>

        {/* Section title */}
        <div className="text-center mb-12 sm:mb-16 relative z-10 pt-24 sm:pt-32 md:pt-40 lg:pt-48">
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
