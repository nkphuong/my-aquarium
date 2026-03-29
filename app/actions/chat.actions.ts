'use server'

import { chatAccessor } from '@/lib/accessors'
import { isMockMode, MOCK_INSIGHTS } from '@/lib/mock-data'
import type { AIInsight } from '@/lib/types/chat'

export async function getInsights(): Promise<{
  success: boolean
  insights?: AIInsight[]
  error?: string
}> {
  try {
    if (isMockMode()) {
      return { success: true, insights: MOCK_INSIGHTS }
    }

    const insights = await chatAccessor.getInsights()
    return { success: true, insights }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load insights'
    return { success: false, error: message }
  }
}
