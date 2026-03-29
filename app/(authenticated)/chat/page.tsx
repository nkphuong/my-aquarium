"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useChat } from "@/hooks/use-chat"
import {
  ChatHeader,
  ChatMessageList,
  ChatInputBar,
  ChatWelcome,
} from "@/components/chat"

function ChatContent() {
  const searchParams = useSearchParams()
  const initialQuestion = searchParams.get("q") || undefined

  const { messages, isStreaming, sendMessage, clearChat, stopStreaming } =
    useChat(initialQuestion)

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <ChatHeader isStreaming={isStreaming} onNewChat={clearChat} />

      {hasMessages ? (
        <ChatMessageList messages={messages} />
      ) : (
        <ChatWelcome onSuggestionClick={sendMessage} />
      )}

      <ChatInputBar
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  )
}
