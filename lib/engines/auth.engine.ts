/**
 * Auth Engine - Business Logic Layer (IDesign)
 *
 * Handles all authentication-related business rules and validation.
 * This layer sits between Managers (Server Actions/NextAuth) and Accessors.
 *
 * Responsibilities:
 * - Input validation for login/register
 * - Password strength validation
 * - Email format validation
 * - Rate limiting logic (stateless)
 */

import type { LoginInput, RegisterInput } from '@/lib/types'

/**
 * Validation result from engine methods
 */
export interface ValidationResult {
    valid: boolean
    errors?: string[]
}

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

/**
 * Password strength result
 */
export interface PasswordStrengthResult {
    strength: PasswordStrength
    score: number
    suggestions: string[]
}

class AuthEngineClass {
    // Email regex pattern (RFC 5322 simplified)
    private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Password requirements
    private readonly MIN_PASSWORD_LENGTH = 8
    private readonly MAX_PASSWORD_LENGTH = 128

    /**
     * Validates login input
     * @param input - Login credentials to validate
     * @returns Validation result
     */
    validateLoginInput(input: LoginInput): ValidationResult {
        const errors: string[] = []

        // Email validation
        if (!input.email || input.email.trim().length === 0) {
            errors.push('Email is required')
        } else if (!this.isValidEmail(input.email)) {
            errors.push('Please enter a valid email address')
        }

        // Password validation (basic for login)
        if (!input.password || input.password.length === 0) {
            errors.push('Password is required')
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        }
    }

    /**
     * Validates registration input
     * @param input - Registration data to validate
     * @returns Validation result
     */
    validateRegisterInput(input: RegisterInput): ValidationResult {
        const errors: string[] = []

        // Email validation
        if (!input.email || input.email.trim().length === 0) {
            errors.push('Email is required')
        } else if (!this.isValidEmail(input.email)) {
            errors.push('Please enter a valid email address')
        }

        // Password validation (strict for registration)
        if (!input.password || input.password.length === 0) {
            errors.push('Password is required')
        } else {
            if (input.password.length < this.MIN_PASSWORD_LENGTH) {
                errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters`)
            }
            if (input.password.length > this.MAX_PASSWORD_LENGTH) {
                errors.push(`Password cannot exceed ${this.MAX_PASSWORD_LENGTH} characters`)
            }
        }

        // Fullname validation (if provided)
        if (input.fullname) {
            if (input.fullname.trim().length < 2) {
                errors.push('Name must be at least 2 characters')
            }
            if (input.fullname.length > 100) {
                errors.push('Name cannot exceed 100 characters')
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        }
    }

    /**
     * Validates email format
     * @param email - Email to validate
     * @returns true if valid email format
     */
    isValidEmail(email: string): boolean {
        return this.EMAIL_REGEX.test(email.trim().toLowerCase())
    }

    /**
     * Analyzes password strength
     * @param password - Password to analyze
     * @returns Strength result with score and suggestions
     */
    analyzePasswordStrength(password: string): PasswordStrengthResult {
        let score = 0
        const suggestions: string[] = []

        // Length checks
        if (password.length >= 8) score += 1
        if (password.length >= 12) score += 1
        if (password.length >= 16) score += 1

        // Character variety checks
        if (/[a-z]/.test(password)) {
            score += 1
        } else {
            suggestions.push('Add lowercase letters')
        }

        if (/[A-Z]/.test(password)) {
            score += 1
        } else {
            suggestions.push('Add uppercase letters')
        }

        if (/[0-9]/.test(password)) {
            score += 1
        } else {
            suggestions.push('Add numbers')
        }

        if (/[^a-zA-Z0-9]/.test(password)) {
            score += 1
        } else {
            suggestions.push('Add special characters')
        }

        // Penalty for common patterns
        if (/^[a-zA-Z]+$/.test(password)) {
            score -= 1
            suggestions.push('Avoid using only letters')
        }

        if (/^[0-9]+$/.test(password)) {
            score -= 2
            suggestions.push('Avoid using only numbers')
        }

        // Determine strength level
        let strength: PasswordStrength
        if (score <= 2) {
            strength = 'weak'
        } else if (score <= 4) {
            strength = 'fair'
        } else if (score <= 6) {
            strength = 'good'
        } else {
            strength = 'strong'
        }

        return {
            strength,
            score: Math.max(0, Math.min(score, 10)),
            suggestions,
        }
    }

    /**
     * Normalizes email for comparison
     * @param email - Email to normalize
     * @returns Lowercase trimmed email
     */
    normalizeEmail(email: string): string {
        return email.trim().toLowerCase()
    }

    /**
     * Checks if too many login attempts (stateless check)
     * This is a placeholder - actual rate limiting should be done at infrastructure level
     * @param attemptCount - Number of failed attempts
     * @param maxAttempts - Maximum allowed attempts (default 5)
     * @returns true if within allowed attempts
     */
    isWithinRateLimit(attemptCount: number, maxAttempts: number = 5): boolean {
        return attemptCount < maxAttempts
    }

    /**
     * Calculates lockout duration based on failed attempts
     * @param attemptCount - Number of failed attempts
     * @returns Lockout duration in seconds
     */
    calculateLockoutDuration(attemptCount: number): number {
        // Exponential backoff: 0, 30, 60, 120, 300, 600, 900, 1800 seconds
        if (attemptCount < 3) return 0
        const baseDelay = 30
        const multiplier = Math.pow(2, attemptCount - 3)
        return Math.min(baseDelay * multiplier, 1800) // Max 30 minutes
    }
}

// Export singleton instance
export const authEngine = new AuthEngineClass()
