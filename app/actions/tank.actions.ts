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
import type { GetTanksResponseDTO, CreateTankRequestDTO, CreateTankResponseDTO } from '@/app/types/tank.types'

/**
 * Get Tanks Action
 *
 * Fetches all tanks for the authenticated user.
 * Calls TankService and serializes the response to plain objects for the client.
 */
export async function getTanksAction(jwt: string): Promise<GetTanksResponseDTO> {
  try {
    // Call application service (server-side)
    const tankService = getService('TankService')
    const tanks = await tankService.findAllMyTanks(jwt)

    // Serialize domain entities to client DTOs (plain objects)
    return {
      success: true,
      tanks: tanks.map(tank => ({
        id: tank.id,
        name: tank.name,
        width: tank.width,
        height: tank.height,
        length: tank.length,
        userId: tank.userId
      }))
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
// export async function createTankAction(
//   request: CreateTankRequestDTO,
//   jwt: string
// ): Promise<CreateTankResponseDTO> {
//   try {
//     // Call application service (server-side)
//     const tankService = getService('TankService')
//     const tank = await tankService.create(
//       {
//         name: request.name,
//         width: request.width,
//         height: request.height,
//         length: request.length
//       },
//       jwt
//     )

//     // Serialize domain entity to client DTO (plain object)
//     return {
//       success: true,
//       tank: {
//         id: tank.id,
//         name: tank.name,
//         width: tank.width,
//         height: tank.height,
//         length: tank.length,
//         userId: tank.userId
//       }
//     }
//   } catch (error) {
//     console.error('[createTankAction] Error:', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to create tank'
//     }
//   }
// }
