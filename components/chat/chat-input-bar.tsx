"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { Send, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputBarProps {
  onSend: (message: string) => void
  onStop: () => void
  isStreaming: boolean
  className?: string
}

export function ChatInputBar({
  onSend,
  onStop,
  isStreaming,
  className,
}: ChatInputBarProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    onSend(input)
    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div
      className={cn(
        "border-t bg-white/80 px-4 py-3 backdrop-blur-sm",
        className,
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2"
      >
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your aquarium..."
            disabled={isStreaming}
            rows={1}
            className={cn(
              "w-full resize-none rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 pr-4",
              "text-sm placeholder:text-muted-foreground/60",
              "transition-all duration-200",
              "focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "max-h-32",
            )}
            style={{
              height: "auto",
              minHeight: "44px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`
            }}
          />
        </div>

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className={cn(
              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full",
              "bg-red-500 text-white",
              "transition-all duration-200",
              "hover:bg-red-600 hover:scale-105",
            )}
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className={cn(
              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground",
              "transition-all duration-200",
              "hover:bg-primary/90 hover:scale-105",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  )
}
