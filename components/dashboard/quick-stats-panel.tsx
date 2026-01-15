"use client"

import {
  Fish,
  Waves,
  AlertTriangle,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickStat {
  id: string
  label: string
  value: number | string
  icon: "tanks" | "inhabitants" | "alerts" | "streak"
  trend?: "up" | "down" | "stable"
  trendValue?: string
  accentColor?: string
}

interface QuickStatsPanelProps {
  stats: QuickStat[]
  className?: string
}

const iconMap = {
  tanks: Waves,
  inhabitants: Fish,
  alerts: AlertTriangle,
  streak: Flame,
}

const accentColors = {
  tanks: "bg-pastel-sage",
  inhabitants: "bg-pastel-purple",
  alerts: "bg-pastel-peach",
  streak: "bg-pastel-yellow",
}

const trendConfig = {
  up: { icon: TrendingUp, color: "text-green-600" },
  down: { icon: TrendingDown, color: "text-red-500" },
  stable: { icon: Minus, color: "text-muted-foreground" },
}

export function QuickStatsPanel({ stats, className }: QuickStatsPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-white p-4",
        "shadow-sm",
        className
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Quick Stats
      </h3>

      <div className="flex flex-col gap-3">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon]
          const accent = stat.accentColor || accentColors[stat.icon]
          const TrendIcon = stat.trend ? trendConfig[stat.trend].icon : null

          return (
            <div
              key={stat.id}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3",
                "bg-muted/30 transition-colors duration-200",
                "hover:bg-muted/50"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                  accent
                )}
              >
                <Icon className="h-5 w-5 text-foreground/70" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {stat.value}
                  </span>
                  {stat.trend && TrendIcon && stat.trendValue && (
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-xs",
                        trendConfig[stat.trend].color
                      )}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {stat.trendValue}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
