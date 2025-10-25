"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Newspaper,
  BookOpen,
  Users,
} from "lucide-react";

type Feature = {
  id: string;
  title: string;
  subtitle?: string;
  onClick?: (id: string) => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
};

type Props = {
  logoUrl: string;
  centerLabel?: string;
  features?: Feature[];
  onFeatureClick?: (id: string) => void;
  className?: string;
};

const defaultFeatures: Feature[] = [
  {
    id: "ai-images",
    title: "Generación de Imágenes con IA",
    subtitle: "Crea imágenes personalizadas",
    icon: <Sparkles className="w-5 h-5 text-[#37abef]" />,
  },
  {
    id: "awards",
    title: "Premios Diarios y Mensuales",
    subtitle: "Recompensas automáticas",
    icon: <Trophy className="w-5 h-5 text-[#46c0fa]" />,
  },
  {
    id: "news",
    title: "Portal de Noticias",
    subtitle: "Novedades y lanzamientos",
    icon: <Newspaper className="w-5 h-5 text-[#0a6cce]" />,
  },
  {
    id: "tutorials",
    title: "Tutoriales",
    subtitle: "Aprendé paso a paso",
    icon: <BookOpen className="w-5 h-5 text-[#37abef]" />,
  },
  {
    id: "referrals",
    title: "Referidos",
    subtitle: "Cada 12 referidos gana $1.000.000",
    icon: <Users className="w-5 h-5 text-[#46c0fa]" />,
  },
];

function Card({
  feature,
  onClick,
}: {
  feature: Feature;
  onClick?: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={() => (onClick ? onClick(feature.id) : feature.onClick?.(feature.id))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={feature.ariaLabel ?? feature.title}
      className="group w-full h-full rounded-2xl bg-[#0d1a2d] text-left p-4 shadow-[0_0_0_1px_rgba(10,108,206,0.3)] hover:shadow-[0_0_0_2px_rgba(70,192,250,0.6)] focus:outline-none focus:shadow-[0_0_0_2px_rgba(70,192,250,0.9)] transition-shadow duration-300"
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="grid place-items-center w-10 h-10 rounded-xl bg-[#0a1628] shadow-[0_0_14px_rgba(10,108,206,0.3)]"
          animate={{
            boxShadow: isHovered
              ? "0 0 20px rgba(70,192,250,0.5)"
              : "0 0 14px rgba(10,108,206,0.3)",
          }}
          transition={{ duration: 0.3 }}
        >
          {feature.icon ?? <span className="text-sm opacity-80">★</span>}
        </motion.div>
        <div>
          <div className="text-sm font-semibold text-white leading-tight">
            {feature.title}
          </div>
          {feature.subtitle && (
            <div className="text-xs text-gray-400 leading-tight mt-0.5">
              {feature.subtitle}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/**
 * Layout (desktop):
 *
 *          [  HUB  ]
 *     [F1]         [F2]
 *
 *   [F3]    [F4]    [F5]
 *
 * Conexiones rectas desde el HUB a cada feature.
 * En mobile, se apila vertical y las líneas se simplifican.
 */
export default function HubFeaturesDiagram({
  logoUrl,
  centerLabel = "TuMarca — Ecosistema",
  features = defaultFeatures,
  onFeatureClick,
  className = "",
}: Props) {
  const [f1, f2, f3, f4, f5] = [
    features[0] ?? defaultFeatures[0],
    features[1] ?? defaultFeatures[1],
    features[2] ?? defaultFeatures[2],
    features[3] ?? defaultFeatures[3],
    features[4] ?? defaultFeatures[4],
  ];

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto text-white ${className}`}
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -20%, rgba(10,108,206,0.12), transparent 60%), #0a1628",
      }}
    >
      <div className="relative px-6 pt-10 pb-12">
        {/* SVG de conexiones (solo en >= md) */}
        <svg
          className="absolute inset-0 w-full h-full hidden md:block pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0a6cce" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#46c0fa" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#37abef" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#46c0fa" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Líneas de conexión con ángulos de 90 grados */}
          {/* Línea a F1 (izquierda arriba) */}
          <path
            d="M 50% 16% L 50% 24% L 18% 24% L 18% 32%"
            stroke="url(#grad-left)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            opacity="0.7"
          />
          {/* Línea a F2 (derecha arriba) */}
          <path
            d="M 50% 16% L 50% 24% L 82% 24% L 82% 32%"
            stroke="url(#grad-right)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            opacity="0.7"
          />
          {/* Línea a F3 (izquierda abajo) */}
          <path
            d="M 50% 16% L 50% 50% L 24% 50% L 24% 84%"
            stroke="url(#grad-left)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            opacity="0.7"
          />
          {/* Línea a F4 (centro abajo) */}
          <path
            d="M 50% 16% L 50% 84%"
            stroke="#37abef"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            opacity="0.7"
          />
          {/* Línea a F5 (derecha abajo) */}
          <path
            d="M 50% 16% L 50% 50% L 76% 50% L 76% 84%"
            stroke="url(#grad-right)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            opacity="0.7"
          />
        </svg>

        {/* GRID de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
          {/* HUB (arriba al centro) */}
          <div className="md:col-start-3 md:col-end-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="rounded-2xl bg-[#0d1a2d] border border-[#0a6cce]/30 shadow-[0_0_40px_rgba(10,108,206,0.25)]"
            >
              <div className="flex flex-col items-center gap-3 px-5 py-6">
                <div className="relative">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-16 h-16 rounded-2xl object-contain ring-2 ring-[#37abef]/50 shadow-[0_0_30px_rgba(55,171,239,0.4)]"
                  />
                  <span className="absolute inset-0 rounded-2xl blur-2xl opacity-30 bg-[#46c0fa]/30" />
                </div>
                <div className="text-sm text-gray-200 font-medium">{centerLabel}</div>
              </div>
            </motion.div>
          </div>

          {/* Fila 1: F1 izquierda, F2 derecha */}
          <div className="hidden md:block md:col-start-1 md:col-end-3 md:row-start-2">
            <Card feature={f1} onClick={onFeatureClick} />
          </div>
          <div className="hidden md:block md:col-start-6 md:col-end-8 md:row-start-2">
            <Card feature={f2} onClick={onFeatureClick} />
          </div>

          {/* Fila 2: F3, F4, F5 distribuidos */}
          <div className="hidden md:block md:col-start-2 md:col-end-4 md:row-start-4">
            <Card feature={f3} onClick={onFeatureClick} />
          </div>
          <div className="hidden md:block md:col-start-4 md:col-end-5 md:row-start-4">
            <Card feature={f4} onClick={onFeatureClick} />
          </div>
          <div className="hidden md:block md:col-start-5 md:col-end-7 md:row-start-4">
            <Card feature={f5} onClick={onFeatureClick} />
          </div>

          {/* Mobile layout (stacked) */}
          <div className="md:hidden space-y-4 mt-4">
            <Card feature={f1} onClick={onFeatureClick} />
            <Card feature={f2} onClick={onFeatureClick} />
            <Card feature={f3} onClick={onFeatureClick} />
            <Card feature={f4} onClick={onFeatureClick} />
            <Card feature={f5} onClick={onFeatureClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
