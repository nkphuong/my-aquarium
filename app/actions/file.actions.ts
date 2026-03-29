'use server'

/**
 * File Server Actions - Manager Layer (IDesign)
 *
 * Orchestrates file operations following IDesign principles:
 * Manager → Accessor → API
 *
 * Location: app/actions/
 * Used by: Client Components
 * Calls: lib/accessors/
 */

import { fileAccessor } from '@/lib/accessors'

interface UploadImageResponse {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload Tank Image Action
 *
 * IDesign Manager flow:
 * 1. Receive FormData from client
 * 2. Call Accessor (data access)
 * 3. Return serializable response
 *
 * @param formData - FormData containing 'file' field
 * @returns Serializable response with URL or error
 */
export async function uploadTankImage(
  formData: FormData
): Promise<UploadImageResponse> {
  try {
    const file = formData.get('file') as File

    if (!file) {
      return {
        success: false,
        error: 'No file provided',
      }
    }

    // Call Accessor (data access layer)
    const result = await fileAccessor.uploadTankImage(file)

    return {
      success: true,
      url: result.url,
    }
  } catch (error) {
    console.error('[uploadTankImage] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}
