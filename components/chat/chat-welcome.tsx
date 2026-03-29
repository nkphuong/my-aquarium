"use client"

import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatWelcomeProps {
  onSuggestionClick: (suggestion: string) => void
  className?: string
}

const suggestions = [
  "What temperature is best for my tank?",
  "Are my fish compatible with each other?",
  "How do I cycle a new aquarium?",
  "My water looks cloudy, what should I do?",
  "What fish would you recommend for a beginner?",
  "How often should I do water changes?",
]

export function ChatWelcome({
  onSuggestionClick,
  className,
}: ChatWelcomeProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-4 py-12",
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>

      <div className="mt-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            How can I help?
          </h2>
        </div>
        <p className="mx-auto max-w-md text-muted-foreground">
          Your aquarium buddy. Ask me anything about fish care, water
          chemistry, tank setup, or your specific aquarium setup!
        </p>
      </div>

      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className={cn(
              "rounded-2xl border border-border/40 bg-white/60 px-4 py-3",
              "text-left text-sm text-muted-foreground",
              "transition-all duration-200",
              "hover:border-primary/30 hover:bg-white hover:text-foreground hover:shadow-sm",
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
