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

class TankAccessorClass extends BaseAccessor {
    async findMyTanks(filters?: TankFilters): Promise<Tank[]> {
        const client = await this.getClient()
        const response = await client
            .get('/tank/my-tanks')
            .withParams({
                keyword: filters?.keyword || filters?.search,
                type: filters?.type === 'all' ? undefined : filters?.type,
                style: filters?.style,
            })
            .send<NestJsTankResponse>()

        return this.toDomainArray(response.data || [])
    }

    async create(input: CreateTankInput): Promise<Tank> {
        const client = await this.getClient()
        const response = await client
            .post('/tank')
            .withBody({
                name: input.name,
                width: input.width,
                height: input.height,
                length: input.length,
                setup_at: input.setupAt,
                type: input.type,
                style: input.style,
                description: input.description,
                status: input.status,
                water_volume: input.waterVolume,
                avatar: input.avatar,
            })
            .send<NestJsTankResponse>()

        if (!response.success || !response.data || response.data.length === 0) {
            throw new Error(response.error || 'Failed to create tank')
        }

        return this.toDomain(response.data[0])
    }

    async findById(id: number): Promise<Tank | null> {
        const client = await this.getClient()
        try {
            const response = await client
                .get(`/tank/${id}`)
                .send<NestJsTankResponse>()

            if (!response.success || !response.data || response.data.length === 0) {
                return null
            }

            return this.toDomain(response.data[0])
        } catch {
            return null
        }
    }

    async delete(id: number): Promise<void> {
        const client = await this.getClient()
        await client.delete(`/tank/${id}`).send()
    }

    private toDomainArray(data: NestJsTankData[]): Tank[] {
        return data.map((item) => this.toDomain(item))
    }

    private toDomain(data: NestJsTankData): Tank {
        return {
            id: data.id,
            name: data.name,
            width: data.width,
            height: data.height,
            length: data.length,
            userId: data.userId,
            status: data.status,
            avatar: data.avatar,
            description: data.description,
            setupAt: data.setup_at,
            type: data.type,
            style: data.style,
        }
    }
}

// Export singleton instance
export const tankAccessor = new TankAccessorClass()
