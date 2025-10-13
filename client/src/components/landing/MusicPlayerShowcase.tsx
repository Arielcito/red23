"use client"

import { Card } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { useState } from "react"

export function MusicPlayerShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)

  const albums = [
    { title: "EJERCICIO DE REFLEXIÓN", image: "/meditation-book-cover-dark.jpg" },
    { title: "GREAT SPEECH", image: "/great-speech-book-orange.jpg" },
    { title: "INNER PEACE MEDITATION", image: "/inner-peace-meditation-blue.jpg" },
    { title: "RELAX YOUR MIND", image: "/relax-mind-book-red.jpg" },
    { title: "MEDITACIÓN PROFUNDA", image: "/deep-meditation-book-orange.jpg" },
  ]

  return (
    <div className="w-full bg-white py-12 md:py-20 px-4 flex justify-center">
      <div className="w-full max-w-6xl flex items-center justify-center gap-4 md:gap-8 overflow-hidden">
        {/* Left album covers - hidden on mobile */}
        <div className="hidden md:flex gap-4 opacity-70">
          {albums.slice(0, 2).map((album, i) => (
            <Card key={i} className="w-20 lg:w-24 h-28 lg:h-32 overflow-hidden border-none shadow-lg flex-shrink-0">
              <img src={album.image || "/placeholder.svg"} alt={album.title} className="w-full h-full object-cover" />
            </Card>
          ))}
        </div>

        {/* Phone mockup */}
        <div className="relative flex-shrink-0">
          {/* Phone frame */}
          <div className="w-[280px] md:w-[320px] h-[560px] md:h-[640px] bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10" />

            {/* Screen */}
            <div className="w-full h-full bg-gradient-to-b from-[#1a2942] to-[#0f1c2e] rounded-[2.5rem] overflow-hidden relative">
              {/* Status bar */}
              <div className="flex justify-between items-center px-6 pt-3 text-white text-xs">
                <span>15:32</span>
                <div className="flex gap-1 items-center">
                  <span>5G</span>
                  <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-white rounded" />
                    <div className="w-1 h-3 bg-white rounded" />
                    <div className="w-1 h-3 bg-white rounded" />
                    <div className="w-1 h-3 bg-white/50 rounded" />
                  </div>
                </div>
              </div>

              {/* Album art */}
              <div className="flex justify-center mt-12 mb-6">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-transparent" />
                  <div className="text-white text-center z-10">
                    <div className="text-2xl font-bold mb-1">INNER PEACE</div>
                    <div className="text-lg">MEDITATION</div>
                  </div>
                </div>
              </div>

              {/* Song info */}
              <div className="text-center text-white px-6 mb-8">
                <p className="text-xs opacity-70 mb-1">Compra el 3-meses Plan Estándar</p>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center gap-8 mb-8">
                <button className="text-white/80 hover:text-white transition-colors">
                  <SkipBack className="w-8 h-8" fill="currentColor" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-[#1a2942]" fill="currentColor" />
                  ) : (
                    <Play className="w-7 h-7 text-[#1a2942] ml-1" fill="currentColor" />
                  )}
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  <SkipForward className="w-8 h-8" fill="currentColor" />
                </button>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-32 h-32 rounded-full bg-blue-500/20 blur-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Right album covers - hidden on mobile */}
        <div className="hidden md:flex gap-4 opacity-70">
          {albums.slice(3, 5).map((album, i) => (
            <Card key={i} className="w-20 lg:w-24 h-28 lg:h-32 overflow-hidden border-none shadow-lg flex-shrink-0">
              <img src={album.image || "/placeholder.svg"} alt={album.title} className="w-full h-full object-cover" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
