/**
 * NestJS User Repository
 *
 * Implements UserRepository by calling NestJS backend API.
 * This connects to your NestJS server which uses Supabase.
 * Now using HTTP Client builder pattern for cleaner API calls!
 */

import { TankRepository } from '@/domain/repositories'
import { createHttpClient } from '@/src/lib/http/http-client'
import { Tank } from '@/srcdomain/entities/tank.entity';

export interface NestJsTankResponse {
  success: boolean;
  data?: NestJsTankData[]
  message?: string;
  error?: string;
}
interface NestJsTankData {
  id: number;
  name: string;
  width: number;
  height: number;
  length: number;
  userId: number
}

// Create HTTP client instance for NestJS API
const apiClient = createHttpClient(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000'
)

export class NestJSTankRepository implements TankRepository {
  async findAllMyTanks(jwt: string): Promise<Tank[]> {
    const response = await apiClient
      .get('/tank/my-tanks')
      .withAuth(jwt)
      .send<NestJsTankResponse>()

    return this.toDomainArray(response.data || []);
  }

  private toDomainArray(data: NestJsTankData[]): Tank[] {
    data.map(item => this.toDomain(item));
    return data;
  }

  private toDomain(data: NestJsTankData): Tank {
    return {
      id: data.id,
      name: data.name,
      width: data.width,
      height: data.height,
      length: data.length,
      userId: data.userId,
    }
  }
}
