/**
 * Zustand Stores (UI State Only)
 *
 * With Server Components first pattern:
 * - Data fetching is done in Server Components
 * - Stores are only for UI state (modals, sidebar, theme)
 *
 * Organization:
 * - ui/ - Pure UI state (modals, theme, loading)
 *
 * ⭐ Authentication:
 * - Use useSession() hook from next-auth/react for auth state
 * - Use signIn() and signOut() from next-auth/react for auth actions
 */

// UI state stores
export * from './ui/modal.store'
