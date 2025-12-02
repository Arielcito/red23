"use client"

import { MathBackgroundDecoration } from "@/components/math-background-decoration"

export function HeroSection() {
  return (
    <section
      className="relative pt-32 sm:pt-32 sm:pb-12 pb-12 px-4 sm:px-6 overflow-hidden flex items-start"
      id="home"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-20 left-[10%] animate-pulse" />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-40 left-[20%] animate-pulse delay-100" />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-60 right-[30%] animate-pulse delay-200" />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full bottom-40 right-[15%] animate-pulse delay-300" />
      </div>

      <MathBackgroundDecoration />

      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 max-w-3xl pb-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Escala tu negocio de forma <span className="text-cyan-400">predecible</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg text-pretty px-4 sm:px-0">
              Con todas las herramientas de nuestro software lograrás que cada centavo que invertís vuelva multiplicado
            </p>
          </div>

          <div className="w-full max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 border border-slate-800 shadow-2xl shadow-purple-500/20">
              <div className="relative aspect-video">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/vsl-poster.jpg"
                >
                  <source src="/vsl-optimized.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
