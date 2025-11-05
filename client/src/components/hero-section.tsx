"use client"

import { Play } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { MathBackgroundDecoration } from "@/components/math-background-decoration"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section
      className="relative pt-32 sm:pt-32 sm:pb-12 pb-12 px-4 sm:px-6 overflow-hidden flex items-start"
      id="home"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-20 left-[10%] animate-pulse" />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-40 left-[20%] animate-pulse delay-100" />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-60 right-[30%] animate-pulse delay-200" />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full bottom-40 right-[15%] animate-pulse delay-300" />
      </div>

      <MathBackgroundDecoration />

      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-8">

          {/* Text content */}
          <div className="space-y-3 sm:space-y-4 max-w-3xl pb-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Escala tu negocio de forma <span className="text-cyan-400">predecible</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg text-pretty px-4 sm:px-0">
              Con todas las herramientas de nuestro software lograrás que cada centavo que invertís vuelva multiplicado
            </p>
          </div>

          {/* Video player */}
          <div className="w-full max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 border border-slate-800 shadow-2xl shadow-purple-500/20">
              {/* Video aspect ratio container */}
              <div className="relative aspect-video">
                {/* Video element (placeholder for now) */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-purple-900/80" />

                {/* Play button overlay */}
                {!isPlaying && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform group-hover:scale-110 group-hover:bg-blue-500">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="white" />
                    </div>
                    <p className="text-white text-sm sm:text-base md:text-lg font-medium px-4">Haz clic para empezar</p>
                  </button>
                )}

                {/* Video controls */}
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2 sm:gap-3">
                  <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:text-cyan-400 transition-colors">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                  </button>
                  <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:text-cyan-400 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
