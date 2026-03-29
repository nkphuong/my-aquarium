/**
 * Auth Types - Single Source of Truth
 *
 * All authentication-related types consolidated in one place.
 * Used by: Accessors, Actions, Auth config
 */

import type { User } from './user'

export interface LoginInput {
    email: string
    password: string
}

export interface RegisterInput {
    email: string
    password: string
    fullname?: string
}

export interface AuthResult {
    user: User
    accessToken: string
    refreshToken: string
    expiresIn: number
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
    expiresIn: number
}
