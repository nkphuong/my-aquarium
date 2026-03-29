/**
 * Client-Side File Utilities
 *
 * Browser-specific utilities for file handling.
 * Safe to import in Client Components.
 *
 * Location: app/utils/ (NOT lib/)
 * Architecture: These are UI utilities, not business logic.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileValidationError'
  }
}

/**
 * Validate image file (client-side only)
 * Checks file type and size before upload
 *
 * @throws {FileValidationError} If validation fails
 */
export function validateImage(file: File): void {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    throw new FileValidationError(
      'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError('File size must be less than 5MB.')
  }
}

/**
 * Create preview URL for image (uses browser URL.createObjectURL)
 *
 * @returns Object URL for preview
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Revoke preview URL to prevent memory leaks
 * Call this when preview is no longer needed
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}
