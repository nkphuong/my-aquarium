/**
 * Server Actions Index
 *
 * Re-exports all server actions for convenient importing.
 *
 * Usage:
 * import { getTanksAction } from '@/app/actions'
 * import { registerAction } from '@/app/actions'
 *
 * Note: For sign in/out, use signIn/signOut from next-auth/react
 */

// Tank actions
export * from './tank.actions'

// File actions
export * from './file.actions'

// Auth actions - using next-auth signIn/signOut directly
// export * from './auth.actions'

