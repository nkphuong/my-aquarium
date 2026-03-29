/**
 * Tank Engine - Business Logic Layer (IDesign)
 *
 * Handles all tank-related business rules, validation, and calculations.
 * This layer sits between Managers (Server Actions) and Accessors (Data Access).
 *
 * Responsibilities:
 * - Input validation
 * - Business rule enforcement
 * - Data enrichment and calculations
 * - Domain-specific logic
 */

import type { Tank, CreateTankInput } from '@/lib/types'

/**
 * Validation result from engine methods
 */
export interface ValidationResult {
    valid: boolean
    errors?: string[]
}

/**
 * Enriched tank with calculated properties
 */
export interface EnrichedTank extends Tank {
    waterVolume: number
    surfaceArea: number
}

/**
 * Tank style options for validation
 */
const VALID_TANK_STYLES = [
    'freshwater',
    'saltwater',
    'planted',
    'reef',
    'brackish',
    'coldwater',
] as const

/**
 * Tank type options for validation
 */
const VALID_TANK_TYPES = [
    'community',
    'species',
    'breeding',
    'quarantine',
    'display',
] as const

class TankEngineClass {
    /**
     * Validates tank creation input
     * @param input - The create tank input to validate
     * @returns Validation result with errors if invalid
     */
    validateCreateInput(input: CreateTankInput): ValidationResult {
        const errors: string[] = []

        // Name validation
        if (!input.name || input.name.trim().length < 2) {
            errors.push('Tank name must be at least 2 characters')
        }

        if (input.name && input.name.length > 100) {
            errors.push('Tank name cannot exceed 100 characters')
        }

        // Dimension validation (must be positive)
        if (!input.width || input.width <= 0) {
            errors.push('Width must be a positive number')
        }

        if (!input.height || input.height <= 0) {
            errors.push('Height must be a positive number')
        }

        if (!input.length || input.length <= 0) {
            errors.push('Length must be a positive number')
        }

        // Reasonable dimension limits (in cm)
        const MAX_DIMENSION = 1000 // 10 meters max
        if (input.width > MAX_DIMENSION) {
            errors.push(`Width cannot exceed ${MAX_DIMENSION}cm`)
        }
        if (input.height > MAX_DIMENSION) {
            errors.push(`Height cannot exceed ${MAX_DIMENSION}cm`)
        }
        if (input.length > MAX_DIMENSION) {
            errors.push(`Length cannot exceed ${MAX_DIMENSION}cm`)
        }

        // Style validation (if provided)
        if (input.style && !VALID_TANK_STYLES.includes(input.style as typeof VALID_TANK_STYLES[number])) {
            errors.push(`Invalid tank style. Must be one of: ${VALID_TANK_STYLES.join(', ')}`)
        }

        // Type validation (if provided)
        if (input.type && !VALID_TANK_TYPES.includes(input.type as typeof VALID_TANK_TYPES[number])) {
            errors.push(`Invalid tank type. Must be one of: ${VALID_TANK_TYPES.join(', ')}`)
        }

        // Description length
        if (input.description && input.description.length > 500) {
            errors.push('Description cannot exceed 500 characters')
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        }
    }

    /**
     * Calculates water volume in liters from dimensions in cm
     * @param width - Width in cm
     * @param height - Height in cm
     * @param length - Length in cm
     * @returns Volume in liters
     */
    calculateWaterVolume(width: number, height: number, length: number): number {
        // Volume in cm³ / 1000 = liters
        // Account for ~90% fill (never fill to the brim)
        const grossVolume = (width * height * length) / 1000
        return Math.round(grossVolume * 0.9 * 100) / 100 // Round to 2 decimal places
    }

    /**
     * Calculates surface area for gas exchange
     * @param width - Width in cm
     * @param length - Length in cm
     * @returns Surface area in cm²
     */
    calculateSurfaceArea(width: number, length: number): number {
        return width * length
    }

    /**
     * Enriches a tank with calculated properties
     * @param tank - The base tank object
     * @returns Tank with additional calculated properties
     */
    enrichTankWithStats(tank: Tank): EnrichedTank {
        return {
            ...tank,
            waterVolume: this.calculateWaterVolume(tank.width, tank.height, tank.length),
            surfaceArea: this.calculateSurfaceArea(tank.width, tank.length),
        }
    }

    /**
     * Enriches multiple tanks with calculated properties
     * @param tanks - Array of tanks
     * @returns Array of enriched tanks
     */
    enrichTanksWithStats(tanks: Tank[]): EnrichedTank[] {
        return tanks.map((tank) => this.enrichTankWithStats(tank))
    }

    /**
     * Checks if user has reached their tank quota
     * @param currentCount - Current number of tanks owned
     * @param maxTanks - Maximum allowed tanks (default 10)
     * @returns true if user can create more tanks
     */
    checkUserQuota(currentCount: number, maxTanks: number = 10): boolean {
        return currentCount < maxTanks
    }

    /**
     * Suggests stocking level based on tank volume
     * @param waterVolume - Volume in liters
     * @returns Suggested fish count (1 inch of fish per gallon rule)
     */
    suggestStockingLevel(waterVolume: number): number {
        // 1 inch of fish per gallon rule (3.78 liters per gallon)
        // This is a conservative estimate
        const gallons = waterVolume / 3.78
        return Math.floor(gallons)
    }

    /**
     * Gets valid tank styles
     */
    getValidStyles(): readonly string[] {
        return VALID_TANK_STYLES
    }

    /**
     * Gets valid tank types
     */
    getValidTypes(): readonly string[] {
        return VALID_TANK_TYPES
    }
}

// Export singleton instance
export const tankEngine = new TankEngineClass()
