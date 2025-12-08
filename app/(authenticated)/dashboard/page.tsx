"use client"

import { TankStatusCard } from "@/components/tank-status-card"
import { PHChart } from "@/components/ph-chart"
import { MedicalLogs } from "@/components/medical-logs"
import { Button } from "@/components/ui/button"
import { logoutAction } from "../../actions/auth-actions"

export default function DashboardPage() {
  async function handleLogout() {
    await logoutAction()
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Aquarium Control
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring and health management
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="mt-1"
        >
          Logout
        </Button>
      </div>

      <div className="grid gap-6">
        <div>
          <TankStatusCard />
        </div>

        <div>
          <PHChart />
        </div>

        <div>
          <MedicalLogs />
        </div>
      </div>
    </div>
  )
}
