"use client"

import {
  Droplets,
  Wrench,
  Utensils,
  FlaskConical,
  Settings,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface PriorityTask {
  id: string
  type: "water_change" | "filter_clean" | "feeding" | "testing" | "maintenance"
  title: string
  tankName: string
  dueStatus: "overdue" | "due_now" | "tomorrow" | "upcoming"
  scheduledFor?: Date
}

interface PriorityTasksGridProps {
  tasks: PriorityTask[]
  onTaskClick?: (task: PriorityTask) => void
  onMarkComplete?: (taskId: string) => void
  className?: string
}

const taskTypeConfig = {
  water_change: {
    icon: Droplets,
    bgColor: "bg-pastel-sage",
    iconBg: "bg-white/40",
  },
  filter_clean: {
    icon: Wrench,
    bgColor: "bg-pastel-purple",
    iconBg: "bg-white/40",
  },
  feeding: {
    icon: Utensils,
    bgColor: "bg-pastel-yellow",
    iconBg: "bg-white/40",
  },
  testing: {
    icon: FlaskConical,
    bgColor: "bg-pastel-peach",
    iconBg: "bg-white/40",
  },
  maintenance: {
    icon: Settings,
    bgColor: "bg-pastel-cream",
    iconBg: "bg-white/40",
  },
}

const dueStatusConfig = {
  overdue: {
    label: "Overdue",
    textColor: "text-red-600",
    icon: AlertCircle,
    animate: true,
  },
  due_now: {
    label: "Due now",
    textColor: "text-orange-600",
    icon: Clock,
    animate: false,
  },
  tomorrow: {
    label: "Tomorrow",
    textColor: "text-muted-foreground",
    icon: Clock,
    animate: false,
  },
  upcoming: {
    label: "Upcoming",
    textColor: "text-muted-foreground",
    icon: Clock,
    animate: false,
  },
}

export function PriorityTasksGrid({
  tasks,
  onTaskClick,
  onMarkComplete,
  className,
}: PriorityTasksGridProps) {
  if (tasks.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-border/50 p-8",
          "flex flex-col items-center justify-center text-center",
          className
        )}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pastel-sage/50">
          <Check className="h-6 w-6 text-ocean-deep" />
        </div>
        <p className="font-medium text-foreground">All caught up!</p>
        <p className="text-sm text-muted-foreground">
          No tasks due right now. Great job!
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {tasks.map((task) => {
        const typeConfig = taskTypeConfig[task.type]
        const statusConfig = dueStatusConfig[task.dueStatus]
        const Icon = typeConfig.icon
        const StatusIcon = statusConfig.icon

        return (
          <div
            key={task.id}
            onClick={() => onTaskClick?.(task)}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-2xl p-5",
              "transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-lg",
              typeConfig.bgColor
            )}
          >
            {/* Decorative blob */}
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-white/10 blur-lg" />

            {/* Icon */}
            <div
              className={cn(
                "relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                typeConfig.iconBg
              )}
            >
              <Icon className="h-5 w-5 text-foreground/80" />
            </div>

            {/* Content */}
            <div className="relative">
              <h3 className="font-medium text-foreground line-clamp-1">
                {task.title}
              </h3>
              <p className="mt-0.5 text-sm text-foreground/60 line-clamp-1">
                {task.tankName}
              </p>

              {/* Due status */}
              <div
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-xs font-medium",
                  statusConfig.textColor
                )}
              >
                <StatusIcon
                  className={cn(
                    "h-3.5 w-3.5",
                    statusConfig.animate && "animate-pulse"
                  )}
                />
                {statusConfig.label}
              </div>
            </div>

            {/* Quick complete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkComplete?.(task.id)
              }}
              className={cn(
                "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full",
                "bg-white/50 opacity-0 backdrop-blur-sm",
                "transition-all duration-200",
                "hover:bg-white hover:scale-110",
                "group-hover:opacity-100"
              )}
            >
              <Check className="h-4 w-4 text-foreground/70" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
