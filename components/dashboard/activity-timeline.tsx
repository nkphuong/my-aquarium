"use client"

import Link from "next/link"
import {
  FlaskConical,
  Utensils,
  Wrench,
  Droplets,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Activity {
  id: string
  type: "testing" | "feeding" | "maintenance" | "water_change" | "alert"
  title: string
  description?: string
  timestamp: string
  tankName?: string
}

interface ActivityTimelineProps {
  activities: Activity[]
  maxItems?: number
  className?: string
}

const activityConfig = {
  testing: {
    icon: FlaskConical,
    bgColor: "bg-pastel-sage",
    iconColor: "text-foreground/70",
  },
  feeding: {
    icon: Utensils,
    bgColor: "bg-pastel-yellow",
    iconColor: "text-foreground/70",
  },
  maintenance: {
    icon: Wrench,
    bgColor: "bg-pastel-purple",
    iconColor: "text-foreground/70",
  },
  water_change: {
    icon: Droplets,
    bgColor: "bg-pastel-cream",
    iconColor: "text-foreground/70",
  },
  alert: {
    icon: AlertCircle,
    bgColor: "bg-pastel-peach",
    iconColor: "text-foreground/70",
  },
}

export function ActivityTimeline({
  activities,
  maxItems = 5,
  className,
}: ActivityTimelineProps) {
  const displayedActivities = activities.slice(0, maxItems)

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-white p-4",
        "shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Recent Activity
        </h3>
        <Link
          href="/activity"
          className={cn(
            "flex items-center gap-1 text-xs font-medium text-muted-foreground",
            "transition-colors duration-200",
            "hover:text-ocean-deep"
          )}
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Timeline */}
      {displayedActivities.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No recent activity
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />

          {/* Activity items */}
          <div className="flex flex-col gap-4">
            {displayedActivities.map((activity, index) => {
              const config = activityConfig[activity.type]
              const Icon = config.icon

              return (
                <div key={activity.id} className="relative flex gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                      "ring-4 ring-white",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                        {activity.tankName && (
                          <span className="mt-1 inline-block rounded-full bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {activity.tankName}
                          </span>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-xs text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
