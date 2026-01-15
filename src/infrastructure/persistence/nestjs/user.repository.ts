/**
 * NestJS User Repository
 *
 * Implements UserRepository by calling NestJS backend API.
 * This connects to your NestJS server which uses Supabase.
 * Now using HTTP Client builder pattern for cleaner API calls!
 */

import { User } from '@/domain/entities/user.entity'
import { UserRepository, AuthResult } from '@/domain/repositories/user.repository'
import { AuthError } from '@/domain/errors/auth.errors'
import { createHttpClient } from '@/src-lib/http/http-client'

export interface NestJsAuthResponse {
  success: boolean;
  data?: {
    user?: {
      id: string;
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
  ): Promise<AuthResult> {
    try {
      // Call NestJS login endpoint with builder pattern
      const res = await apiClient
        .post('/auth/login')
        .withBody({ email, password })
        .send<NestJsAuthResponse>()

      const data = res.data

      // Validate response has required fields
      if (!data?.user || !data?.accessToken) {
        throw new AuthError('Invalid response from server', 'SERVER_ERROR')
      }

      return {
        user: this.toDomain(data.user),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || '',
        expiresIn: data.expiresIn || 3600,
      }
    } catch (error) {
      // Re-throw if already AuthError
      if (error instanceof AuthError) {
        throw error
      }

      // Convert HTTP errors to AuthError
      const httpError = error as { status?: number; message?: string }
      if (httpError.status === 401) {
        throw new AuthError(
          httpError.message || 'Invalid email or password',
          'INVALID_CREDENTIALS'
        )
      }

      throw new AuthError(
        httpError.message || 'Login failed. Please try again.',
        'SERVER_ERROR'
      )
    }
  }

  async registerWithEmailAndPassword(email: string, password: string, name?: string): Promise<AuthResult> {
    try {
      // Call NestJS register endpoint with builder pattern
      const res = await apiClient
        .post('/auth/register')
        .withBody({ email, password, name })
        .send<NestJsAuthResponse>()

      const data = res.data

      // Validate response has required fields
      if (!data?.user || !data?.accessToken) {
        throw new AuthError('Invalid response from server', 'SERVER_ERROR')
      }

      return {
        user: this.toDomain(data.user),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || '',
        expiresIn: data.expiresIn || 3600,
      }
    } catch (error) {
      // Re-throw if already AuthError
      if (error instanceof AuthError) {
        throw error
      }

      // Convert HTTP errors to AuthError
      const httpError = error as { status?: number; message?: string }
      if (httpError.status === 409) {
        throw new AuthError(
          httpError.message || 'Email already exists',
          'EMAIL_ALREADY_EXISTS'
        )
      }

      throw new AuthError(
        httpError.message || 'Registration failed. Please try again.',
        'SERVER_ERROR'
      )
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      // Call NestJS refresh endpoint with builder pattern
      const res = await apiClient
        .post('/auth/refresh')
        .withBody({ refreshToken })
        .send<NestJsAuthResponse>()

      const data = res.data

      // Validate response has required fields
      if (!data?.user || !data?.accessToken) {
        throw new AuthError('Invalid response from server', 'SERVER_ERROR')
      }

      return {
        user: this.toDomain(data.user),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || '',
        expiresIn: data.expiresIn || 3600,
      }
    } catch (error) {
      // Re-throw if already AuthError
      if (error instanceof AuthError) {
        throw error
      }

      // Convert HTTP errors to AuthError
      const httpError = error as { status?: number; message?: string }
      if (httpError.status === 401) {
        throw new AuthError(
          httpError.message || 'Token expired or invalid',
          'TOKEN_EXPIRED'
        )
      }

      throw new AuthError(
        httpError.message || 'Token refresh failed. Please login again.',
        'SERVER_ERROR'
      )
    }
  }

  async save(user: User): Promise<void> {
    try {
      await apiClient
        .post('/users')
        .withBody({
          id: user.id,
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
      fullname: data.fullname,
    }
  }
}
