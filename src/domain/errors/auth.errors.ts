/**
 * Authentication Error Classes
 *
 * Custom error classes for authentication-related errors.
 * These errors propagate meaningful messages from the backend API
 * through the service layer to the UI.
 */

export type AuthErrorCode =
    | 'INVALID_CREDENTIALS'
    | 'INVALID_EMAIL'
    | 'USER_NOT_FOUND'
    | 'EMAIL_ALREADY_EXISTS'
    | 'WEAK_PASSWORD'
    | 'TOKEN_EXPIRED'
    | 'TOKEN_INVALID'
    | 'NETWORK_ERROR'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR'

export class AuthError extends Error {
    constructor(
        message: string,
        public readonly code: AuthErrorCode = 'UNKNOWN_ERROR'
    ) {
        super(message)
        this.name = 'AuthError'

        // Maintains proper stack trace for where error was thrown (V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthError)
        }
    }

    /**
     * Create an AuthError from an API response
     */
    static fromApiResponse(response: {
        message?: string
        error?: string
        statusCode?: number
    }): AuthError {
        const message = response.message || response.error || 'Authentication failed'

        // Map common HTTP status codes to error codes
        let code: AuthErrorCode = 'UNKNOWN_ERROR'
        switch (response.statusCode) {
            case 401:
                code = 'INVALID_CREDENTIALS'
                break
            case 404:
                code = 'USER_NOT_FOUND'
                break
            case 409:
                code = 'EMAIL_ALREADY_EXISTS'
                break
            case 400:
                code = 'INVALID_EMAIL'
                break
            case 500:
                code = 'SERVER_ERROR'
                break
        }

        return new AuthError(message, code)
    }
}
