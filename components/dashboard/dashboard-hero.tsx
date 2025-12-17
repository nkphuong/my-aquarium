"use client"

/**
 * Dashboard Hero Section
 * Features underwater background with gradient, greeting, and action button
 */

interface DashboardHeroProps {
    userName?: string
    pendingTasks?: number
}

function getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
}

export function DashboardHero({ userName = "Aquarist", pendingTasks = 0 }: DashboardHeroProps) {
    const greeting = getGreeting()

    return (
        <header className="relative w-full rounded-2xl overflow-hidden min-h-[240px] shadow-2xl group">
            {/* Background image with gradient overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: `linear-gradient(0deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 100%), url("/images/login-background.jpg")`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10 min-h-[240px]">
                <div className="flex flex-col gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider w-fit">
                        Dashboard
                    </span>
                    <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                        {greeting}, {userName}
                    </h2>
                    <p className="text-gray-300 max-w-lg text-lg">
                        Your ecosystems are thriving.{" "}
                        {pendingTasks > 0
                            ? `You have ${pendingTasks} maintenance task${pendingTasks > 1 ? "s" : ""} scheduled for tomorrow.`
                            : "All maintenance tasks are up to date."}
                    </p>
                </div>
            </div>

            {/* Floating Add Button */}
            <button
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-cyan-500 hover:bg-cyan-600 text-black size-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-110 active:scale-95 group/btn"
                title="Add Log"
            >
                <svg
                    className="w-8 h-8 transition-transform group-hover/btn:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </header>
    )
}
