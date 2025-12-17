"use client"

import { AlertTriangle, Droplets, Fish, LayoutGrid } from "lucide-react"
import { clsx } from "clsx"

/**
 * Stats Cards Section
 * Displays key metrics: Total Tanks, Active Alerts, Next Water Change, Total Inhabitants
 */

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    badge?: { text: string; type: "success" | "warning" | "danger" }
    subtitle?: string
    warningBackground?: boolean
}

function StatCard({ icon, label, value, badge, subtitle, warningBackground }: StatCardProps) {
    return (
        <div
            className={clsx(
                "flex flex-col gap-1 p-5 rounded-xl bg-card border border-border",
                "shadow-sm hover:shadow-md transition-shadow relative overflow-hidden",
                warningBackground && "bg-red-950/20"
            )}
        >
            {warningBackground && (
                <div className="absolute right-0 top-0 p-2 opacity-10">
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{value}</span>
                {badge && (
                    <span
                        className={clsx(
                            "text-sm font-medium",
                            badge.type === "success" && "text-emerald-500",
                            badge.type === "warning" && "text-amber-500",
                            badge.type === "danger" && "text-red-400"
                        )}
                    >
                        {badge.text}
                    </span>
                )}
            </div>
            {subtitle && <span className="text-xs font-medium text-muted-foreground">{subtitle}</span>}
        </div>
    )
}

interface StatsCardsProps {
    totalTanks: number
    newTanks?: number
    activeAlerts: number
    nextWaterChange: { date: string; tankName: string; percentage: number }
    totalInhabitants: number
    newBorn?: number
}

export function StatsCards({
    totalTanks,
    newTanks = 0,
    activeAlerts,
    nextWaterChange,
    totalInhabitants,
    newBorn = 0,
}: StatsCardsProps) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon={<LayoutGrid className="w-5 h-5" />}
                label="Total Tanks"
                value={totalTanks}
                badge={newTanks > 0 ? { text: `+${newTanks} new`, type: "success" } : undefined}
            />
            <StatCard
                icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
                label="Active Alerts"
                value={activeAlerts}
                badge={activeAlerts > 0 ? { text: "Needs attention", type: "danger" } : undefined}
                warningBackground={activeAlerts > 0}
            />
            <StatCard
                icon={<Droplets className="w-5 h-5" />}
                label="Next Water Change"
                value={nextWaterChange.date}
                subtitle={`${nextWaterChange.tankName} (${nextWaterChange.percentage}%)`}
            />
            <StatCard
                icon={<Fish className="w-5 h-5" />}
                label="Total Inhabitants"
                value={totalInhabitants}
                badge={newBorn > 0 ? { text: `+${newBorn} born`, type: "success" } : undefined}
            />
        </section>
    )
}
