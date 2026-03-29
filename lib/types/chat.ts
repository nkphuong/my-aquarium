export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface AIInsight {
  id: string
  priority: 'info' | 'suggestion' | 'warning' | 'critical'
  title: string
  description: string
  tankId?: string
  tankName?: string
  actionLabel: string
}
