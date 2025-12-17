'use client'

/**
 * Tank Store (Client Layer)
 *
 * Manages tank data state in the client UI.
 * Only depends on client types and server actions (NO dependencies on src/).
 *
 * Location: app/stores/app/ (React-specific, client layer)
 * Pattern: Store → Server Action → Service (serialization boundary at actions)
 */

import { create } from 'zustand'
import {
  getTanksAction,
  // createTankAction 
} from '@/app/actions'
import type { Tank } from '@/app/types'

interface TankStoreState {
  tanks: Tank[]
  totalTanks: number
  isLoading: boolean
  error: string | null
  lastFetchTime: number | null

  // Actions
  fetchTanks: (jwt: string, force?: boolean) => Promise<void>
  ensureTanksFetched: (jwt: string) => Promise<void>
  // createTank: (request: CreateTankRequestDTO, jwt: string) => Promise<void>
  clearError: () => void
}

/**
 * Tank Store
 *
 * ⭐ Key Pattern:
 * - Store calls Server Actions (NOT services directly)
 * - Server Actions handle serialization (classes → plain objects)
 * - Store only uses client types from app/types/
 * - Complete separation: app/ never imports from src/
 */
export const useTankStore = create<TankStoreState>((set, get) => ({
  // Initial state
  tanks: [],
  isLoading: false,
  error: null,
  totalTanks: 0,
  lastFetchTime: null,

  // Actions

  /**
   * Fetch Tanks
   *
   * Explicitly fetches tanks from the server.
   * Use this when you need to force a refresh (e.g., pull-to-refresh, after creating a tank).
   *
   * @param jwt - Authentication token
   * @param force - Force fetch even if already loading (default: false)
   */
  fetchTanks: async (jwt: string, force = false) => {
    const state = get()

    // Prevent duplicate fetches (unless forced)
    if (!force && state.isLoading) {
      return
    }

    set({
      isLoading: true,
      error: null
    })

    try {
      const result = await getTanksAction(jwt)

      if (result.success && result.tanks) {
        set({
          tanks: result.tanks,
          totalTanks: result.tanks.length || 0,
          isLoading: false,
          error: null,
          lastFetchTime: Date.now()
        })
      } else {
        set({
          tanks: [],
          totalTanks: 0,
          isLoading: false,
          error: result.error || 'Failed to load tanks',
          lastFetchTime: Date.now()
        })
      }
    } catch (error) {
      set({
        tanks: [],
        totalTanks: 0,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastFetchTime: Date.now()
      })
    }
  },

  /**
   * Ensure Tanks Fetched
   *
   * Smart fetch: Only fetches if data is stale or not yet loaded.
   * Use this for components that need tank data but don't want to refetch if already loaded.
   *
   * Cache strategy:
   * - Fetches if no data exists (lastFetchTime is null)
   * - Fetches if data is older than 5 minutes (configurable)
   * - Skips fetch if data is fresh
   *
   * @param jwt - Authentication token
   */
  ensureTanksFetched: async (jwt: string) => {
    const state = get()
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

    // Check if we need to fetch
    const shouldFetch =
      !state.lastFetchTime || // Never fetched
      Date.now() - state.lastFetchTime > CACHE_DURATION || // Cache expired
      state.tanks.length === 0 // No data (might have failed before)

    if (shouldFetch && !state.isLoading) {
      await get().fetchTanks(jwt)
    }
  },

  // createTank: async (request: CreateTankRequestDTO, jwt: string) => {
  //   set({
  //     isLoading: true, 
  //     error: null
  //   })

  //   try {
  //     // ✅ Call server action
  //     const result = await createTankAction(request, jwt)

  //     if (result.success && result.tank) {
  //       // Add new tank to the list
  //       set((state) => ({
  //         tanks: [...state.tanks, result.tank!],
  //         isLoading: false, 
  //         error: null   
  //       }))
  //     } else {
  //       set({
  //          isLoading: false, 
  //          error: result.error || 'Failed to create tank' 
  //       })
  //     }
  //   } catch (error) {
  //     set({
  //        isLoading: false,
  //        error: error instanceof Error ? error.message : 'Unknown error'

  //     })
  //   }
  // },

  clearError: () => {
    set((state) => ({
      error: null
    }))
  }
})
)

// Convenience selectors
export const selectTanks = (state: TankStoreState) => state.tanks
export const selectTotalTanks = (state: TankStoreState) => state.totalTanks
export const selectIsLoading = (state: TankStoreState) => state.isLoading
export const selectError = (state: TankStoreState) => state.error
