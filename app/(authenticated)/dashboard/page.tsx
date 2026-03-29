"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// ✅ Dynamic imports for lucide icons - tree-shakeable and TypeScript-safe
const Clock = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Clock })))
const Waves = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Waves })))
import {
  DashboardGreeting,
  AICompanionWidget,
  AIInsightsHero,
  PriorityTasksGrid,
  TankHealthCard,
  QuickStatsPanel,
  ActivityTimeline,
  LearningCenterPreview,
} from "@/components/dashboard"
import type {
  AIInsight,
  PriorityTask,
  Activity,
  LearningTip,
} from "@/components/dashboard"
import { getInsights } from "@/actions/chat.actions"

/**
 * Dashboard Page - AI-First Aquarium Companion
 * Warm Aquatic palette with AI insights as the hero feature
 */

// ✅ Hoist static mock data outside component to prevent recreation
const mockPriorityTasks: PriorityTask[] = [
  {
    id: "1",
    type: "water_change",
    title: "20% Water Change",
    tankName: "55g Planted Community",
    dueStatus: "due_now",
  },
  {
    id: "2",
    type: "testing",
    title: "Test Water Parameters",
    tankName: "20g Nano Reef",
    dueStatus: "tomorrow",
  },
  {
    id: "3",
    type: "filter_clean",
    title: "Clean Filter Media",
    tankName: "55g Planted Community",
    dueStatus: "upcoming",
  },
  {
    id: "4",
    type: "feeding",
    title: "Feed Frozen Food",
    tankName: "20g Nano Reef",
    dueStatus: "due_now",
  },
]

const mockAIInsights: AIInsight[] = [
  {
    id: "1",
    priority: "suggestion",
    title: "Perfect Time for Plant Trimming",
    description:
      "Your Rotala rotundifolia has grown 3 inches this week. Trimming now will encourage bushier growth and better light penetration.",
    tankName: "55g Planted",
    actionLabel: "View guide",
  },
  {
    id: "2",
    priority: "warning",
    title: "Nitrate Levels Rising",
    description:
      "I've noticed your nitrates have been gradually increasing over the past week. A water change soon would help maintain optimal levels.",
    tankName: "20g Nano Reef",
    actionLabel: "Schedule change",
  },
  {
    id: "3",
    priority: "info",
    title: "Consistent Care Streak!",
    description:
      "You've maintained a perfect testing schedule for 14 days. Your fish are thriving thanks to your dedication!",
    actionLabel: "View stats",
  },
]

const mockTanks = [
  {
    id: "1",
    name: "55g Planted Community",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMpfliVZBIoPCjxQjGHx1hC5Jesi2QED30cTQwjCdK_BKxQJ4KHHABMB5Po83o06baaaDr61iF1b97SG82U8KGpw__JlUJodNqZVrF-hCSaIJ3hvGP1LQ_yKvDFfwnAn8oegh3yvbdieUMnownRBuwqpk4CiQJqPtnEAexA30g4HUvdZ1Yq9wigortpOadeWX4jPWrtoGMBr-ajObvceVBWAYETo-jSM1pB-cgoK-5w9CazEVejJOrdvgT4ZAyIbfn2yk018Km1l0",
    healthScore: 92,
    trend: "stable" as const,
    lastTested: "2 days ago",
    parameters: [
      { label: "Temp", value: "78°", status: "good" as const },
      { label: "pH", value: "6.8", status: "good" as const },
      { label: "NO3", value: "10", unit: "ppm", status: "good" as const },
    ],
    totalInhabitants: 14,
  },
  {
    id: "2",
    name: "20g Nano Reef",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBri9KANXjAJT4RTRSbPgNRs_K9bu6grnMfb3hGXfPIrwQJDLGkFdJjGVEciqbQkrYdKkdFT7q6rt55YYuWDsTfi5douSzuWHB9mqsLopdgdWwjHoa3js4HmI6tLpmf-BfATj-3GxuhDJOm-I5RT1pcZCwjgmVTBdrxpk7DxVKdzsFiIGnoqeX4emcaIKa3UKq-Yewu-VS1I24IivgC1B0MgAXSVXU-BtB_jVNSAdBcfFtZS2brZs9U-yg4ot113eoU05vEkDbZS_M",
    healthScore: 68,
    trend: "declining" as const,
    lastTested: "Yesterday",
    parameters: [
      { label: "Temp", value: "79°", status: "good" as const },
      { label: "Salinity", value: "1.026", status: "good" as const },
      { label: "Alk", value: "7.2", unit: "dKH", status: "warning" as const },
    ],
    totalInhabitants: 5,
  },
]

const mockQuickStats = [
  {
    id: "1",
    label: "Total Tanks",
    value: 3,
    icon: "tanks" as const,
    trend: "up" as const,
    trendValue: "+1",
  },
  {
    id: "2",
    label: "Inhabitants",
    value: 42,
    icon: "inhabitants" as const,
    trend: "up" as const,
    trendValue: "+2",
  },
  {
    id: "3",
    label: "Active Alerts",
    value: 1,
    icon: "alerts" as const,
  },
  {
    id: "4",
    label: "Care Streak",
    value: "14 days",
    icon: "streak" as const,
  },
]

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "testing",
    title: "Water Parameters Logged",
    description: "Ammonia: 0, Nitrite: 0, Nitrate: 10ppm",
    timestamp: "2h ago",
    tankName: "55g Planted",
  },
  {
    id: "2",
    type: "feeding",
    title: "Feeding Time",
    description: "Fed Frozen Brine Shrimp",
    timestamp: "5h ago",
    tankName: "Nano Reef",
  },
  {
    id: "3",
    type: "maintenance",
    title: "Plant Trimming",
    description: "Trimmed Rotala rotundifolia",
    timestamp: "Yesterday",
    tankName: "55g Planted",
  },
  {
    id: "4",
    type: "water_change",
    title: "Water Change Complete",
    description: "25% water change with RO/DI water",
    timestamp: "3 days ago",
    tankName: "Nano Reef",
  },
]

const mockLearningTips: LearningTip[] = [
  {
    id: "1",
    title: "The Nitrogen Cycle",
    shortDescription:
      "Beneficial bacteria convert toxic ammonia into less harmful nitrates. This process takes 4-6 weeks in new tanks.",
    category: "care",
    linkUrl: "/learn/nitrogen-cycle",
  },
  {
    id: "2",
    title: "Clownfish & Anemones",
    shortDescription:
      "Clownfish don't need anemones to thrive in captivity, but they form fascinating symbiotic relationships in the wild.",
    category: "species",
    linkUrl: "/learn/clownfish",
  },
  {
    id: "3",
    title: "LED Lighting Basics",
    shortDescription:
      "Modern LED lights can provide full spectrum lighting for planted tanks while using 50% less energy than traditional fixtures.",
    category: "equipment",
    linkUrl: "/learn/lighting",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(mockAIInsights)

  // Fetch real AI insights
  useEffect(() => {
    getInsights().then((result) => {
      if (result.success && result.insights && result.insights.length > 0) {
        setAiInsights(result.insights)
      }
    })
  }, [])

  // ✅ Use useCallback for stable event handler references
  const handleAskQuestion = useCallback(() => {
    router.push("/chat")
  }, [router])

  const handleInsightAction = useCallback((insight: AIInsight) => {
    router.push(`/chat?q=${encodeURIComponent(insight.title)}`)
  }, [router])

  const handleTaskClick = useCallback((task: PriorityTask) => {
    console.log("Task clicked:", task)
  }, [])

  const handleTaskComplete = useCallback((taskId: string) => {
    console.log("Task completed:", taskId)
  }, [])

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-20">
      {/* Page-level decorative blobs */}
      <div className="pointer-events-none fixed -right-32 -top-32 h-96 w-96 rounded-full bg-warm-coral/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      {/* Row 1: Greeting + AI Companion */}
      <div className="relative mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardGreeting
            userName="Aquarist"
            subtitle="Your tanks are looking healthy today"
          />
        </div>
        <div>
          <AICompanionWidget
            tanksCount={3}
            recentInsight="Your 55g tank's parameters are looking great!"
            onQuestionSubmit={(q) => router.push(`/chat?q=${encodeURIComponent(q)}`)}
          />
        </div>
      </div>

      {/* Row 2: Priority Tasks */}
      <section className="relative mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Due Now</h2>
        </div>
        <PriorityTasksGrid
          tasks={mockPriorityTasks}
          onTaskClick={handleTaskClick}
          onMarkComplete={handleTaskComplete}
        />
      </section>

      {/* Row 3: AI Insights Hero */}
      <section className="relative mb-8">
        <AIInsightsHero
          insights={aiInsights}
          onInsightAction={handleInsightAction}
          onAskQuestion={handleAskQuestion}
        />
      </section>

      {/* Row 4: Tanks + Quick Stats */}
      <div className="relative mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <Waves className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Tank Health
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mockTanks.map((tank) => (
              <TankHealthCard key={tank.id} {...tank} />
            ))}
          </div>
        </div>
        <div>
          <QuickStatsPanel stats={mockQuickStats} />
        </div>
      </div>

      {/* Row 5: Activity + Learning */}
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline activities={mockActivities} />
        </div>
        <div>
          <LearningCenterPreview tips={mockLearningTips} />
        </div>
      </div>
    </div>
  )
}
