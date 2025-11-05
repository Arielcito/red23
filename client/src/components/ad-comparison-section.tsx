import { Card } from "@/components/ui/card"
import { ThumbsDown, ThumbsUp, Eye } from "lucide-react"
import { MathBackgroundDecoration } from "@/components/math-background-decoration"

const badAds = [
  {
    title: "Anuncio Genérico",
    views: "234 vistas",
    engagement: "2 likes",
  },
  {
    title: "Anuncio Sin Estrategia",
    views: "189 vistas",
    engagement: "1 like",
  },
  {
    title: "Diseño Pobre",
    views: "156 vistas",
    engagement: "0 likes",
  },
  {
    title: "Sin Targeting",
    views: "298 vistas",
    engagement: "3 likes",
  },
  {
    title: "Mensaje Confuso",
    views: "167 vistas",
    engagement: "1 like",
  },
]

const goodAd = {
  title: "Anuncio Optimizado con IA",
  views: "15,847 vistas",
  engagement: "1,234 likes",
}

export function AdComparisonSection() {
  return (
    <section className="py-6 sm:py-20 px-2 sm:px-4 md:px-6 relative bg-[#0a1628] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent opacity-50" />

      <MathBackgroundDecoration />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 px-2 sm:px-3 md:px-4">
            <div className="block">Deja de perder</div>
            <div className="block">tiempo y dinero con</div>
            <div className="block">
              <span className="text-cyan-400 whitespace-nowrap">anuncios de mala calidad</span>
            </div>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Grid Layout: 3 columns on desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Bad Ads (2 rows) */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
              {badAds.slice(0, 2).map((ad, index) => (
                <Card
                  key={index}
                  className="bg-[#0f1f3a]/40 border-cyan-500/20 p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <ThumbsDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400/70" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold mb-2 text-gray-400">{ad.title}</h3>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      {ad.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                      {ad.engagement}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Center Column - Good Ad (Highlighted) + 1 Bad Ad Below */}
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              <div className="relative flex items-center justify-center">
                {/* Glow effect behind the card */}
                <div className="absolute inset-0 bg-cyan-500/30 blur-3xl scale-150 animate-pulse" />

                <Card className="relative bg-[#0f1f3a]/90 border-cyan-500/60 p-4 sm:p-6 md:p-8 w-full shadow-2xl shadow-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:scale-105">
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    CON NUESTRO SISTEMA
                  </div>

                  <div className="aspect-video bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mb-3 sm:mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <ThumbsUp className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{goodAd.title}</h3>

                  <div className="flex items-center gap-4 sm:gap-6 text-sm">
                    <span className="flex items-center gap-2 font-bold text-cyan-400">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                      {goodAd.views}
                    </span>
                    <span className="flex items-center gap-2 font-bold text-cyan-400">
                      <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />
                      {goodAd.engagement}
                    </span>
                  </div>
                </Card>
              </div>

              {/* Bad Ad Below Good One - Hidden on mobile */}
              <Card className="hidden lg:block bg-[#0f1f3a]/40 border-cyan-500/20 p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <div className="aspect-video bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                  <ThumbsDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400/70" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold mb-2 text-gray-400">{badAds[2].title}</h3>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    {badAds[2].views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    {badAds[2].engagement}
                  </span>
                </div>
              </Card>
            </div>

            {/* Right Column - Bad Ads (2 rows) */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
              {badAds.slice(3, 5).map((ad, index) => (
                <Card
                  key={index}
                  className="bg-[#0f1f3a]/40 border-cyan-500/20 p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <ThumbsDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400/70" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold mb-2 text-gray-400">{ad.title}</h3>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      {ad.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                      {ad.engagement}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
