import { BaseAccessor } from './base.accessor'
import type { AIInsight } from '@/lib/types/chat'

class ChatAccessorClass extends BaseAccessor {
  async getInsights(): Promise<AIInsight[]> {
    const client = await this.getClient()
    const response = await client.get('/chat/insights').send<{
      status: string
      data: AIInsight[]
    }>()
    return response.data
  }

  async clearSession(): Promise<void> {
    const client = await this.getClient()
    await client.post('/chat/clear').send()
  }
}

export const chatAccessor = new ChatAccessorClass()
