"use client"

import { Beaker, Scissors, UtensilsCrossed, LucideIcon, Clock } from "lucide-react"
import { clsx } from "clsx"

/**
 * Activity Section Component
 * Displays recent activity log with pastel-colored icons
 */

type ActivityType = "testing" | "feeding" | "maintenance"

interface ActivityEntry {
    id: string
    type: ActivityType
    title: string
    description: string
    timestamp: string
}

interface ActivitySectionProps {
    activities: ActivityEntry[]
}

const activityConfig: Record<
    ActivityType,
    { icon: LucideIcon; bgColor: string; iconColor: string }
> = {
    testing: {
        icon: Beaker,
        bgColor: "bg-pastel-sage",
        iconColor: "text-emerald-700",
    },
    feeding: {
        icon: UtensilsCrossed,
        bgColor: "bg-pastel-yellow",
        iconColor: "text-amber-700",
    },
    maintenance: {
        icon: Scissors,
        bgColor: "bg-pastel-purple",
        iconColor: "text-purple-700",
    },
}

export function ActivitySection({ activities }: ActivitySectionProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {activities.map((activity, index) => {
                    const config = activityConfig[activity.type]
                    const Icon = config.icon

                    return (
                        <div
                            key={activity.id}
                            className={clsx(
                                "flex gap-4 p-4 items-start transition-colors hover:bg-muted/30",
                                index < activities.length - 1 && "border-b border-border"
                            )}
                        >
                            <div
                                className={clsx(
                                    "p-2.5 rounded-xl",
                                    config.bgColor,
                                    config.iconColor
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-foreground font-semibold text-sm truncate">
                                        {activity.title}
                                    </h4>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {activity.timestamp}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    )
                })}

                {activities.length === 0 && (
                    <div className="p-8 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pastel-sage flex items-center justify-center">
                            <Clock className="w-6 h-6 text-emerald-700" />
                        </div>
                        <p className="text-muted-foreground text-sm">No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    )
}
