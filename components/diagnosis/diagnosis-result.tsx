"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DiagnosisProps {
  diagnosisData: {
    tankId: string
    tankName: string
    symptoms: string[]
    otherSymptoms: string
  }
  onSave: (diagnosis: any) => void
  onDiagnoseAgain: () => void
}

const SYMPTOM_LABELS: Record<string, string> = {
  "torn-fins": "Torn/Frayed Fins",
  "white-spots": "White Spots on Body",
  lethargic: "Lethargic/Swimming Lethargically",
  "color-loss": "Loss of Color/Fading",
  "no-appetite": "No Appetite/Not Eating",
}

const DIAGNOSIS_MAP: Record<
  string,
  { disease: string; severity: "low" | "medium" | "high"; medication: string; dosage: string }
> = {
  "torn-fins": {
    disease: "Fin Rot",
    severity: "medium",
    medication: "Fin Rot Medication",
    dosage: "Follow label - 20 drops per 10L",
  },
  "white-spots": {
    disease: "Ich (White Spot Disease)",
    severity: "high",
    medication: "Formalin-free Ich Treatment",
    dosage: "5ml per 10L daily for 7 days",
  },
  lethargic: {
    disease: "Stress/Infection",
    severity: "high",
    medication: "Aquarium Salt & Antibiotics",
    dosage: "1 teaspoon per 20L + antibiotic",
  },
  "color-loss": {
    disease: "Nutritional Deficiency",
    severity: "low",
    medication: "Quality Fish Food with Spirulina",
    dosage: "2-3 times daily with enriched feed",
  },
  "no-appetite": {
    disease: "Bacterial Infection",
    severity: "high",
    medication: "Broad-spectrum Antibiotic",
    dosage: "Follow antibiotic instructions for tank volume",
  },
}

export function DiagnosisResult({ diagnosisData, onSave, onDiagnoseAgain }: DiagnosisProps) {
  const [setReminder, setSetReminder] = useState(false)

  const primarySymptom = diagnosisData.symptoms[0]
  const diagnosis = DIAGNOSIS_MAP[primarySymptom] || {
    disease: "General Infection",
    severity: "medium",
    medication: "Broad-spectrum Treatment",
    dosage: "Follow label instructions",
  }

  const severityColor = {
    low: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  const handleSave = () => {
    const savedDiagnosis = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      disease: diagnosis.disease,
      severity: diagnosis.severity,
      medication: diagnosis.medication,
      dosage: diagnosis.dosage,
      tankName: diagnosisData.tankName,
    }
    onSave(savedDiagnosis)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Diagnosis Complete</h2>
        <p className="text-muted-foreground">Tank: {diagnosisData.tankName}</p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Identified Disease</p>
        <h3 className="text-4xl font-bold text-foreground mb-4">{diagnosis.disease}</h3>
        <div className={`inline-block px-4 py-2 rounded-lg border font-semibold ${severityColor[diagnosis.severity]}`}>
          {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)} Severity
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold text-foreground mb-4">Detected Symptoms</h4>
        <div className="space-y-2">
          {diagnosisData.symptoms.map((symptomId) => (
            <div key={symptomId} className="flex items-center text-foreground">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              {SYMPTOM_LABELS[symptomId] || symptomId}
            </div>
          ))}
          {diagnosisData.otherSymptoms && (
            <div className="flex items-start text-foreground mt-3 pt-3 border-t border-border">
              <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-1"></span>
              <span>{diagnosisData.otherSymptoms}</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 border-accent/30 bg-accent/5">
        <h4 className="font-semibold text-foreground mb-4">Suggested Treatment</h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Medication</p>
            <p className="text-lg font-semibold text-accent">{diagnosis.medication}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Dosage</p>
            <p className="text-foreground">{diagnosis.dosage}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={setReminder}
            onChange={(e) => setSetReminder(e.target.checked)}
            className="w-5 h-5 rounded border-border accent-accent cursor-pointer"
          />
          <span className="ml-3 text-foreground font-medium">Set reminder for medication schedule</span>
        </label>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button onClick={onDiagnoseAgain} variant="outline">
          Diagnose Again
        </Button>
        <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:opacity-90 px-8">
          Save Prescription
        </Button>
      </div>
    </div>
  )
}
