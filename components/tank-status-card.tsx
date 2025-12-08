"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Droplets, Thermometer, Zap } from "lucide-react"

export function TankStatusCard() {
  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-accent" />
          Tank 96L Status
        </CardTitle>
        <CardDescription>Real-time water parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Parameter 1: Temperature */}
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">Temperature</span>
              <Thermometer className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">25.3°C</div>
            <div className="text-xs text-muted-foreground mt-1">Optimal range: 24-26°C</div>
          </div>

          {/* Parameter 2: pH */}
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">pH Level</span>
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">7.2</div>
            <div className="text-xs text-muted-foreground mt-1">Optimal range: 6.8-7.4</div>
          </div>

          {/* Parameter 3: Ammonia - WARNING */}
          <div className="bg-red-950 rounded-lg p-4 border border-red-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-300 text-sm font-medium">Ammonia</span>
              <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-red-400">2.4 ppm</div>
            <div className="text-xs text-red-300 mt-1">⚠️ HIGH - Requires immediate attention</div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-3">
            <p className="text-red-300 text-sm font-medium">⚠️ Alert: High Ammonia Detected</p>
            <p className="text-red-200/70 text-xs mt-1">Perform immediate 50% water change and check filter status</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
