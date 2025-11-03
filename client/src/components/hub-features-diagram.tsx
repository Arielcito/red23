"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Newspaper, BookOpen, Users } from "lucide-react";

type Props = {
  logoUrl: string;
  centerLabel?: string;
  className?: string;
};

export default function HubFeaturesDiagram({
  logoUrl,
  centerLabel = "RED23",
  className = "",
}: Props) {
  const [showLogoTooltip, setShowLogoTooltip] = useState(false);
  const [showAiTooltip, setShowAiTooltip] = useState(false);
  const [showAwardsTooltip, setShowAwardsTooltip] = useState(false);
  const [showNewsTooltip, setShowNewsTooltip] = useState(false);
  const [showTutorialsTooltip, setShowTutorialsTooltip] = useState(false);
  const [showReferralsTooltip, setShowReferralsTooltip] = useState(false);

  return (
    <div className={`relative w-full max-w-6xl mx-auto text-white ${className}`}>
      <style jsx>{`
        @keyframes electricFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes electricFlowVertical {
          0% {
            background-position: 50% 0%;
          }
          100% {
            background-position: 50% 200%;
          }
        }

        .electric-line-horizontal {
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 30%,
            rgba(70, 192, 250, 0.8) 50%,
            rgba(55, 171, 239, 1) 55%,
            rgba(70, 192, 250, 0.8) 60%,
            transparent 70%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: electricFlow 2s linear infinite;
        }

        .electric-line-vertical {
          background: linear-gradient(
            180deg,
            transparent 0%,
            transparent 30%,
            rgba(70, 192, 250, 0.8) 50%,
            rgba(55, 171, 239, 1) 55%,
            rgba(70, 192, 250, 0.8) 60%,
            transparent 70%,
            transparent 100%
          );
          background-size: 100% 200%;
          animation: electricFlowVertical 2s linear infinite;
        }
      `}</style>
      <div className="relative px-6 pt-10 pb-12 flex items-center justify-center min-h-[400px] md:min-h-[550px]">
        <div className="relative w-full max-w-3xl">
          {/* Líneas de conexión */}
          {/* Línea horizontal izquierda (Premios - Logo) */}
          <div className="electric-line-horizontal absolute top-[56px] md:top-[88px] left-[calc(50%-140px)] md:left-[calc(50%-200px)] w-[80px] md:w-[150px] h-[2px] shadow-[0_0_10px_rgba(55,171,239,0.5)]" />
          {/* Línea horizontal derecha (Logo - IA) */}
          <div className="electric-line-horizontal absolute top-[56px] md:top-[88px] right-[calc(50%-140px)] md:right-[calc(50%-200px)] w-[80px] md:w-[150px] h-[2px] shadow-[0_0_10px_rgba(55,171,239,0.5)]" />
          {/* Línea vertical hacia abajo desde Logo */}
          <div className="electric-line-vertical absolute left-1/2 -translate-x-1/2 top-[120px] md:top-[192px] w-[2px] h-[70px] md:h-[100px] shadow-[0_0_10px_rgba(55,171,239,0.5)]" />
          {/* Línea horizontal inferior izquierda (Centro - Noticias) */}
          <div className="electric-line-horizontal absolute top-[225px] md:top-[348px] left-[calc(50%-60px)] md:left-[calc(50%-85px)] w-[50px] md:w-[75px] h-[2px] shadow-[0_0_10px_rgba(55,171,239,0.5)]" />
          {/* Línea vertical inferior centro (Centro - Tutoriales) */}
          <div className="electric-line-vertical absolute top-[190px] md:top-[292px] left-1/2 -translate-x-1/2 w-[2px] h-[35px] md:h-[56px] shadow-[0_0_10px_rgba(55,171,239,0.5)]" />
          {/* Línea horizontal inferior derecha (Centro - Referidos) */}
          <div className="electric-line-horizontal absolute top-[225px] md:top-[348px] right-[calc(50%-60px)] md:right-[calc(50%-85px)] w-[50px] md:w-[75px] h-[2px] shadow-[0_0_10px_rgba(55,171,239,0.5)]" />

          {/* Fila superior: Premios - Logo - IA */}
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {/* Icono de Premios */}
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                onMouseEnter={() => setShowAwardsTooltip(true)}
                onMouseLeave={() => setShowAwardsTooltip(false)}
                className="relative cursor-pointer"
              >
                <div className="relative p-3 md:p-4 rounded-2xl bg-[#0a1628]/50 backdrop-blur-sm">
                  <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                    <Trophy className="w-7 h-7 md:w-12 md:h-12 text-[#46c0fa]" />
                  </div>
                  <span className="absolute inset-0 rounded-2xl blur-2xl opacity-30 bg-[#46c0fa]/30 pointer-events-none" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showAwardsTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 px-4 py-2 bg-[#0d1a2d]/95 backdrop-blur-sm rounded-lg shadow-[0_0_20px_rgba(10,108,206,0.3)] whitespace-nowrap z-10"
                  >
                    <div className="text-sm text-gray-200 font-medium">
                      Premios Diarios y Mensuales
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logo RED23 */}
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                onMouseEnter={() => setShowLogoTooltip(true)}
                onMouseLeave={() => setShowLogoTooltip(false)}
                className="relative cursor-pointer"
              >
                <div className="relative p-3 md:p-4 rounded-2xl bg-[#0a1628]/50 backdrop-blur-sm">
                  <img
                    src={logoUrl}
                    alt="RED23 Logo"
                    className="w-24 h-24 md:w-48 md:h-48 rounded-2xl object-contain shadow-[0_0_30px_rgba(55,171,239,0.4)]"
                  />
                  <span className="absolute inset-0 rounded-2xl opacity-30 bg-[#46c0fa]/30 pointer-events-none" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showLogoTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 px-4 py-2 bg-[#0d1a2d]/95 backdrop-blur-sm rounded-lg shadow-[0_0_20px_rgba(10,108,206,0.3)] whitespace-nowrap z-10"
                  >
                    <div className="text-sm text-gray-200 font-medium">
                      {centerLabel}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icono de IA */}
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                onMouseEnter={() => setShowAiTooltip(true)}
                onMouseLeave={() => setShowAiTooltip(false)}
                className="relative cursor-pointer"
              >
                <div className="relative p-3 md:p-4 rounded-2xl bg-[#0a1628]/50 backdrop-blur-sm">
                  <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 md:w-12 md:h-12 text-[#37abef]" />
                  </div>
                  <span className="absolute inset-0 rounded-2xl blur-2xl opacity-30 bg-[#37abef]/30 pointer-events-none" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showAiTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 px-4 py-2 bg-[#0d1a2d]/95 backdrop-blur-sm rounded-lg shadow-[0_0_20px_rgba(10,108,206,0.3)] whitespace-nowrap z-10"
                  >
                    <div className="text-sm text-gray-200 font-medium">
                      Generación de Imágenes con IA
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fila inferior: Noticias - Tutoriales - Referidos */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mt-20 md:mt-36">
            {/* Icono de Noticias */}
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                onMouseEnter={() => setShowNewsTooltip(true)}
                onMouseLeave={() => setShowNewsTooltip(false)}
                className="relative cursor-pointer"
              >
                <div className="relative p-3 md:p-4 rounded-2xl bg-[#0a1628]/50 backdrop-blur-sm">
                  <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                    <Newspaper className="w-7 h-7 md:w-12 md:h-12 text-[#0a6cce]" />
                  </div>
                  <span className="absolute inset-0 rounded-2xl blur-2xl opacity-30 bg-[#0a6cce]/30 pointer-events-none" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showNewsTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 px-4 py-2 bg-[#0d1a2d]/95 backdrop-blur-sm rounded-lg shadow-[0_0_20px_rgba(10,108,206,0.3)] whitespace-nowrap z-10"
                  >
                    <div className="text-sm text-gray-200 font-medium">
                      Portal de Noticias
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icono de Tutoriales */}
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                onMouseEnter={() => setShowTutorialsTooltip(true)}
                onMouseLeave={() => setShowTutorialsTooltip(false)}
                className="relative cursor-pointer"
              >
                <div className="relative p-3 md:p-4 rounded-2xl bg-[#0a1628]/50 backdrop-blur-sm">
                  <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 md:w-12 md:h-12 text-[#37abef]" />
                  </div>
                  <span className="absolute inset-0 rounded-2xl blur-2xl opacity-30 bg-[#37abef]/30 pointer-events-none" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showTutorialsTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 px-4 py-2 bg-[#0d1a2d]/95 backdrop-blur-sm rounded-lg shadow-[0_0_20px_rgba(10,108,206,0.3)] whitespace-nowrap z-10"
                  >
                    <div className="text-sm text-gray-200 font-medium">
                      Tutoriales
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icono de Referidos */}
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                onMouseEnter={() => setShowReferralsTooltip(true)}
                onMouseLeave={() => setShowReferralsTooltip(false)}
                className="relative cursor-pointer"
              >
                <div className="relative p-3 md:p-4 rounded-2xl bg-[#0a1628]/50 backdrop-blur-sm">
                  <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                    <Users className="w-7 h-7 md:w-12 md:h-12 text-[#46c0fa]" />
                  </div>
                  <span className="absolute inset-0 rounded-2xl blur-2xl opacity-30 bg-[#46c0fa]/30 pointer-events-none" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showReferralsTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 px-4 py-2 bg-[#0d1a2d]/95 backdrop-blur-sm rounded-lg shadow-[0_0_20px_rgba(10,108,206,0.3)] whitespace-nowrap z-10"
                  >
                    <div className="text-sm text-gray-200 font-medium">
                      Referidos
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
