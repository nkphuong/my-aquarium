"use client"

import { Beaker, Scissors, UtensilsCrossed, LucideIcon } from "lucide-react"
import { clsx } from "clsx"

/**
 * Activity Section Component
 * Displays recent activity log with color-coded icons
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
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
    },
    feeding: {
        icon: UtensilsCrossed,
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    maintenance: {
        icon: Scissors,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
}

export function ActivitySection({ activities }: ActivitySectionProps) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            <div className="bg-card rounded-xl border border-border p-4">
                {activities.map((activity, index) => {
                    const config = activityConfig[activity.type]
                    const Icon = config.icon

                    return (
                        <div
                            key={activity.id}
                            className={clsx(
                                "flex gap-4 p-3 items-start",
                                index < activities.length - 1 && "border-b border-border"
                            )}
                        >
                            <div className={clsx(
                                "p-2 rounded-lg mt-1",
                                config.bgColor,
                                config.iconColor
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-foreground font-semibold text-sm">{activity.title}</h4>
                                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                                </div>
                                <p className="text-muted-foreground text-sm">{activity.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
