/**
 * Auth Error
 *
 * Custom error class for authentication-related errors.
 */

export type AuthErrorCode =
    | 'INVALID_CREDENTIALS'
    | 'EMAIL_ALREADY_EXISTS'
    | 'TOKEN_EXPIRED'
    | 'SERVER_ERROR'
    | 'NETWORK_ERROR'

export class AuthError extends Error {
    constructor(
        message: string,
        public readonly code: AuthErrorCode
    ) {
        super(message)
        this.name = 'AuthError'
    }
}
