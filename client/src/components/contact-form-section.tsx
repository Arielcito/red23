export function ContactFormSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Únete a <span className="text-cyan-400">Red23</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Completa el formulario y comienza a transformar tu estrategia de marketing hoy
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-lg overflow-hidden border border-cyan-500/20 bg-[#0f1f35]/50 backdrop-blur-sm p-4 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            <div className="relative" style={{ minHeight: "432px" }}>
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/lE4yFpfNBBX12CV12Uvp"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "432px",
                  border: "none",
                  borderRadius: "3px",
                }}
                id="inline-lE4yFpfNBBX12CV12Uvp"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Form 1: Red23"
                data-height="432"
                data-layout-iframe-id="inline-lE4yFpfNBBX12CV12Uvp"
                data-form-id="lE4yFpfNBBX12CV12Uvp"
                title="Form 1: Red23"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Load form embed script */}
      <script src="https://link.msgsndr.com/js/form_embed.js" async />
    </section>
  )
}
