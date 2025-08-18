import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isGenerating: boolean
  quickPrompts: string[]
  onQuickPrompt: (prompt: string) => void
}

export const ChatInput = ({
  value,
  onChange,
  onSend,
  isGenerating,
  quickPrompts,
  onQuickPrompt,
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-3">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => onQuickPrompt(prompt)}
              className="whitespace-nowrap text-xs"
            >
              {prompt}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe la imagen promocional de casino que quieres generar..."
            className="flex-1 resize-none"
            rows={2}
            onKeyPress={handleKeyPress}
          />
          <Button
            onClick={onSend}
            disabled={!value.trim() || isGenerating}
            className="px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
