/**
 * Dashboard Data Adapters
 *
 * Transforms Tank entity data into component-friendly formats.
 * Handles the gap between backend data and UI component requirements.
 */

import type { Tank } from '@/lib/types'

/**
 * Maps tank status string to TankCard status type
 */
function mapTankStatus(status?: string): "healthy" | "warning" | "danger" {
  if (!status) return "healthy"

  const lower = status.toLowerCase()

  // Danger states
  if (lower.includes("danger") ||
    lower.includes("critical") ||
    lower.includes("alert") ||
    lower.includes("emergency")) {
    return "danger"
  }

  // Warning states
  if (lower.includes("warning") ||
    lower.includes("check") ||
    lower.includes("attention")) {
    return "warning"
  }

  // Default to healthy
  return "healthy"
}

/**
 * Adapts Tank entity to TankCard component props
 *
 * Handles missing data gracefully with placeholders for:
 * - Water parameters (coming soon)
 * - Inhabitants (coming soon)
 * - Last tested date (coming soon)
 */
export function adaptTankToCardProps(tank: Tank) {
  return {
    id: tank.id.toString(),
    name: tank.name,
    imageUrl: tank.avatar || undefined,
    status: mapTankStatus(tank.status),
    statusLabel: tank.status,
    lastTested: "Not tracked yet",
    parameters: [],  // Coming soon - will be populated when backend supports it
    inhabitants: [], // Coming soon - will be populated when backend supports it
    totalInhabitants: 0
  }
}

/**
 * Dashboard Stats
 * Calculated from tank data with placeholders for missing features
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

/**
 * Calculates dashboard statistics from tank array
 *
 * Real calculations:
 * - totalTanks: Count of all tanks
 * - newTanks: Tanks setup within last 30 days
 *
 * Placeholders (until backend supports):
 * - activeAlerts: Always 0
 * - nextWaterChange: "Not scheduled"
 * - totalInhabitants: Always 0
 * - newBorn: Always 0
 */
export function calculateDashboardStats(tanks: Tank[]): DashboardStats {
  const totalTanks = tanks.length

  // Calculate new tanks (setup within last 30 days)
  const newTanks = tanks.filter(tank => {
    if (!tank.setupAt) return false

    const setupDate = new Date(tank.setupAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return setupDate > thirtyDaysAgo
  }).length

  return {
    totalTanks,
    newTanks,

    // Coming soon - these will be calculated when backend supports them
    activeAlerts: 0,
    nextWaterChange: {
      date: "Not scheduled",
      tankName: "Configure schedule",
      percentage: 0
    },
    totalInhabitants: 0,
    newBorn: 0
  }
}
