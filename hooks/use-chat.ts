"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { chatEngine } from '@/lib/engines'
import type { ChatMessage } from '@/lib/types/chat'

export function useChat(initialMessage?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const initialSentRef = useRef(false)

  const sendMessage = useCallback(async (content: string) => {
    const validation = chatEngine.validateMessage(content)
    if (!validation.valid) return

    const userMessage = chatEngine.createUserMessage(content)
    const assistantMessage = chatEngine.createAssistantMessage()

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsStreaming(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim() }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Parse SSE lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()

          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)

            if (parsed.error) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id
                    ? {
                        ...msg,
                        content: `Sorry, something went wrong: ${parsed.error}`,
                        isStreaming: false,
                      }
                    : msg,
                ),
              )
              return
            }

            if (parsed.text) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: msg.content + parsed.text }
                    : msg,
                ),
              )
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, isStreaming: false }
            : msg,
        ),
      )
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // User cancelled — mark as done
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, isStreaming: false }
              : msg,
          ),
        )
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: 'Sorry, I had trouble connecting. Please try again!',
                  isStreaming: false,
                }
              : msg,
          ),
        )
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [])

  const clearChat = useCallback(async () => {
    setMessages([])
    try {
      await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '__clear__' }),
      })
    } catch {
      // Best effort
    }
  }, [])

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  // Send initial message if provided (e.g., from dashboard widget)
  useEffect(() => {
    if (initialMessage && !initialSentRef.current) {
      initialSentRef.current = true
      sendMessage(initialMessage)
    }
  }, [initialMessage, sendMessage])

  return { messages, isStreaming, sendMessage, clearChat, stopStreaming }
}
