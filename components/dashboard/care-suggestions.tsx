"use client"

import { ArrowRight, Lightbulb, Wrench, Sparkles } from "lucide-react"
import { clsx } from "clsx"

/**
 * Care Suggestions Section
 * Displays AI-powered care suggestions with pastel styling
 */

interface SuggestionCardProps {
    icon: React.ReactNode
    title: string
    description: string
    actionLabel: string
    onAction?: () => void
    variant: "tip" | "alert"
    pastelColor: "sage" | "peach" | "yellow" | "purple"
}

const pastelColorMap = {
    sage: "bg-pastel-sage",
    peach: "bg-pastel-peach",
    yellow: "bg-pastel-yellow",
    purple: "bg-pastel-purple",
}

function SuggestionCard({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    variant,
    pastelColor,
}: SuggestionCardProps) {
    return (
        <div
            className={clsx(
                "p-4 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.01]",
                variant === "alert"
                    ? "bg-pastel-peach ring-1 ring-destructive/20"
                    : pastelColorMap[pastelColor]
            )}
        >
            {/* Decorative blob */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/30 rounded-full blur-xl" />

            <div className="flex items-start gap-3 relative z-10">
                <div
                    className={clsx(
                        "p-2 rounded-xl",
                        variant === "alert"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-white/50 text-primary"
                    )}
                >
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="text-foreground font-bold text-sm mb-1">{title}</h4>
                    <p className="text-foreground/70 text-xs leading-relaxed mb-3">
                        {description}
                    </p>
                    <button
                        onClick={onAction}
                        className={clsx(
                            "text-xs font-bold uppercase tracking-wide flex items-center gap-1 transition-all hover:gap-2",
                            variant === "alert"
                                ? "text-destructive hover:text-destructive/80"
                                : "text-primary hover:text-primary/80"
                        )}
                    >
                        {actionLabel} <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    )
}

interface CareSuggestionsProps {
    suggestions?: Array<{
        id: string
        type: "lighting" | "filter" | "water" | "other"
        title: string
        description: string
        actionLabel: string
        priority: "normal" | "high"
    }>
}

export function CareSuggestions({ suggestions }: CareSuggestionsProps) {
    // Default suggestions if none provided
    const defaultSuggestions = [
        {
            id: "1",
            type: "lighting" as const,
            title: "Adjust Lighting",
            description:
                "Algae growth detected in the Reef Tank. Consider reducing photoperiod by 1 hour.",
            actionLabel: "Adjust Schedule",
            priority: "normal" as const,
        },
        {
            id: "2",
            type: "filter" as const,
            title: "Filter Maintenance Due",
            description: "Canister filter cleaning for 55g Community is due in 2 days.",
            actionLabel: "Mark Complete",
            priority: "high" as const,
        },
    ]

    const items = suggestions || defaultSuggestions

    const pastelColors: Array<"sage" | "yellow" | "purple"> = ["sage", "yellow", "purple"]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Care Suggestions</h2>
            </div>
            <div className="flex flex-col gap-3">
                {items.map((suggestion, index) => (
                    <SuggestionCard
                        key={suggestion.id}
                        icon={
                            suggestion.priority === "high" ? (
                                <Wrench className="w-5 h-5" />
                            ) : (
                                <Lightbulb className="w-5 h-5" />
                            )
                        }
                        title={suggestion.title}
                        description={suggestion.description}
                        actionLabel={suggestion.actionLabel}
                        variant={suggestion.priority === "high" ? "alert" : "tip"}
                        pastelColor={pastelColors[index % pastelColors.length]}
                    />
                ))}
            </div>
        </div>
    )
}
