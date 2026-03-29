/**
 * Dashboard Engine - Business Logic Layer (IDesign)
 *
 * Transforms Tank entity data into dashboard-friendly formats.
 * Handles data enrichment, status mapping, and statistics calculation.
 *
 * Responsibilities:
 * - Tank status classification
 * - Dashboard statistics calculation
 * - Data transformation for UI components
 */

import type { Tank } from '@/lib/types'

/**
 * Health status for UI display
 */
export type TankHealthStatus = 'healthy' | 'warning' | 'danger'

/**
 * Tank card props for dashboard display
 */
export interface TankCardProps {
    id: string
    name: string
    imageUrl?: string
    status: TankHealthStatus
    statusLabel?: string
    lastTested: string
    parameters: Array<{ name: string; value: string; status: TankHealthStatus }>
    inhabitants: Array<{ name: string; count: number }>
    totalInhabitants: number
}

/**
 * Dashboard statistics overview
 */
export interface DashboardStats {
    totalTanks: number
    newTanks: number
    activeAlerts: number
    nextWaterChange: {
        date: string
        tankName: string
        percentage: number
    }
    totalInhabitants: number
    newBorn: number
}

class DashboardEngineClass {
    /**
     * Maps tank status string to health status enum
     * @param status - Raw status string from backend
     * @returns Normalized health status
     */
    mapTankStatus(status?: string): TankHealthStatus {
        if (!status) return 'healthy'

        const lower = status.toLowerCase()

        // Danger states
        if (
            lower.includes('danger') ||
            lower.includes('critical') ||
            lower.includes('alert') ||
            lower.includes('emergency')
        ) {
            return 'danger'
        }

        // Warning states
        if (
            lower.includes('warning') ||
            lower.includes('check') ||
            lower.includes('attention')
        ) {
            return 'warning'
        }

        // Default to healthy
        return 'healthy'
    }

    /**
     * Adapts Tank entity to TankCard component props
     * @param tank - Tank entity from backend
     * @returns Props suitable for TankCard component
     */
    adaptTankToCardProps(tank: Tank): TankCardProps {
        return {
            id: tank.id.toString(),
            name: tank.name,
            imageUrl: tank.avatar || undefined,
            status: this.mapTankStatus(tank.status),
            statusLabel: tank.status,
            lastTested: 'Not tracked yet',
            parameters: [], // Coming soon - water parameters
            inhabitants: [], // Coming soon - fish/plant list
            totalInhabitants: 0,
        }
    }

    /**
     * Adapts multiple tanks to card props
     * @param tanks - Array of tank entities
     * @returns Array of tank card props
     */
    adaptTanksToCardProps(tanks: Tank[]): TankCardProps[] {
        return tanks.map((tank) => this.adaptTankToCardProps(tank))
    }

    /**
     * Calculates dashboard statistics from tank array
     * @param tanks - Array of tank entities
     * @returns Dashboard statistics
     */
    calculateDashboardStats(tanks: Tank[]): DashboardStats {
        const totalTanks = tanks.length

        // Calculate new tanks (setup within last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const newTanks = tanks.filter((tank) => {
            if (!tank.setupAt) return false
            const setupDate = new Date(tank.setupAt)
            return setupDate > thirtyDaysAgo
        }).length

        // Count tanks with warning/danger status
        const activeAlerts = tanks.filter((tank) => {
            const status = this.mapTankStatus(tank.status)
            return status === 'warning' || status === 'danger'
        }).length

        return {
            totalTanks,
            newTanks,
            activeAlerts,
            // Placeholders until backend supports scheduling
            nextWaterChange: {
                date: 'Not scheduled',
                tankName: 'Configure schedule',
                percentage: 0,
            },
            totalInhabitants: 0,
            newBorn: 0,
        }
    }

    /**
     * Gets tanks that need attention (warning or danger status)
     * @param tanks - Array of tank entities
     * @returns Tanks requiring attention
     */
    getTanksNeedingAttention(tanks: Tank[]): Tank[] {
        return tanks.filter((tank) => {
            const status = this.mapTankStatus(tank.status)
            return status === 'warning' || status === 'danger'
        })
    }

    /**
     * Sorts tanks by priority (danger first, then warning, then healthy)
     * @param tanks - Array of tank entities
     * @returns Sorted array
     */
    sortTanksByPriority(tanks: Tank[]): Tank[] {
        const priorityOrder: Record<TankHealthStatus, number> = {
            danger: 0,
            warning: 1,
            healthy: 2,
        }

        return [...tanks].sort((a, b) => {
            const aStatus = this.mapTankStatus(a.status)
            const bStatus = this.mapTankStatus(b.status)
            return priorityOrder[aStatus] - priorityOrder[bStatus]
        })
    }

    /**
     * Filters tanks by health status
     * @param tanks - Array of tank entities
     * @param status - Status to filter by
     * @returns Filtered tanks
     */
    filterTanksByStatus(tanks: Tank[], status: TankHealthStatus): Tank[] {
        return tanks.filter((tank) => this.mapTankStatus(tank.status) === status)
    }
}

// Export singleton instance
export const dashboardEngine = new DashboardEngineClass()

// Re-export types for convenience
export type { Tank }
