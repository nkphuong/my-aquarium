"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Droplets,
  FlaskConical,
  Utensils,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Fish,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HealthScoreRing } from "./shared/health-score-ring"

export interface WaterParameter {
  label: string
  value: string | number
  unit?: string
  status: "good" | "warning" | "danger"
}

export interface TankHealthCardProps {
  id: string
  name: string
  imageUrl?: string
  healthScore: number
  trend: "improving" | "stable" | "declining"
  lastTested: string
  parameters?: WaterParameter[]
  totalInhabitants: number
  className?: string
}

const trendConfig = {
  improving: {
    icon: TrendingUp,
    label: "Improving",
    color: "text-green-600",
  },
  stable: {
    icon: Minus,
    label: "Stable",
    color: "text-muted-foreground",
  },
  declining: {
    icon: TrendingDown,
    label: "Declining",
    color: "text-orange-600",
  },
}

const statusColors = {
  good: "text-green-600 bg-green-50",
  warning: "text-orange-600 bg-orange-50",
  danger: "text-red-600 bg-red-50",
}

export function TankHealthCard({
  id,
  name,
  imageUrl,
  healthScore,
  trend,
  lastTested,
  parameters = [],
  totalInhabitants,
  className,
}: TankHealthCardProps) {
  const TrendIcon = trendConfig[trend].icon

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white",
        "border border-border/50 shadow-sm",
        "transition-all duration-300",
        "hover:shadow-md hover:border-border",
        className
      )}
    >
      {/* Header with image */}
      <div className="relative h-32 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pastel-sage to-pastel-cream">
            <Fish className="h-12 w-12 text-ocean-mid/40" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Health Score Badge */}
        <div className="absolute right-3 top-3">
          <HealthScoreRing score={healthScore} size="sm" showLabel={false} />
        </div>

        {/* Tank name */}
        <div className="absolute bottom-3 left-3 right-16">
          <h3 className="font-semibold text-white line-clamp-1">{name}</h3>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Fish className="h-3 w-3" />
              {totalInhabitants}
            </span>
            <span>•</span>
            <span className={cn("flex items-center gap-1", trendConfig[trend].color.replace("text-", "text-white/"))}>
              <TrendIcon className="h-3 w-3" />
              {trendConfig[trend].label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Parameters */}
        {parameters.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            {parameters.slice(0, 3).map((param, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-center",
                  statusColors[param.status]
                )}
              >
                <div className="text-xs font-medium opacity-70">
                  {param.label}
                </div>
                <div className="text-sm font-semibold">
                  {param.value}
                  {param.unit && (
                    <span className="text-xs font-normal">{param.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Last tested */}
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Last tested: {lastTested}</span>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg",
              "bg-pastel-sage/50 px-3 py-2 text-xs font-medium",
              "transition-all duration-200",
              "hover:bg-pastel-sage"
            )}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Test
          </button>
          <button
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg",
              "bg-pastel-yellow/50 px-3 py-2 text-xs font-medium",
              "transition-all duration-200",
              "hover:bg-pastel-yellow"
            )}
          >
            <Utensils className="h-3.5 w-3.5" />
            Feed
          </button>
          <button
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg",
              "bg-pastel-purple/50 px-3 py-2 text-xs font-medium",
              "transition-all duration-200",
              "hover:bg-pastel-purple"
            )}
          >
            <Droplets className="h-3.5 w-3.5" />
            Water
          </button>
        </div>

        {/* View details link */}
        <Link
          href={`/tanks/${id}`}
          className={cn(
            "mt-3 flex items-center justify-center gap-1 rounded-lg",
            "border border-border/50 px-3 py-2 text-xs font-medium text-muted-foreground",
            "transition-all duration-200",
            "hover:border-ocean-mid hover:text-ocean-deep"
          )}
        >
          View Details
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
