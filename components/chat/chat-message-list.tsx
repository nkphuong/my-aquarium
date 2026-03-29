"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { ChatMessageBubble } from "./chat-message-bubble"
import type { ChatMessage } from "@/lib/types/chat"

interface ChatMessageListProps {
  messages: ChatMessage[]
  className?: string
}

export function ChatMessageList({ messages, className }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto px-4 py-6",
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
