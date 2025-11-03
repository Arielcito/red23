"use client"

import { useMemo } from "react"

export function MathBackgroundDecoration() {
  const mathElements = useMemo(() => [
    { text: "x² + y² = r²", position: "top-20 left-[5%]", delay: "delay-0", rotation: -2 },
    { text: "∫ f(x)dx", position: "top-40 left-[15%]", delay: "delay-100", rotation: 3 },
    { text: "lim(x→∞)", position: "top-60 left-[8%]", delay: "delay-200", rotation: -1 },
    { text: "π = 3.14159...", position: "top-32 right-[10%]", delay: "delay-300", rotation: 4 },
    { text: "e = 2.71828...", position: "top-52 right-[5%]", delay: "delay-100", rotation: -3 },
    { text: "Σ(n=1,∞)", position: "top-80 left-[20%]", delay: "delay-200", rotation: 2 },
    { text: "∂f/∂x", position: "bottom-40 right-[15%]", delay: "delay-0", rotation: -4 },
    { text: "α + β = γ", position: "bottom-60 left-[12%]", delay: "delay-300", rotation: 1 },
    { text: "√2 = 1.414...", position: "bottom-80 right-[8%]", delay: "delay-100", rotation: -2 },
    { text: "φ = (1+√5)/2", position: "top-[30%] left-[25%]", delay: "delay-200", rotation: 3 },
    { text: "∇f", position: "top-[50%] right-[25%]", delay: "delay-300", rotation: -1 },
    { text: "∞", position: "bottom-[30%] left-[30%]", delay: "delay-0", rotation: 2 },
    { text: "1234 × 567", position: "top-[25%] right-[20%]", delay: "delay-100", rotation: -3 },
    { text: "89 + 456", position: "bottom-[25%] right-[30%]", delay: "delay-200", rotation: 4 },
  ], [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {mathElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} ${element.delay} text-cyan-400/10 sm:text-cyan-400/15 text-xs sm:text-sm md:text-base font-mono animate-pulse`}
          style={{
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          {element.text}
        </div>
      ))}
    </div>
  )
}

