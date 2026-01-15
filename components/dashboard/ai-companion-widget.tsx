"use client"

import { useState } from "react"
import { Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { FinleyMascot } from "./shared/finley-mascot"

interface AICompanionWidgetProps {
  aiName?: string
  tanksCount: number
  onQuestionSubmit?: (question: string) => void
  recentInsight?: string
  className?: string
}

export function AICompanionWidget({
  aiName = "Finley",
  tanksCount,
  onQuestionSubmit,
  recentInsight,
  className,
}: AICompanionWidgetProps) {
  const [question, setQuestion] = useState("")
  const [isThinking, setIsThinking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsThinking(true)
    onQuestionSubmit?.(question)

    // Reset after simulated delay
    setTimeout(() => {
      setQuestion("")
      setIsThinking(false)
    }, 1000)
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-pastel-sage p-6",
        "transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      {/* Decorative blobs */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/20 blur-lg" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ocean-deep" />
            <span className="text-xs font-medium uppercase tracking-wider text-ocean-deep/70">
              Your Aquarium Guide
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Meet {aiName}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isThinking ? (
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ocean-mid" />
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ocean-mid delay-75" />
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ocean-mid delay-150" />
                <span className="ml-1">Thinking...</span>
              </span>
            ) : (
              `Watching over ${tanksCount} tank${tanksCount !== 1 ? "s" : ""}`
            )}
          </p>
        </div>

        {/* Mascot */}
        <div className="flex-shrink-0">
          <FinleyMascot
            size="md"
            mood={isThinking ? "thinking" : "happy"}
            animated
          />
        </div>
      </div>

      {/* Recent Insight */}
      {recentInsight && (
        <div className="relative mt-4 rounded-2xl bg-white/50 p-3 backdrop-blur-sm">
          <p className="text-sm text-foreground/80">
            <span className="font-medium">{aiName} says:</span>{" "}
            {recentInsight}
          </p>
        </div>
      )}

      {/* Question Input */}
      <form onSubmit={handleSubmit} className="relative mt-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask ${aiName} anything...`}
          disabled={isThinking}
          className={cn(
            "w-full rounded-full bg-white/70 px-4 py-3 pr-12",
            "text-sm placeholder:text-muted-foreground/60",
            "border-2 border-transparent",
            "transition-all duration-200",
            "focus:border-ocean-mid focus:bg-white focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <button
          type="submit"
          disabled={!question.trim() || isThinking}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-ocean-deep text-white",
            "transition-all duration-200",
            "hover:bg-ocean-mid hover:scale-105",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
