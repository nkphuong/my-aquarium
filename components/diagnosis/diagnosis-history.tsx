"use client"

import { Card } from "@/components/ui/card"

interface SavedDiagnosis {
  id: string
  date: string
  disease: string
  severity: "low" | "medium" | "high"
  medication: string
  dosage: string
  tankName: string
}

interface DiagnosisHistoryProps {
  diagnoses: SavedDiagnosis[]
}

export function DiagnosisHistory({ diagnoses }: DiagnosisHistoryProps) {
  if (diagnoses.length === 0) return null

  const severityBadge = {
    low: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-red-500/20 text-red-400",
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Recent Diagnoses</h3>
      <div className="space-y-3">
        {diagnoses.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-foreground">{diagnosis.disease}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${severityBadge[diagnosis.severity]}`}>
                  {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{diagnosis.tankName}</p>
              <p className="text-xs text-muted-foreground">
                {diagnosis.medication} • {diagnosis.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
