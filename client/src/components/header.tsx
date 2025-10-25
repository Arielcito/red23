"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/80 backdrop-blur-sm border-b border-cyan-500/10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
              <Image src="/logo.png" alt="Red23 Logo" fill className="object-contain" priority />
            </div>
          </Link>

          <button
            className="md:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Inicio
            </Link>
            <Link href="#features" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
              Características
            </Link>
            <Link href="#referrals" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
              Referidos
            </Link>
          </nav>

          <Link href="/login">
            <Button className="hidden md:block bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6">
              Contáctanos
            </Button>
          </Link>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-cyan-500/10 pt-4">
            <Link
              href="#home"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#features"
              className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Características
            </Link>
            <Link
              href="#referrals"
              className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Referidos
            </Link>
            <Link href="/login" className="w-full">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6 w-full">Contáctanos</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
