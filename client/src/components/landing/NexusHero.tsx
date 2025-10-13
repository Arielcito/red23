"use client"

import { useState } from "react"
import { Play, Volume2, ThumbsUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function NexusHero() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-[#1e3a5f] px-4 py-8 md:py-16 flex flex-col items-center">
      {/* Logo */}
      <div className="mb-12 md:mb-16">
        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="md:w-20 md:h-20"
        />
      </div>

      {/* Video Player Card */}
      <Card className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mb-8 md:mb-12 overflow-hidden bg-gradient-to-br from-gray-900/90 to-purple-900/50 border-none shadow-2xl">
        <div className="relative aspect-video">
          {/* Video placeholder with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-purple-800/60" />

          {/* Play button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label="Reproducir video"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-blue-500/90 flex items-center justify-center group-hover:bg-blue-600 transition-all group-hover:scale-110">
              <Play className="w-10 h-10 md:w-14 md:h-14 text-white ml-2" fill="white" />
            </div>
          </button>

          {/* Text overlay */}
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <p className="text-white text-sm md:text-base font-medium">Haz clic para empezar</p>
          </div>

          {/* Video controls */}
          <div className="absolute bottom-4 left-4 flex gap-3">
            <button
              className="w-8 h-8 md:w-10 md:h-10 rounded bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
              aria-label="Reproducir/Pausar"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 text-white" fill="white" />
            </button>
            <button
              className="w-8 h-8 md:w-10 md:h-10 rounded bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
              aria-label="Volumen"
            >
              <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
        </div>
      </Card>

      {/* Content Card */}
      <Card className="w-full max-w-md md:max-w-2xl lg:max-w-4xl bg-[#0a1929] border-none shadow-2xl p-6 md:p-8 lg:p-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-6 md:mb-8 leading-tight text-balance">
          Trabajos, relaciones, respeto... Esto es lo que consigues con{" "}
          <span className="text-blue-400">el Método Nexus</span>
        </h1>

        {/* Feature Box */}
        <div className="bg-[#1e3a5f] rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <ThumbsUp className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white pt-2">Aumentas tu confianza</h2>
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Cuando sabes cómo expresarte, desaparecen las dudas al hablar, y dejas de sentirte pequeño frente a los
            demás.
          </p>
        </div>
      </Card>
    </div>
  )
}
