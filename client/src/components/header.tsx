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

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login?tab=demo">
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-full px-6">
                Solicitar Demo
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6">
                Contáctanos
              </Button>
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-cyan-500/10 pt-4">
            <Link href="/login?tab=demo" className="w-full" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-full px-6 w-full">
                Solicitar Demo
              </Button>
            </Link>
            <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6 w-full">
                Contáctanos
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
