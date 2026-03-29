"use client"

import { Sparkles, ArrowRight, Lightbulb, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AIInsight {
  id: string
  priority: "info" | "suggestion" | "warning" | "critical"
  title: string
  description: string
  tankId?: string
  tankName?: string
  actionLabel: string
  actionType?: "navigate" | "modal" | "external"
}

interface AIInsightsHeroProps {
  insights: AIInsight[]
  aiName?: string
  onInsightAction?: (insight: AIInsight) => void
  onAskQuestion?: () => void
  className?: string
}

const priorityConfig = {
  info: {
    icon: Info,
    dotColor: "bg-primary",
    borderColor: "border-warm-teal-light/30",
    bgColor: "bg-white/60",
  },
  suggestion: {
    icon: Lightbulb,
    dotColor: "bg-warm-gold/10",
    borderColor: "border-warm-gold/30",
    bgColor: "bg-white/60",
  },
  warning: {
    icon: AlertTriangle,
    dotColor: "bg-warm-coral/10",
    borderColor: "border-warm-coral/30",
    bgColor: "bg-warm-coral/10",
  },
  critical: {
    icon: AlertCircle,
    dotColor: "bg-accent/10",
    borderColor: "border-accent/30",
    bgColor: "bg-accent/10",
  },
}

export function AIInsightsHero({
  insights,
  aiName = "Finley",
  onInsightAction,
  onAskQuestion,
  className,
}: AIInsightsHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "bg-warm-cream",
        "p-6 md:p-8",
        className
      )}
    >
      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              AI Insights
            </h2>
            <p className="text-sm text-muted-foreground">
              Personalized insights for your tanks
            </p>
          </div>
        </div>

      </div>

      {/* Insights Grid */}
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {insights.slice(0, 3).map((insight) => {
          const config = priorityConfig[insight.priority]
          const Icon = config.icon

          return (
            <div
              key={insight.id}
              className={cn(
                "group relative rounded-2xl border p-4",
                "backdrop-blur-sm transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-md",
                config.borderColor,
                config.bgColor
              )}
            >
              {/* Priority indicator */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    config.dotColor,
                    insight.priority === "critical" && "animate-pulse"
                  )}
                />
                <Icon className="h-4 w-4 text-muted-foreground" />
                {insight.tankName && (
                  <span className="rounded-full bg-white/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {insight.tankName}
                  </span>
                )}
              </div>

              {/* Content */}
              <h3 className="mb-1 font-medium text-foreground">
                {insight.title}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {insight.description}
              </p>

              {/* Action */}
              <button
                onClick={() => onInsightAction?.(insight)}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium text-primary",
                  "transition-all duration-200",
                  "group-hover:gap-2"
                )}
              >
                {insight.actionLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Ask Finley CTA */}
      <div className="relative mt-6 flex items-center justify-center">
        <button
          onClick={onAskQuestion}
          className={cn(
            "flex items-center gap-2 rounded-full",
            "bg-primary px-6 py-3 text-sm font-medium text-white",
            "transition-all duration-300",
            "hover:bg-primary/90 hover:scale-105 hover:shadow-lg"
          )}
        >
          <Sparkles className="h-4 w-4" />
          Ask {aiName} a Question
        </button>
      </div>
    </div>
  )
}
