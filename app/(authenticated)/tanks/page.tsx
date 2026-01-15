"use client"

import { useState } from "react"
import { Search, Plus, Fish, Leaf, Calendar, Lightbulb, Droplets } from "lucide-react"
import TankCardList from "@/components/tanks/tank-card-list"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { clsx } from "clsx"

/**
 * Tanks List Page
 * Overview of all user's aquarium tanks with filtering and search
 */


const filterTabs = [
  { id: "all", label: "All Tanks" },
  { id: "freshwater", label: "Freshwater" },
  { id: "saltwater", label: "Saltwater" },
  { id: "brackish", label: "Brackish" },
  { id: "quarantine", label: "Quarantine" },
]


function StatIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "fish":
      return <Fish className={className} />
    case "plant":
      return <Leaf className={className} />
    case "coral":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )
    case "shrimp":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 9c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-1.17L16 19.5l-1.41-1.39-2.12 2.12-1.41-1.41 2.12-2.12L12 15.5l1.17-1.17L11 12.17V11h1.17L14 8.83V7H8v10h2v-4l3.5 3.5-1.96 1.96 1.41 1.41 1.96-1.96L17 20v-5h2V9z" />
        </svg>
      )
    case "calendar":
      return <Calendar className={className} />
    default:
      return null
  }
}



export default function TanksPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession();
  const router = useRouter()

  // Filter tanks based on active filter and search
  const handleClickCreateTank = () => {
    router.push('/tanks/create')
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-12 gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border">
        <div className="flex flex-col gap-2">
          <h1 className="text-dark-primary text-4xl sm:text-5xl font-black leading-tight tracking-tight">
            My Tanks
          </h1>
          <p className="text-dark-secondary text-base sm:text-lg">
            Welcome back! Your underwater worlds look thriving today.
          </p>
        </div>
        <button onClick={handleClickCreateTank} className="group flex items-center gap-2 h-12 px-6 rounded-full btn-primary-glow text-base">
          <Plus className="w-5 h-5" />
          <span>Add New Tank</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search */}
        <label className="flex min-w-[300px] h-12 w-full lg:w-auto lg:flex-1 max-w-lg relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-secondary group-focus-within:text-emerald-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            className="flex w-full h-full rounded-2xl border-none bg-card text-dark-primary placeholder:text-dark-secondary pl-10 pr-4 text-base focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            placeholder="Search tanks by name, style, or inhabitants..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={clsx(
                "flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors",
                activeFilter === tab.id
                  ? "bg-foreground text-background font-bold"
                  : "bg-card text-dark-secondary hover:bg-secondary border border-surface-light font-medium"
              )}
            >
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tank Grid */}
      <TankCardList jwtToken={session?.accessToken || ""} onCreateTank={handleClickCreateTank} />


      {/* Tips Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 p-6 rounded-card-lg border border-transparent flex gap-4 items-center">
          <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-bold text-dark-primary mb-1">Tip of the day</h4>
            <p className="text-sm text-dark-secondary">
              Regular 20% water changes help maintain stable water parameters and reduce algae
              growth.
            </p>
          </div>
        </div>
        <div className="bg-blue-500/10 p-6 rounded-card-lg border border-transparent flex gap-4 items-center">
          <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h4 className="font-bold text-dark-primary mb-1">Water Quality Alert</h4>
            <p className="text-sm text-dark-secondary">
              Your filter media replacement for "Bedroom Reef" is due in 3 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}