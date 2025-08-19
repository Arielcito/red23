"use client"

import { useState } from "react"
import { useChat } from "@/lib/hooks/useChat"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { LoadingIndicator } from "@/components/chat/LoadingIndicator"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
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
    chatStats,
    sendMessage,
    setQuickPrompt,
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
      <div className="flex flex-col lg:flex-row h-full gap-0">
        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col min-w-0 order-2 lg:order-1">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
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

        {/* Chat Sidebar */}
        <div className="order-1 lg:order-2 w-full lg:w-80 flex-shrink-0 h-full">
          <ChatSidebar
            quickPrompts={mockImagePrompts}
            onQuickPrompt={handleQuickPrompt}
            stats={chatStats}
          />
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
