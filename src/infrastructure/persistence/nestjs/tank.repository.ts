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
import type { CreateTankRequest } from '@/application/dtos/requests';

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
  userId: number;
  status?: string;
  avatar?: string;
  description?: string;
  setup_at?: string;
  type?: string;
  style?: string;
}

// Create HTTP client instance for NestJS API
const apiClient = createHttpClient(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000'
)

export class NestJSTankRepository implements TankRepository {
  async findAllMyTanks(jwt: string, keyword?: string, type?: string, style?: string): Promise<Tank[]> {
    const response = await apiClient
      .get('/tank/my-tanks')
      .withAuth(jwt)
      .withParams({ keyword, type, style })
      .send<NestJsTankResponse>()
    return this.toDomainArray(response.data || []);
  }

  async create(request: CreateTankRequest, jwt: string): Promise<Tank> {
    const response = await apiClient
      .post('/tank')
      .withAuth(jwt)
      .withBody(request)
      .send<NestJsTankResponse>()

    if (!response.success || !response.data || response.data.length === 0) {
      throw new Error(response.error || 'Failed to create tank');
    }

    return this.toDomain(response.data[0])
  }

  private toDomainArray(data: NestJsTankData[]): Tank[] {
    data.map(item => this.toDomain(item));
    return data;
  }

  private toDomain(data: NestJsTankData): Tank {
    return {
      ...data
    }
  }
}
