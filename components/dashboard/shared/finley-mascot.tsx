"use client"

import { cn } from "@/lib/utils"

interface FinleyMascotProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animated?: boolean
  mood?: "happy" | "thinking" | "alert"
}

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
}

export function FinleyMascot({
  size = "md",
  className,
  animated = true,
  mood = "happy",
}: FinleyMascotProps) {
  const getMouthPath = () => {
    switch (mood) {
      case "thinking":
        return "M 35 42 Q 40 42 45 42" // Straight line
      case "alert":
        return "M 35 44 Q 40 40 45 44" // Slight frown
      default:
        return "M 35 40 Q 40 46 45 40" // Happy smile
    }
  }

  return (
    <div
      className={cn(
        sizeMap[size],
        animated && "animate-float",
        className
      )}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Body */}
        <ellipse
          cx="40"
          cy="40"
          rx="28"
          ry="22"
          className="fill-[#7CC4E4]"
        />

        {/* Body gradient overlay */}
        <ellipse
          cx="40"
          cy="36"
          rx="24"
          ry="16"
          className="fill-[#B8E4F0]"
          opacity="0.6"
        />

        {/* Tail */}
        <path
          d="M 12 40 Q 0 30 8 20 Q 14 28 12 40 Q 14 52 8 60 Q 0 50 12 40"
          className="fill-[#4A9EBF]"
        />

        {/* Top fin */}
        <path
          d="M 35 18 Q 40 8 50 14 Q 48 20 40 22"
          className="fill-[#4A9EBF]"
        />

        {/* Bottom fin */}
        <path
          d="M 38 58 Q 42 68 50 64 Q 48 58 42 56"
          className="fill-[#4A9EBF]"
        />

        {/* Side fin */}
        <ellipse
          cx="32"
          cy="45"
          rx="6"
          ry="4"
          className="fill-[#4A9EBF]"
          transform="rotate(-20 32 45)"
        />

        {/* Eye white */}
        <circle
          cx="52"
          cy="35"
          r="10"
          className="fill-white"
        />

        {/* Eye iris */}
        <circle
          cx="54"
          cy="35"
          r="6"
          className="fill-[#1E6B8C]"
        />

        {/* Eye pupil */}
        <circle
          cx="55"
          cy="34"
          r="3"
          className="fill-[#0F1B2E]"
        />

        {/* Eye highlight */}
        <circle
          cx="56"
          cy="32"
          r="2"
          className="fill-white"
        />

        {/* Blush */}
        <ellipse
          cx="58"
          cy="44"
          rx="4"
          ry="2"
          className="fill-[#F5D5C8]"
          opacity="0.7"
        />

        {/* Mouth */}
        <path
          d={getMouthPath()}
          stroke="#1E6B8C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Scales pattern */}
        <g opacity="0.3">
          <circle cx="30" cy="35" r="3" className="fill-white" />
          <circle cx="25" cy="42" r="2.5" className="fill-white" />
          <circle cx="35" cy="45" r="2.5" className="fill-white" />
          <circle cx="28" cy="50" r="2" className="fill-white" />
        </g>

        {/* Bubbles (only when animated) */}
        {animated && (
          <g className="animate-bubble-rise">
            <circle cx="65" cy="25" r="2" className="fill-white" opacity="0.6" />
            <circle cx="70" cy="18" r="1.5" className="fill-white" opacity="0.4" />
            <circle cx="68" cy="12" r="1" className="fill-white" opacity="0.3" />
          </g>
        )}
      </svg>
    </div>
  )
}
