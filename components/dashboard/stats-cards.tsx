"use client"

import { AlertTriangle, Droplets, Fish, LayoutGrid } from "lucide-react"
import { clsx } from "clsx"

/**
 * Stats Cards Section
 * Displays key metrics with pastel card backgrounds
 */

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    badge?: { text: string; type: "success" | "warning" | "danger" }
    subtitle?: string
    pastelColor: "sage" | "peach" | "cream" | "yellow" | "purple" | "coral"
    isAlert?: boolean
}

const pastelColorMap = {
    sage: "bg-warm-seafoam/20",
    peach: "bg-warm-coral/10",
    cream: "bg-warm-cream",
    yellow: "bg-warm-gold/10",
    purple: "bg-primary/5",
    coral: "bg-accent/10",
}

function StatCard({ icon, label, value, badge, subtitle, pastelColor, isAlert }: StatCardProps) {
    return (
        <div
            className={clsx(
                "flex flex-col gap-2 p-5 rounded-2xl transition-all duration-200 relative overflow-hidden",
                "hover:-translate-y-0.5 hover:shadow-lg cursor-pointer",
                pastelColorMap[pastelColor],
                isAlert && "ring-2 ring-destructive/30"
            )}
        >
            {/* Decorative element */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />

            {isAlert && (
                <div className="absolute right-3 top-3 opacity-20">
                    <AlertTriangle className="w-12 h-12 text-destructive" />
                </div>
            )}

            <div className="flex items-center gap-2 text-foreground/70">
                <div className="p-2 rounded-xl bg-white/50 backdrop-blur-sm">
                    {icon}
                </div>
                <span className="text-sm font-semibold">{label}</span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-foreground">{value}</span>
                {badge && (
                    <span
                        className={clsx(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            badge.type === "success" && "bg-primary/20 text-primary",
                            badge.type === "warning" && "bg-amber-500/20 text-amber-700",
                            badge.type === "danger" && "bg-red-500/20 text-red-700"
                        )}
                    >
                        {badge.text}
                    </span>
                )}
            </div>

            {subtitle && (
                <span className="text-xs font-medium text-foreground/60">{subtitle}</span>
            )}
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
                icon={<LayoutGrid className="w-5 h-5 text-foreground/70" />}
                label="Total Tanks"
                value={totalTanks}
                badge={newTanks > 0 ? { text: `+${newTanks} new`, type: "success" } : undefined}
                pastelColor="sage"
            />
            <StatCard
                icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
                label="Active Alerts"
                value={activeAlerts}
                badge={activeAlerts > 0 ? { text: "Needs attention", type: "danger" } : undefined}
                subtitle={activeAlerts === 0 ? "Coming soon" : undefined}
                pastelColor="peach"
                isAlert={activeAlerts > 0}
            />
            <StatCard
                icon={<Droplets className="w-5 h-5 text-foreground/70" />}
                label="Next Water Change"
                value={nextWaterChange.date}
                subtitle={`${nextWaterChange.tankName} (${nextWaterChange.percentage}%)`}
                pastelColor="cream"
            />
            <StatCard
                icon={<Fish className="w-5 h-5 text-foreground/70" />}
                label="Total Inhabitants"
                value={totalInhabitants}
                badge={newBorn > 0 ? { text: `+${newBorn} born`, type: "success" } : undefined}
                subtitle={totalInhabitants === 0 ? "Coming soon" : undefined}
                pastelColor="purple"
            />
        </section>
    )
}
