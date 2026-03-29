"use client"

import { RotateCcw, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
  isStreaming: boolean
  onNewChat: () => void
  className?: string
}

export function ChatHeader({
  isStreaming,
  onNewChat,
  className,
}: ChatHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b bg-white/80 px-4 py-3 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">Aqua Assistant</h1>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            {isStreaming ? "Thinking..." : "Your aquarium buddy"}
          </p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        disabled={isStreaming}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5",
          "text-sm text-muted-foreground",
          "transition-all duration-200",
          "hover:bg-muted hover:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        New Chat
      </button>
    </div>
  )
}
