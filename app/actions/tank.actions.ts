'use server'

/**
 * Tank Server Actions - Manager Layer (IDesign)
 *
 * Orchestrates tank operations following IDesign principles:
 * 1. Validate with Engine (business rules)
 * 2. Execute with Accessor (data access)
 * 3. Enrich with Engine (calculated properties)
 *
 * IDesign Flow: Manager → Engine → Accessor
 *
 * Location: app/actions/
 * Used by: Components, Server Components
 */

import { revalidatePath } from 'next/cache'
import { tankAccessor } from '@/lib/accessors'
import { tankEngine, type EnrichedTank } from '@/lib/engines'
import { isMockMode, MOCK_TANKS } from '@/lib/mock-data'
import type {
  CreateTankInput,
  TankFilters,
  GetTanksResponse,
  CreateTankResponse,
} from '@/lib/types'

/**
 * Extended response type with enriched tanks
 */
interface GetEnrichedTanksResponse {
  success: boolean
  tanks?: EnrichedTank[]
  error?: string
}

/**
 * Get Tanks Action
 *
 * IDesign Manager flow:
 * 1. Fetch from Accessor (data access)
 * 2. Enrich with Engine (calculated properties)
 */
export async function getTanks(filters?: TankFilters): Promise<GetTanksResponse> {
  try {
    if (isMockMode()) {
      let tanks = MOCK_TANKS
      if (filters?.type) {
        tanks = tanks.filter(t => t.type === filters.type)
      }
      if (filters?.keyword || filters?.search) {
        const q = (filters.keyword || filters.search || '').toLowerCase()
        tanks = tanks.filter(t => t.name.toLowerCase().includes(q))
      }
      return { success: true, tanks: tankEngine.enrichTanksWithStats(tanks) }
    }

    // 1. Fetch from Accessor
    const tanks = await tankAccessor.findMyTanks(filters)

    // 2. Enrich with Engine (add calculated properties)
    const enrichedTanks = tankEngine.enrichTanksWithStats(tanks)

    return {
      success: true,
      tanks: enrichedTanks,
    }
  } catch (error) {
    console.error('[getTanks] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tanks',
    }
  }
}

/**
 * Get Enriched Tanks Action (with full calculated properties)
 *
 * Returns tanks with all calculated properties (water volume, surface area)
 */
export async function getEnrichedTanks(filters?: TankFilters): Promise<GetEnrichedTanksResponse> {
  try {
    if (isMockMode()) {
      return { success: true, tanks: tankEngine.enrichTanksWithStats(MOCK_TANKS) }
    }

    const tanks = await tankAccessor.findMyTanks(filters)
    const enrichedTanks = tankEngine.enrichTanksWithStats(tanks)

    return {
      success: true,
      tanks: enrichedTanks,
    }
  } catch (error) {
    console.error('[getEnrichedTanks] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tanks',
    }
  }
}

/**
 * Create Tank Action
 *
 * IDesign Manager flow:
 * 1. Validate with Engine (business rules)
 * 2. Create with Accessor (data access)
 * 3. Enrich with Engine (calculated properties)
 */
export async function createTank(input: CreateTankInput): Promise<CreateTankResponse> {
  try {
    // 1. Validate with Engine
    const validation = tankEngine.validateCreateInput(input)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors?.join(', ') || 'Invalid input',
      }
    }

    if (isMockMode()) {
      const mockTank = {
        id: Date.now(),
        name: input.name,
        width: input.width,
        height: input.height,
        length: input.length,
        userId: 1,
        type: input.type,
        style: input.style,
        description: input.description,
        status: input.status || 'active',
        setupAt: input.setupAt,
        avatar: input.avatar,
      }
      revalidatePath('/tanks')
      revalidatePath('/dashboard')
      return { success: true, tank: tankEngine.enrichTankWithStats(mockTank) }
    }

    // 2. Create with Accessor
    const tank = await tankAccessor.create(input)

    // 3. Enrich with Engine
    const enrichedTank = tankEngine.enrichTankWithStats(tank)

    // Revalidate tanks page to show new tank
    revalidatePath('/tanks')
    revalidatePath('/dashboard')

    return {
      success: true,
      tank: enrichedTank,
    }
  } catch (error) {
    console.error('[createTank] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tank',
    }
  }
}

/**
 * Delete Tank Action
 *
 * Deletes a tank by ID.
 * Revalidates the tanks page after deletion.
 */
export async function deleteTank(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    if (isMockMode()) {
      revalidatePath('/tanks')
      return { success: true }
    }

    await tankAccessor.delete(id)

    // Revalidate tanks page
    revalidatePath('/tanks')

    return { success: true }
  } catch (error) {
    console.error('[deleteTank] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete tank',
    }
  }
}

/**
 * Get Tank By ID Action
 *
 * IDesign Manager flow:
 * 1. Fetch from Accessor
 * 2. Enrich with Engine
 */
export async function getTankById(id: number): Promise<{ success: boolean; tank?: EnrichedTank; error?: string }> {
  try {
    if (isMockMode()) {
      const tank = MOCK_TANKS.find(t => t.id === id)
      if (!tank) return { success: false, error: 'Tank not found' }
      return { success: true, tank: tankEngine.enrichTankWithStats(tank) }
    }

    // 1. Fetch from Accessor
    const tank = await tankAccessor.findById(id)

    if (!tank) {
      return {
        success: false,
        error: 'Tank not found',
      }
    }

    // 2. Enrich with Engine
    const enrichedTank = tankEngine.enrichTankWithStats(tank)

    return {
      success: true,
      tank: enrichedTank,
    }
  } catch (error) {
    console.error('[getTankById] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tank',
    }
  }
}
