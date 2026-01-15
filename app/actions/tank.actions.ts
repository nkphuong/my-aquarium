'use server'

/**
 * Tank Server Actions
 *
 * Acts as the bridge between server (src/) and client (app/).
 *
 * Responsibilities:
 * - Call application services
 * - Convert service responses (classes/entities) to plain objects (DTOs)
 * - Handle errors and return client-safe responses
 *
 * Location: app/actions/ (serialization boundary)
 * Used by: app/stores/
 */

import { getService } from '@/infrastructure/di'
import type { CreateTankRequest } from '@/application/dtos/requests'
import type { GetTanksResponse, CreateTankResponse } from '@/application/dtos/responses'

/**
 * Get Tanks Action
 *
 * Fetches all tanks for the authenticated user.
 * Calls TankService and serializes the response to plain objects for the client.
 */
export async function getTanksAction(jwt: string, keyword?: string, type?: string, style?: string): Promise<GetTanksResponse> {
  try {
    // Call application service (server-side)
    const tankService = getService('TankService')
    const tanks = await tankService.findAllMyTanks(jwt, keyword, type, style)
    // Serialize domain entities to client DTOs (plain objects)
    return {
      success: true,
      tanks
    }
  } catch (error) {
    console.error('[getTanksAction] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tanks'
    }
  }
}

/**
 * Create Tank Action
 *
 * Creates a new tank for the authenticated user.
 * Calls TankService and serializes the response to plain objects for the client.
 */
export async function createTankAction(
  request: CreateTankRequest,
  jwt: string
): Promise<CreateTankResponse> {
  try {
    // Call application service (server-side)
    const tankService = getService('TankService')
    const tank = await tankService.create(
      request,
      jwt
    )

    // Serialize domain entity to client DTO (plain object)
    return {
      success: true,
      tank: {
        id: tank.id,
        name: tank.name,
        width: tank.width,
        height: tank.height,
        length: tank.length,
        userId: tank.userId
      }
    }
  } catch (error) {
    console.error('[createTankAction] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tank'
    }
  }
}
