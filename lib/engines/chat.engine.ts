import type { ChatMessage } from '@/lib/types/chat'

class ChatEngineClass {
  validateMessage(message: string): { valid: boolean; error?: string } {
    const trimmed = message.trim()

    if (!trimmed) {
      return { valid: false, error: 'Message cannot be empty' }
    }

    if (trimmed.length > 2000) {
      return { valid: false, error: 'Message is too long (max 2000 characters)' }
    }

    return { valid: true }
  }

  createUserMessage(content: string): ChatMessage {
    return {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
  }

  createAssistantMessage(): ChatMessage {
    return {
      id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
  }
}

export const chatEngine = new ChatEngineClass()
