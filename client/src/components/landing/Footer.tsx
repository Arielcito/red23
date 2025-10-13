export function Footer() {
  return (
    <footer className="w-full bg-[#0a1929] border-t border-gray-800 py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 text-gray-300 text-sm md:text-base">
          <a href="#" className="hover:text-blue-400 transition-colors">
            Términos y condiciones
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            Aviso Legal
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            Políticas de privacidad
          </a>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-700 mb-6" />

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">INSTITUTO DE COMUNICACIÓN © 2025</div>
      </div>
    </footer>
  )
}
