"use client"

import { useState } from "react"
import { useChat } from "@/lib/hooks/useChat"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { LoadingIndicator } from "@/components/chat/LoadingIndicator"
import { ChatInput } from "@/components/chat/ChatInput"
import { ImageScheduler, type ScheduleData } from "@/components/schedule/ImageScheduler"
import { useScheduledImages } from "@/lib/hooks/useScheduledImages"
import { AppLayout } from "@/components/layout/AppLayout"

export default function ChatPage() {
  const {
    messages,
    isGenerating,
    inputValue,
    setInputValue,
    mockImagePrompts,
    sendMessage,
    setQuickPrompt,
    error,
  } = useChat()
  
  const [schedulerOpen, setSchedulerOpen] = useState(false)
  const [selectedImageForSchedule, setSelectedImageForSchedule] = useState<{ url: string; title: string } | null>(null)
  
  const { scheduleImage } = useScheduledImages()

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return
    await sendMessage(inputValue)
    setInputValue("")
  }

  const handleQuickPrompt = (prompt: string) => {
    setQuickPrompt(prompt)
  }

  const handleScheduleImage = (imageUrl: string, title: string) => {
    setSelectedImageForSchedule({ url: imageUrl, title })
    setSchedulerOpen(true)
  }

  const handleScheduleConfirm = (scheduleData: ScheduleData) => {
    try {
      scheduleImage(
        scheduleData.imageUrl || "",
        scheduleData.imageTitle || "",
        scheduleData.date,
        scheduleData.time,
        scheduleData.caption
      )
      alert("¡Imagen programada exitosamente para WhatsApp!")
    } catch {
      alert("Error al programar la imagen")
    }
  }

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
              <ChatMessage key={message.id} message={message} onSchedule={handleScheduleImage} />
            ))}

            {isGenerating && <LoadingIndicator />}
          </div>

          <div className="flex-shrink-0">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isGenerating={isGenerating}
              quickPrompts={mockImagePrompts}
              onQuickPrompt={handleQuickPrompt}
            />
          </div>
        </div>
      </div>
      
      <ImageScheduler
        isOpen={schedulerOpen}
        onOpenChange={setSchedulerOpen}
        imageUrl={selectedImageForSchedule?.url}
        imageTitle={selectedImageForSchedule?.title}
        onSchedule={handleScheduleConfirm}
      />
    </AppLayout>
  )
}
