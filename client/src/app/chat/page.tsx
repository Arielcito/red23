"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  ArrowLeft,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useChat } from "@/lib/hooks/useChat"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { LoadingIndicator } from "@/components/chat/LoadingIndicator"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatSidebar } from "@/components/chat/ChatSidebar"

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return
    await sendMessage(inputValue)
    setInputValue("")
  }

  const handleQuickPrompt = (prompt: string) => {
    setQuickPrompt(prompt)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing Casino IA</h1>
              <p className="text-gray-600 dark:text-gray-300">Genera imágenes promocionales para casinos</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className="text-primary-600 border-primary-200 bg-primary-50 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              IA Activa
            </Badge>
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col max-w-4xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isGenerating && <LoadingIndicator />}
          </div>

          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            isGenerating={isGenerating}
            quickPrompts={mockImagePrompts}
            onQuickPrompt={handleQuickPrompt}
          />
        </div>

        <ChatSidebar
          quickPrompts={mockImagePrompts}
          onQuickPrompt={handleQuickPrompt}
          stats={chatStats}
        />
      </div>
    </div>
  )
}
