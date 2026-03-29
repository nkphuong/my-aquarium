"use client"

/**
 * Dashboard Hero Section
 * Friendly greeting with pastel style and organic decoration
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
        <header className="relative w-full py-8 px-6 md:px-8">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Organic blob shapes */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-warm-coral/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
                <div className="absolute top-10 left-1/3 w-32 h-32 bg-warm-gold/10 rounded-full blur-xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        {greeting}, {userName}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {pendingTasks > 0
                            ? `Let's help you stay on top of your aquariums. You have ${pendingTasks} task${pendingTasks > 1 ? "s" : ""} due.`
                            : "Your aquatic ecosystems are thriving. All tasks are up to date!"}
                    </p>
                </div>

                {/* Quick Action Button */}
                <button
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-[0_4px_16px_rgba(30,107,140,0.3)] hover:shadow-[0_6px_20px_rgba(30,107,140,0.4)] transform hover:-translate-y-0.5 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
                </button>
            </div>
        </header>
    )
}
