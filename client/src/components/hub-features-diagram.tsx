"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Newspaper,
  BookOpen,
  Users,
} from "lucide-react";
import Image from "next/image";

type Feature = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  angle?: number;
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
    title: "GENERACIÓN DE IMÁGENES CON IA",
    subtitle: "Crea imágenes personalizadas",
    description: "Usa modelos de IA para generar visuales a medida.",
    angle: 350,
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    id: "awards",
    title: "PREMIOS DIARIOS Y MENSUALES",
    subtitle: "Recompensas automáticas",
    description: "Participá por premios cada día y cada mes.",
    angle: 30,
    icon: <Trophy className="w-8 h-8" />,
  },
  {
    id: "news",
    title: "PORTAL DE NOTICIAS",
    subtitle: "Novedades y lanzamientos",
    description: "Accedé a noticias y anuncios de la plataforma.",
    angle: 110,
    icon: <Newspaper className="w-8 h-8" />,
  },
  {
    id: "tutorials",
    title: "TUTORIALES",
    subtitle: "Aprendé paso a paso",
    description: "Guías y videos para dominar cada feature.",
    angle: 230,
    icon: <BookOpen className="w-8 h-8" />,
  },
  {
    id: "referrals",
    title: "REFERIDOS",
    subtitle: "Cada 12 referidos gana $1.000.000",
    description: "Invitá amigos y accedé a grandes premios.",
    angle: 290,
    icon: <Users className="w-8 h-8" />,
  },
];

export default function HubFeaturesDiagram({
  logoUrl,
  centerLabel,
  features = defaultFeatures,
  onFeatureClick,
  className = "",
}: Props) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [focusedFeature, setFocusedFeature] = useState<string | null>(null);

  const activeFeature = hoveredFeature || focusedFeature;

  const viewBoxSize = 800;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const hubRadius = 90;
  const orbitRadius = 280;
  const nodeRadius = 36;

  const getFeaturePosition = (angle: number) => {
    const radian = ((angle - 90) * Math.PI) / 180;
    return {
      x: centerX + orbitRadius * Math.cos(radian),
      y: centerY + orbitRadius * Math.sin(radian),
    };
  };

  const handleFeatureClick = (id: string) => {
    onFeatureClick?.(id);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Desktop & Tablet: Radial SVG */}
      <div className="hidden md:block">
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-auto"
          role="img"
          aria-label="Hub de características con 5 funcionalidades conectadas"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-strong">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="logoClip">
              <circle cx={centerX} cy={centerY} r={hubRadius - 10} />
            </clipPath>
          </defs>

          {/* Connection lines */}
          {features.map((feature) => {
            const pos = getFeaturePosition(feature.angle || 0);
            const isActive = activeFeature === feature.id;
            return (
              <motion.line
                key={`line-${feature.id}`}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={isActive ? "#8b5cf6" : "#374151"}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={isActive ? 0.9 : 0.4}
                filter={isActive ? "url(#glow)" : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isActive ? 0.9 : 0.4 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            );
          })}

          {/* Central hub */}
          <g>
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={hubRadius}
              fill="#1f2937"
              stroke="#8b5cf6"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={hubRadius}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1"
              opacity="0.3"
              animate={{
                r: [hubRadius, hubRadius + 10, hubRadius],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Logo */}
            <image
              href={logoUrl}
              x={centerX - hubRadius + 10}
              y={centerY - hubRadius + 10}
              width={(hubRadius - 10) * 2}
              height={(hubRadius - 10) * 2}
              clipPath="url(#logoClip)"
              preserveAspectRatio="xMidYMid slice"
            />

            {centerLabel && (
              <text
                x={centerX}
                y={centerY + hubRadius + 25}
                textAnchor="middle"
                fill="#e5e7eb"
                fontSize="14"
                fontWeight="600"
              >
                {centerLabel}
              </text>
            )}
          </g>

          {/* Feature nodes */}
          {features.map((feature, index) => {
            const pos = getFeaturePosition(feature.angle || 0);
            const isActive = activeFeature === feature.id;

            return (
              <g key={feature.id}>
                {/* Node circle */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill="#111827"
                  stroke={isActive ? "#8b5cf6" : "#4b5563"}
                  strokeWidth="2"
                  filter={isActive ? "url(#glow-strong)" : "url(#glow)"}
                  className="cursor-pointer"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isActive ? 1.15 : 1, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onFocus={() => setFocusedFeature(feature.id)}
                  onBlur={() => setFocusedFeature(null)}
                  onClick={() => handleFeatureClick(feature.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${feature.title}: ${feature.description || feature.subtitle}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleFeatureClick(feature.id);
                    }
                  }}
                />

                {/* Icon */}
                <foreignObject
                  x={pos.x - 16}
                  y={pos.y - 16}
                  width="32"
                  height="32"
                  pointerEvents="none"
                >
                  <div className="flex items-center justify-center w-full h-full text-violet-300">
                    {feature.icon || (
                      <div className="w-4 h-4 rounded-full bg-violet-400" />
                    )}
                  </div>
                </foreignObject>

                {/* Title */}
                <text
                  x={pos.x}
                  y={pos.y + nodeRadius + 20}
                  textAnchor="middle"
                  fill="#f3f4f6"
                  fontSize="12"
                  fontWeight="700"
                  className="pointer-events-none select-none"
                  style={{ maxWidth: "120px" }}
                >
                  <tspan x={pos.x} dy="0">
                    {feature.title.split(" ").slice(0, 2).join(" ")}
                  </tspan>
                  {feature.title.split(" ").length > 2 && (
                    <tspan x={pos.x} dy="14">
                      {feature.title.split(" ").slice(2).join(" ")}
                    </tspan>
                  )}
                </text>

                {/* Subtitle */}
                {feature.subtitle && (
                  <text
                    x={pos.x}
                    y={pos.y + nodeRadius + 50}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="10"
                    className="pointer-events-none select-none"
                  >
                    {feature.subtitle}
                  </text>
                )}

                {/* Tooltip on hover/focus */}
                <AnimatePresence>
                  {isActive && feature.description && (
                    <motion.g
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <rect
                        x={pos.x - 100}
                        y={pos.y - nodeRadius - 60}
                        width="200"
                        height="50"
                        rx="8"
                        fill="#1f2937"
                        stroke="#8b5cf6"
                        strokeWidth="1"
                        filter="url(#glow)"
                      />
                      <foreignObject
                        x={pos.x - 90}
                        y={pos.y - nodeRadius - 50}
                        width="180"
                        height="40"
                        pointerEvents="none"
                      >
                        <div className="text-xs text-gray-200 text-center px-2">
                          {feature.description}
                        </div>
                      </foreignObject>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: Vertical Layout */}
      <div className="md:hidden space-y-6">
        {/* Central Hub */}
        <motion.div
          className="flex flex-col items-center justify-center p-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative w-32 h-32 rounded-full border-2 border-violet-500 overflow-hidden bg-gray-800 shadow-lg shadow-violet-500/50">
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
          </div>
          {centerLabel && (
            <p className="mt-4 text-sm font-semibold text-gray-200">
              {centerLabel}
            </p>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 px-4">
          {features.map((feature, index) => {
            const isActive = activeFeature === feature.id;
            return (
              <motion.button
                key={feature.id}
                className="relative p-4 rounded-xl bg-gray-900 border border-gray-700 hover:border-violet-500 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                onFocus={() => setFocusedFeature(feature.id)}
                onBlur={() => setFocusedFeature(null)}
                onClick={() => handleFeatureClick(feature.id)}
                aria-label={`${feature.title}: ${feature.description || feature.subtitle}`}
              >
                {/* Decorative connector */}
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-violet-500 to-transparent rounded-r"
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                    scaleY: isActive ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-800 border border-violet-500/30 flex items-center justify-center text-violet-300"
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      borderColor: isActive
                        ? "rgb(139 92 246)"
                        : "rgb(139 92 246 / 0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon || (
                      <div className="w-4 h-4 rounded-full bg-violet-400" />
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-bold text-gray-100">
                      {feature.title}
                    </h3>
                    {feature.subtitle && (
                      <p className="mt-1 text-xs text-gray-400">
                        {feature.subtitle}
                      </p>
                    )}
                    {feature.description && isActive && (
                      <motion.p
                        className="mt-2 text-xs text-gray-300"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
