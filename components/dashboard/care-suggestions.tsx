"use client"

import { ArrowRight, Lightbulb, Wrench } from "lucide-react"

/**
 * Care Suggestions Section
 * Displays AI-powered care suggestions and maintenance alerts
 */

interface SuggestionCardProps {
    icon: React.ReactNode
    title: string
    description: string
    actionLabel: string
    onAction?: () => void
    variant: "gradient" | "alert"
}

function SuggestionCard({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    variant,
}: SuggestionCardProps) {
    if (variant === "gradient") {
        return (
            <div className="bg-gradient-to-br from-sky-900 to-sky-700 p-5 rounded-xl border border-cyan-500/20 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
                <div className="flex items-start gap-3 relative z-10">
                    <div className="text-cyan-400">{icon}</div>
                    <div>
                        <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                        <p className="text-gray-300 text-xs leading-relaxed mb-3">{description}</p>
                        <button
                            onClick={onAction}
                            className="text-cyan-400 hover:text-white text-xs font-bold uppercase tracking-wide flex items-center gap-1 transition-colors"
                        >
                            {actionLabel} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-200 dark:border-red-900/30">
            <div className="flex items-start gap-3">
                <div className="text-red-500">{icon}</div>
                <div>
                    <h4 className="text-foreground font-bold text-sm mb-1">{title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">{description}</p>
                    <button
                        onClick={onAction}
                        className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                        {actionLabel}
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

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">Care Suggestions</h2>
            <div className="flex flex-col gap-3">
                {items.map((suggestion) => (
                    <SuggestionCard
                        key={suggestion.id}
                        icon={
                            suggestion.priority === "high" ? (
                                <Wrench className="w-6 h-6" />
                            ) : (
                                <Lightbulb className="w-6 h-6" />
                            )
                        }
                        title={suggestion.title}
                        description={suggestion.description}
                        actionLabel={suggestion.actionLabel}
                        variant={suggestion.priority === "high" ? "alert" : "gradient"}
                    />
                ))}
            </div>
        </div>
    )
}
