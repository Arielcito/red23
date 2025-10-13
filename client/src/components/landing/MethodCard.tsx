import { Card } from "@/components/ui/card"
import { ThumbsUp } from "lucide-react"

export function MethodCard() {
  return (
    <div className="w-full bg-white py-12 md:py-20 px-4 flex justify-center">
      <Card className="w-full max-w-md md:max-w-2xl lg:max-w-4xl bg-[#0a1929] border-none shadow-2xl p-6 md:p-8 lg:p-10 relative overflow-hidden">
        {/* Decorative cards illustration */}
        <div className="absolute -right-4 -top-4 md:right-4 md:top-4 w-32 h-32 md:w-48 md:h-48 opacity-20 md:opacity-30">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Playing cards illustration */}
            <rect
              x="40"
              y="20"
              width="80"
              height="120"
              rx="8"
              fill="#5B9FD8"
              opacity="0.6"
              transform="rotate(15 80 80)"
            />
            <rect
              x="60"
              y="30"
              width="80"
              height="120"
              rx="8"
              fill="#7CB8E8"
              opacity="0.8"
              transform="rotate(-10 100 90)"
            />
            <circle cx="100" cy="80" r="25" fill="white" opacity="0.3" />
          </svg>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-6 md:mb-8 leading-tight text-balance relative z-10">
          Trabajos, relaciones, respeto... Esto es lo que consigues con{" "}
          <span className="text-blue-400">el Método Nexus</span>
        </h2>

        {/* Feature Box */}
        <div className="bg-[#1e3a5f] rounded-2xl p-6 md:p-8 relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <ThumbsUp className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white pt-2">Aumentas tu confianza</h3>
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
