"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { clsx } from "clsx"

/**
 * Tank Card Component
 * Displays individual tank with image, status, water parameters, and inhabitants
 */

interface WaterParameter {
    label: string
    value: string | number
    unit?: string
    status: "good" | "warning" | "danger"
}

interface TankCardProps {
    id: string
    name: string
    imageUrl?: string
    status: "healthy" | "warning" | "danger"
    statusLabel?: string
    lastTested: string
    parameters: WaterParameter[]
    inhabitants: { imageUrl?: string; alt?: string }[]
    totalInhabitants: number
}

export function TankCard({
    id,
    name,
    imageUrl,
    status,
    statusLabel,
    lastTested,
    parameters,
    inhabitants,
    totalInhabitants,
}: TankCardProps) {
    const statusColors = {
        healthy: "bg-emerald-500",
        warning: "bg-amber-500",
        danger: "bg-red-500 animate-pulse",
    }

    const statusLabels = {
        healthy: "Healthy",
        warning: "Check Required",
        danger: "Check Filter",
    }

    const parameterStatusColors = {
        good: "bg-emerald-500",
        warning: "bg-amber-500",
        danger: "bg-red-500",
    }

    const extraCount = totalInhabitants - inhabitants.length

    return (
        <div
            className={clsx(
                "group flex flex-col md:flex-row bg-card rounded-xl border overflow-hidden",
                "shadow-sm hover:shadow-lg transition-all",
                status === "danger"
                    ? "border-red-500/30 hover:border-red-500/50"
                    : "border-border hover:border-cyan-500/30"
            )}
        >
            {/* Tank Image */}
            <div
                className="w-full md:w-1/3 min-h-[200px] md:min-h-auto bg-cover bg-center relative"
                style={{
                    backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
                    backgroundColor: imageUrl ? undefined : "hsl(var(--muted))",
                }}
            >
                <div
                    className={clsx(
                        "absolute top-3 left-3 text-white text-[10px] font-bold",
                        "px-2 py-1 rounded-full uppercase tracking-wide shadow-sm",
                        statusColors[status]
                    )}
                >
                    {statusLabel || statusLabels[status]}
                </div>
            </div>

            {/* Tank Details */}
            <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
                    <p className="text-muted-foreground text-sm">Last tested: {lastTested}</p>
                </div>

                {/* Water Parameters */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-border">
                    {parameters.map((param, index) => (
                        <div
                            key={param.label}
                            className={clsx(
                                "flex flex-col",
                                index > 0 && "border-l border-border pl-4"
                            )}
                        >
                            <span className="text-xs text-muted-foreground uppercase font-semibold">
                                {param.label}
                            </span>
                            <span className="text-lg font-bold text-foreground flex items-center gap-1">
                                {param.value}
                                {param.unit && param.unit}
                                <span
                                    className={clsx(
                                        "w-2 h-2 rounded-full",
                                        parameterStatusColors[param.status]
                                    )}
                                />
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-1">
                    {/* Inhabitants avatars */}
                    <div className="flex -space-x-2">
                        {inhabitants.slice(0, 2).map((inhabitant, index) => (
                            <div
                                key={index}
                                className="size-8 rounded-full border-2 border-card bg-muted bg-cover bg-center"
                                style={{
                                    backgroundImage: inhabitant.imageUrl
                                        ? `url("${inhabitant.imageUrl}")`
                                        : undefined,
                                }}
                                title={inhabitant.alt}
                            />
                        ))}
                        {extraCount > 0 && (
                            <div className="size-8 rounded-full border-2 border-card bg-muted-foreground flex items-center justify-center text-[10px] text-background font-medium">
                                +{extraCount}
                            </div>
                        )}
                    </div>

                    {/* Details Button */}
                    <Link
                        href={`/tanks/${id}`}
                        className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-cyan-500 hover:text-black text-sm font-semibold transition-all"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

/**
 * Tanks Section Component
 * Wrapper for tank cards with header and "View All" link
 */
interface TanksSectionProps {
    children: React.ReactNode
}

export function TanksSection({ children }: TanksSectionProps) {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">My Tanks</h2>
                <Link
                    href="/tanks"
                    className="text-sm font-medium text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                >
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{children}</div>
        </section>
    )
}
