/**
 * NestJS User Repository
 *
 * Implements UserRepository by calling NestJS backend API.
 * This connects to your NestJS server which uses Supabase.
 * Now using HTTP Client builder pattern for cleaner API calls!
 */

import { User } from '@/domain/entities/user.entity'
import { UserRepository, LoginResult } from '@/domain/repositories/user.repository'
import { createHttpClient } from '@/src-lib/http/http-client'

export interface NestJsLoginResponse {
  success: boolean;
  data?: {
    user?: {
      id: string;
      authId: string;
      fullname?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
  message?: string;
  error?: string;
}

// Create HTTP client instance for NestJS API
const apiClient = createHttpClient(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000'
)

export class NestJSUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const data = await apiClient
        .get(`/users/${id}`)
        .send()

      return this.toDomain(data)
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      return null
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const data = await apiClient
        .get(`/users/email/${email}`)
        .send()

      return this.toDomain(data)
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  async loginWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<LoginResult | null> {
    try {
      // Call NestJS login endpoint with builder pattern
      const res = await apiClient
        .post('/auth/login')
        .withBody({ email, password })
          .send<NestJsLoginResponse>()

      const data = res.data
      // Return complete login result with tokens
      if (data?.user && data?.accessToken) {
        return {
          user: this.toDomain(data.user),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || '',
          expiresIn: data.expiresIn || 3600, // Default to 1 hour if not provided
        }
      }

      return null
    } catch (error) {
      console.error('Error during login:', error)
      return null
    }
  }

  async save(user: User): Promise<void> {
    try {
      await apiClient
        .post('/users')
        .withBody({
          id: user.id,
          authId: user.authId,
          fullname: user.fullname,
        })
        .send()
    } catch (error) {
      console.error('Error saving user:', error)
      throw error
    }
  }

  private toDomain(data: any): User {
    return {
      id: data.id,
      authId: data.authId,
      fullname: data.fullname,
    }
  }
}
