"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface MedicalLog {
  id: string
  date: string
  disease: string
  medication: string
  status: "active" | "completed"
}

const logs: MedicalLog[] = [
  {
    id: "1",
    date: "Dec 1, 2024",
    disease: "Fin Rot",
    medication: "Melafix - 2 doses daily",
    status: "completed",
  },
  {
    id: "2",
    date: "Nov 28, 2024",
    disease: "Ich (White Spot)",
    medication: "Salt bath 30 min + Cupramine",
    status: "completed",
  },
  {
    id: "3",
    date: "Nov 25, 2024",
    disease: "Bacterial Infection",
    medication: "Erythromycin - 500mg per 10 gal",
    status: "completed",
  },
  {
    id: "4",
    date: "Nov 20, 2024",
    disease: "Ammonia Spike",
    medication: "Water change 75% + Ammonia reducer",
    status: "active",
  },
  {
    id: "5",
    date: "Nov 15, 2024",
    disease: "Velvet Disease",
    medication: "Copper treatment - 0.15-0.3 ppm",
    status: "completed",
  },
]

export function MedicalLogs() {
  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle>Medical Treatment Logs</CardTitle>
        <CardDescription>Historical and ongoing treatment records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Disease/Condition</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Medication</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4 text-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      {log.date}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{log.disease}</td>
                  <td className="py-4 px-4 text-muted-foreground">{log.medication}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {log.status === "completed" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-accent">Completed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-400 font-medium">Active</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Total Treatments</div>
            <div className="text-2xl font-bold text-accent">{logs.length}</div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Completed</div>
            <div className="text-2xl font-bold text-accent">{logs.filter((l) => l.status === "completed").length}</div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Active</div>
            <div className="text-2xl font-bold text-red-400">{logs.filter((l) => l.status === "active").length}</div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Recovery Rate</div>
            <div className="text-2xl font-bold text-accent">80%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
