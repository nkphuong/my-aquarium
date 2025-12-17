/**
 * Zustand Stores (Next.js/React Framework Layer)
 *
 * State management for the React UI.
 *
 * Organization:
 * - app/ - Application-wide state (tanks, etc.) - calls src/application services
 * - ui/ - Pure UI state (modals, theme, loading) - no service calls needed
 *
 * ⭐ Clean Architecture:
 * - Stores live in app/ (React hooks, framework-specific)
 * - Business logic lives in src/application/ (services, pure TypeScript)
 * - Stores CALL services, don't implement business logic
 *
 * ⭐ Authentication:
 * - Authentication is handled by NextAuth (not Zustand)
 * - Use useSession() hook from next-auth/react for auth state
 * - Use signIn() and signOut() from next-auth/react for auth actions
 */

// Application state stores
export * from './app/tank.store'

// UI state stores
export * from './ui/modal.store'
