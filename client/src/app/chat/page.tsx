"use client"

import { useState } from "react"
import { useChat } from "@/lib/hooks/useChat"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { LoadingIndicator } from "@/components/chat/LoadingIndicator"
import { ChatInput } from "@/components/chat/ChatInput"
// Temporalmente deshabilitado
// import { ImageScheduler, type ScheduleData } from "@/components/schedule/ImageScheduler"
// import { useScheduledImages } from "@/lib/hooks/useScheduledImages"
import { AppLayout } from "@/components/layout/AppLayout"
import { useUser } from "@/lib/hooks/useUser"
import { useAdminPrompts } from "@/lib/hooks/useAdminPrompts"

export default function ChatPage() {
  const {
    messages,
    isGenerating,
    inputValue,
    setInputValue,
    sendMessage,
    setQuickPrompt,
    error,
  } = useChat()

  const [logoUrl, setLogoUrl] = useState("")
  const [logoPosition, setLogoPosition] = useState("")
  const { user } = useUser()
  const { prompts, isLoading: isLoadingPrompts } = useAdminPrompts()
  
  console.log('📋 Loaded prompts for chat:', prompts.length)
  
  // Filter active prompts and map to content array
  const quickPrompts = prompts
    .filter(prompt => prompt.is_active)
    .sort((a, b) => b.order_index - a.order_index)
    .map(prompt => prompt.content)
  
  // Temporalmente deshabilitado
  // const [schedulerOpen, setSchedulerOpen] = useState(false)
  // const [selectedImageForSchedule, setSelectedImageForSchedule] = useState<{ url: string; title: string } | null>(null)
  // const { scheduleImage } = useScheduledImages()

  const handleSendMessage = async () => {
    const hasPrompt = inputValue.trim()
    const hasLogoUrl = logoUrl.trim()
    const hasLogoPosition = Boolean(logoPosition)

    if (!hasPrompt || isGenerating) return
    if ((hasLogoUrl && !hasLogoPosition) || (!hasLogoUrl && hasLogoPosition)) return

    const promptSections = [inputValue.trim()]

    if (hasLogoUrl && hasLogoPosition) {
      promptSections.push(`URL del logo: ${logoUrl.trim()}`)
      promptSections.push(`Posición del logo (1-9): ${logoPosition}`)
    }

    await sendMessage(promptSections.join("\n"), {
      logoUrl: hasLogoUrl ? logoUrl.trim() : undefined,
      logoPosition: hasLogoPosition ? Number(logoPosition) : undefined,
      userEmail: user?.email
    })
    setInputValue("")
    setLogoUrl("")
    setLogoPosition("")
  }

  const handleQuickPrompt = (prompt: string) => {
    setQuickPrompt(prompt)
  }

  // Temporalmente deshabilitado
  // const handleScheduleImage = (imageUrl: string, title: string) => {
  //   setSelectedImageForSchedule({ url: imageUrl, title })
  //   setSchedulerOpen(true)
  // }

  // const handleScheduleConfirm = (scheduleData: ScheduleData) => {
  //   try {
  //     scheduleImage(
  //       scheduleData.imageUrl || "",
  //       scheduleData.imageTitle || "",
  //       scheduleData.date,
  //       scheduleData.time,
  //       scheduleData.caption
  //     )
  //     alert("¡Imagen programada exitosamente para WhatsApp!")
  //   } catch {
  //     alert("Error al programar la imagen")
  //   }
  // }

  return (
    <AppLayout
      title="Marketing Casino IA"
      subtitle="Genera imágenes promocionales para casinos"
      showBackButton={true}
      backHref="/dashboard"
      badge={{
        text: "IA Activa",
        variant: "outline",
        className: "text-primary-600 border-primary-200 bg-primary-50 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800"
      }}
      hideHeader={false}
    >
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-full">
        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 w-full">
          <div className="flex-1 overflow-y-auto overflow-x-visible p-3 sm:p-4 space-y-3 sm:space-y-4 w-full">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  <strong>Error de conexión:</strong> {error}
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} /* onSchedule={handleScheduleImage} */ />
            ))}

            {isGenerating && <LoadingIndicator />}
          </div>

          <div className="flex-shrink-0">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isGenerating={isGenerating || isLoadingPrompts}
              quickPrompts={quickPrompts}
              onQuickPrompt={handleQuickPrompt}
              logoUrl={logoUrl}
              onLogoUrlChange={setLogoUrl}
              logoPosition={logoPosition}
              onLogoPositionChange={setLogoPosition}
            />
          </div>
        </div>
      </div>
      
      {/* Temporalmente oculto
      <ImageScheduler
        isOpen={schedulerOpen}
        onOpenChange={setSchedulerOpen}
        imageUrl={selectedImageForSchedule?.url}
        imageTitle={selectedImageForSchedule?.title}
        onSchedule={handleScheduleConfirm}
      />
      */}
    </AppLayout>
  )
}
