"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface LeadFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadFormModal({ open, onOpenChange }: LeadFormModalProps) {
  useEffect(() => {
    if (open) {
      const script = document.createElement("script")
      script.src = "https://link.msgsndr.com/js/form_embed.js"
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Completa tu información</DialogTitle>
          <DialogDescription>
            Por favor completa este formulario para acceder a las rutas de aprendizaje
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-[500px] px-6 pb-6">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/lE4yFpfNBBX12CV12Uvp"
            className="w-full h-full border-none rounded-md"
            id="inline-lE4yFpfNBBX12CV12Uvp"
            data-layout='{"id":"INLINE"}'
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
      </DialogContent>
    </Dialog>
  )
}

