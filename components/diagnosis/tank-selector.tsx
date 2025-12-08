"use client"

import { Card } from "@/components/ui/card"

interface Tank {
  id: string
  name: string
  volume: number
  fishCount: number
  lastUpdate: string
}

const MOCK_TANKS: Tank[] = [
  { id: "1", name: "Main Tank", volume: 96, fishCount: 12, lastUpdate: "2 hours ago" },
  { id: "2", name: "Betta Corner", volume: 20, fishCount: 1, lastUpdate: "1 hour ago" },
  { id: "3", name: "Breeding Tank", volume: 40, fishCount: 8, lastUpdate: "4 hours ago" },
  { id: "4", name: "Quarantine", volume: 30, fishCount: 3, lastUpdate: "30 minutes ago" },
  { id: "5", name: "Tropical Tank", volume: 75, fishCount: 25, lastUpdate: "1 hour ago" },
]

interface TankSelectorProps {
  onSelectTank: (tankId: string, tankName: string) => void
}

export function TankSelector({ onSelectTank }: TankSelectorProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Select Tank for Diagnosis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_TANKS.map((tank) => (
          <button key={tank.id} onClick={() => onSelectTank(tank.id, tank.name)} className="text-left">
            <Card className="p-6 hover:border-accent hover:bg-accent/5 transition cursor-pointer h-full">
              <h3 className="text-lg font-semibold text-foreground mb-3">{tank.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="text-foreground font-medium">{tank.volume}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fish Count:</span>
                  <span className="text-foreground font-medium">{tank.fishCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span className="text-foreground font-medium">{tank.lastUpdate}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-accent font-semibold text-sm">Select Tank →</span>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
