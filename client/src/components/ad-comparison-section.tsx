import { Card } from "@/components/ui/card"
import { ThumbsDown, ThumbsUp, Eye } from "lucide-react"

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
  {
    title: "Sin CTA Claro",
    views: "203 vistas",
    engagement: "2 likes",
  },
]

const goodAd = {
  title: "Anuncio Optimizado con IA",
  views: "15,847 vistas",
  engagement: "1,234 likes",
}

export function AdComparisonSection() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 relative bg-[#0a1628] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent opacity-50" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance px-4">
            Deja de perder tiempo y dinero con <span className="text-red-400">anuncios de mala calidad</span>
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto min-h-[400px] sm:h-[600px] flex items-center justify-center">
          {/* Bad Ads - Positioned around the center with overlay effect */}
          {badAds.map((ad, index) => {
            const positions = [
              { top: "10%", left: "15%", rotate: "-5deg" },
              { top: "15%", right: "10%", rotate: "8deg" },
              { bottom: "20%", left: "8%", rotate: "3deg" },
              { bottom: "15%", right: "15%", rotate: "-7deg" },
              { top: "45%", left: "5%", rotate: "-10deg" },
              { top: "50%", right: "5%", rotate: "5deg" },
            ]

            return (
              <Card
                key={index}
                className={`absolute bg-[#0f1f3a]/40 border-red-500/20 p-3 sm:p-4 w-48 sm:w-64 backdrop-blur-sm ${
                  index > 3 ? "hidden sm:block" : ""
                }`}
                style={{
                  ...positions[index],
                  transform: `rotate(${positions[index].rotate})`,
                  opacity: 0.4,
                  filter: "blur(1px)",
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                  <ThumbsDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-400/70" />
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
            )
          })}

          <div className="relative z-20">
            {/* Glow effect behind the card */}
            <div className="absolute inset-0 bg-cyan-500/30 blur-3xl scale-150" />

            <Card className="relative bg-[#0f1f3a]/90 border-cyan-500/60 p-4 sm:p-6 md:p-8 w-72 sm:w-80 shadow-2xl shadow-cyan-500/40 backdrop-blur-md">
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
        </div>
      </div>
    </section>
  )
}
