"use client"

import Link from "next/link"
import { ArrowRight, Waves } from "lucide-react"
import { clsx } from "clsx"

/**
 * Tank Card Component
 * Displays individual tank with friendly pastel styling
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
    parameters?: WaterParameter[]
    inhabitants?: { imageUrl?: string; alt?: string }[]
    totalInhabitants: number
}

export function TankCard({
    id,
    name,
    imageUrl,
    status,
    statusLabel,
    lastTested,
    parameters = [],
    inhabitants = [],
    totalInhabitants,
}: TankCardProps) {
    const statusConfig = {
        healthy: {
            bg: "bg-emerald-500",
            text: "Healthy",
            ring: "ring-emerald-500/20",
        },
        warning: {
            bg: "bg-amber-500",
            text: "Check Required",
            ring: "ring-amber-500/20",
        },
        danger: {
            bg: "bg-red-500 animate-pulse",
            text: "Needs Attention",
            ring: "ring-red-500/30",
        },
    }

    const parameterStatusColors = {
        good: "bg-emerald-500",
        warning: "bg-amber-500",
        danger: "bg-red-500",
    }

    const extraCount = totalInhabitants - inhabitants.length
    const config = statusConfig[status]

    return (
        <div
            className={clsx(
                "group flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden",
                "shadow-sm hover:shadow-lg transition-all duration-300",
                "border border-border hover:border-primary/30",
                status === "danger" && "ring-2 ring-red-500/20"
            )}
        >
            {/* Tank Image */}
            <div
                className="w-full md:w-2/5 min-h-[180px] md:min-h-auto bg-cover bg-center relative"
                style={{
                    backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
                    backgroundColor: imageUrl ? undefined : "hsl(var(--muted))",
                }}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Status badge */}
                <div
                    className={clsx(
                        "absolute top-3 left-3 text-white text-xs font-bold",
                        "px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md",
                        config.bg
                    )}
                >
                    {statusLabel || config.text}
                </div>
            </div>

            {/* Tank Details */}
            <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                        <Waves className="w-4 h-4" />
                        Last tested: {lastTested}
                    </p>
                </div>

                {/* Water Parameters */}
                {parameters.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-4">
                        <p>Water parameters coming soon</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3 py-3">
                        {parameters.map((param) => (
                            <div
                                key={param.label}
                                className="flex flex-col items-center p-2 rounded-xl bg-muted/50"
                            >
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">
                                    {param.label}
                                </span>
                                <span className="text-base font-bold text-foreground flex items-center gap-1">
                                    {param.value}
                                    <span
                                        className={clsx(
                                            "w-1.5 h-1.5 rounded-full",
                                            parameterStatusColors[param.status]
                                        )}
                                    />
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                    {/* Inhabitants avatars */}
                    <div className="flex -space-x-2">
                        {inhabitants.slice(0, 3).map((inhabitant, index) => (
                            <div
                                key={index}
                                className="size-9 rounded-full border-2 border-card bg-muted bg-cover bg-center shadow-sm"
                                style={{
                                    backgroundImage: inhabitant.imageUrl
                                        ? `url("${inhabitant.imageUrl}")`
                                        : undefined,
                                }}
                                title={inhabitant.alt}
                            />
                        ))}
                        {extraCount > 0 && (
                            <div className="size-9 rounded-full border-2 border-card bg-pastel-sage flex items-center justify-center text-xs text-foreground font-bold shadow-sm">
                                +{extraCount}
                            </div>
                        )}
                    </div>

                    {/* Details Button */}
                    <Link
                        href={`/tanks/${id}`}
                        className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-1 group/btn"
                    >
                        Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
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
                <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">My Tanks</h2>
                </div>
                <Link
                    href="/tanks"
                    className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group"
                >
                    View All
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{children}</div>
        </section>
    )
}
