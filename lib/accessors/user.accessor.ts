/**
 * User Accessor - Data Access Layer (IDesign)
 *
 * Data access layer for user and authentication operations.
 * Calls NestJS backend API and returns typed responses.
 *
 * IDesign Principles:
 * - Extends BaseAccessor for consistent HTTP client access
 * - Uses getPublicClient() for unauthenticated endpoints (login, register)
 * - Uses getClient() for authenticated endpoints (profile, etc.)
 * - No business logic (validation is in authEngine)
 */

import { BaseAccessor } from './base.accessor'
import { AuthError } from '@/lib/errors'
import type { User, AuthResult, LoginInput, RegisterInput } from '@/lib/types'

interface NestJsAuthResponse {
    success: boolean
    data?: {
        user?: {
            id: number
            email: string
            fullname?: string
        }
        accessToken?: string
        refreshToken?: string
        expiresIn?: number
    }
    message?: string
    error?: string
}

class UserAccessorClass extends BaseAccessor {
    async findById(id: string): Promise<User | null> {
        try {
            const client = await this.getClient()
            const data = await client.get(`/users/${id}`).send()
            return this.toDomain(data)
        } catch {
            return null
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const client = await this.getClient()
            const data = await client.get(`/users/email/${email}`).send()
            return this.toDomain(data)
        } catch {
            return null
        }
    }

    async login(input: LoginInput): Promise<AuthResult> {
        try {
            // Use public client for login (no auth required)
            const client = this.getPublicClient()
            const res = await client
                .post('/auth/login')
                .withBody({ email: input.email, password: input.password })
                .send<NestJsAuthResponse>()

            const data = res.data

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
            if (error instanceof AuthError) {
                throw error
            }

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

    async register(input: RegisterInput): Promise<AuthResult> {
        try {
            // Use public client for registration (no auth required)
            const client = this.getPublicClient()
            const res = await client
                .post('/auth/register')
                .withBody({
                    email: input.email,
                    password: input.password,
                    name: input.fullname,
                })
                .send<NestJsAuthResponse>()

            const data = res.data

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
            if (error instanceof AuthError) {
                throw error
            }

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
            // Use public client for token refresh (auth header not needed, using refresh token in body)
            const client = this.getPublicClient()
            const res = await client
                .post('/auth/refresh')
                .withBody({ refreshToken })
                .send<NestJsAuthResponse>()

            const data = res.data

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
            if (error instanceof AuthError) {
                throw error
            }

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

    private toDomain(data: { id: number; email?: string; fullname?: string }): User {
        return {
            id: data.id,
            email: data.email,
            fullname: data.fullname,
        }
    }
}

// Export singleton instance
export const userAccessor = new UserAccessorClass()
