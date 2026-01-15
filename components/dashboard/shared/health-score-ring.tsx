"use client"

import { cn } from "@/lib/utils"

interface HealthScoreRingProps {
  score: number // 0-100
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const sizeConfig = {
  sm: {
    width: 48,
    height: 48,
    strokeWidth: 4,
    fontSize: "text-xs",
    labelSize: "text-[8px]",
  },
  md: {
    width: 64,
    height: 64,
    strokeWidth: 5,
    fontSize: "text-sm",
    labelSize: "text-[10px]",
  },
  lg: {
    width: 80,
    height: 80,
    strokeWidth: 6,
    fontSize: "text-base",
    labelSize: "text-xs",
  },
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#C5D5CB" // pastel-sage - healthy
  if (score >= 60) return "#F5E5A8" // pastel-yellow - good
  if (score >= 40) return "#F5D5C8" // pastel-peach - warning
  return "#E8B4A0" // pastel-coral - danger
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Needs Care"
}

export function HealthScoreRing({
  score,
  size = "md",
  showLabel = true,
  className,
}: HealthScoreRingProps) {
  const config = sizeConfig[size]
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: config.width, height: config.height }}
    >
      <svg
        width={config.width}
        height={config.height}
        className="-rotate-90 transform"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-border/30"
        />
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold text-foreground", config.fontSize)}>
          {score}
        </span>
        {showLabel && (
          <span
            className={cn(
              "font-medium uppercase tracking-wide text-muted-foreground",
              config.labelSize
            )}
          >
            {getScoreLabel(score)}
          </span>
        )}
      </div>
    </div>
  )
}
