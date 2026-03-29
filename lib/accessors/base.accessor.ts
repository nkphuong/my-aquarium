/**
 * Base Accessor - Data Access Layer (IDesign)
 *
 * Abstract base class for all accessors.
 * Provides common HTTP client access and utilities.
 *
 * IDesign Principles:
 * - Accessors are the lowest volatility layer (rarely changes)
 * - Single responsibility: data access only
 * - No business logic (that's for Engines)
 * - Framework-independent data operations
 */

import { getAuthenticatedClient } from '@/lib/auth'
import { createHttpClient, type HttpClient } from '@/lib/api'

export abstract class BaseAccessor {
    /**
     * Gets an authenticated HTTP client for protected endpoints
     * Uses the current user's session token
     */
    protected async getClient(): Promise<HttpClient> {
        return getAuthenticatedClient()
    }

    /**
     * Gets a public HTTP client for unauthenticated endpoints
     * Used for login, registration, and public APIs
     */
    protected getPublicClient(): HttpClient {
        return createHttpClient(
            process.env.NEXT_PUBLIC_API_URL ||
                process.env.API_URL ||
                'http://localhost:3000'
        )
    }
}
