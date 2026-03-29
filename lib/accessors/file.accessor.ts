/**
 * Tank Accessor
 *
 * Data access layer for tank operations.
 * Calls NestJS backend API and returns typed responses.
 */

import { BaseAccessor } from './base.accessor'
import type { Tank, CreateTankInput, TankFilters } from '@/lib/types'

interface NestJsTankResponse {
    success: boolean
    data?: NestJsTankData[]
    message?: string
    error?: string
}

interface NestJsTankData {
    id: number
    name: string
    width: number
    height: number
    length: number
    userId: number
    status?: string
    avatar?: string
    description?: string
    setup_at?: string
    type?: string
    style?: string
}

class FileAccessorClass extends BaseAccessor {
    async uploadTankImage(file: File): Promise<{ url: string }> {
        const client = await this.getClient()
        const formData = new FormData()
        formData.append('file', file)
        const response = await client
            .post('/file/upload-tank-image')
            .withBody(formData)
            .send<{ url: string }>()
        return response
    }
}

// Export singleton instance
export const fileAccessor = new FileAccessorClass()
