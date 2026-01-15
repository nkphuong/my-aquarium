"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Lightbulb, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LearningTip {
  id: string
  title: string
  shortDescription: string
  category: "care" | "species" | "equipment" | "health"
  linkUrl?: string
}

interface LearningCenterPreviewProps {
  tips: LearningTip[]
  rotationInterval?: number
  className?: string
}

const categoryLabels = {
  care: "Care Tip",
  species: "Species Info",
  equipment: "Equipment",
  health: "Health",
}

export function LearningCenterPreview({
  tips,
  rotationInterval = 8000,
  className,
}: LearningCenterPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (tips.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % tips.length)
        setIsTransitioning(false)
      }, 300)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [tips.length, rotationInterval])

  if (tips.length === 0) {
    return null
  }

  const currentTip = tips[currentIndex]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-pastel-yellow p-5",
        "transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/20 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-14 w-14 rounded-full bg-white/10 blur-lg" />

      {/* Header */}
      <div className="relative mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/40">
          <Lightbulb className="h-4 w-4 text-foreground/70" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          Did you know?
        </span>
      </div>

      {/* Tip content */}
      <div
        className={cn(
          "relative transition-all duration-300",
          isTransitioning && "opacity-0 translate-y-2"
        )}
      >
        <span
          className={cn(
            "mb-2 inline-block rounded-full bg-white/40 px-2 py-0.5",
            "text-[10px] font-medium uppercase tracking-wide text-foreground/60"
          )}
        >
          {categoryLabels[currentTip.category]}
        </span>

        <h3 className="mb-1 font-semibold text-foreground">
          {currentTip.title}
        </h3>
        <p className="text-sm text-foreground/70 line-clamp-3">
          {currentTip.shortDescription}
        </p>
      </div>

      {/* Learn more link */}
      {currentTip.linkUrl && (
        <Link
          href={currentTip.linkUrl}
          className={cn(
            "relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/80",
            "transition-all duration-200",
            "hover:text-foreground hover:gap-2"
          )}
        >
          Learn more
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      {/* Dots indicator */}
      {tips.length > 1 && (
        <div className="relative mt-4 flex items-center justify-center gap-1.5">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsTransitioning(false)
                }, 300)
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-4 bg-foreground/50"
                  : "w-1.5 bg-foreground/20 hover:bg-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
