"use client"

import { cn } from "@/lib/utils"

interface DashboardGreetingProps {
  userName?: string
  subtitle?: string
  className?: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getTankStatus(alertCount?: number): string {
  if (alertCount && alertCount > 0) {
    return `You have ${alertCount} item${alertCount > 1 ? "s" : ""} that need${alertCount === 1 ? "s" : ""} attention`
  }
  return "Your tanks are looking healthy today"
}

export function DashboardGreeting({
  userName = "Aquarist",
  subtitle,
  className,
}: DashboardGreetingProps) {
  const greeting = getGreeting()

  return (
    <div className={cn("py-2", className)}>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        {greeting}, {userName}!{" "}
        <span className="inline-block animate-wave origin-bottom-right">
          👋
        </span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        {subtitle || getTankStatus()}
      </p>
    </div>
  )
}
