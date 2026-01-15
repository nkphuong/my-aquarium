"use client"

import { useState } from "react"
import { TankSelector } from "@/components/diagnosis/tank-selector"
import { SymptomForm } from "@/components/diagnosis/symptom-form"
import { DiagnosisResult } from "@/components/diagnosis/diagnosis-result"
import { DiagnosisHistory } from "@/components/diagnosis/diagnosis-history"
import { Button } from "@/components/ui/button"

type DiagnosisStep = "tank-select" | "symptoms" | "result" | "saved"

interface DiagnosisData {
  tankId: string
  tankName: string
  symptoms: string[]
  otherSymptoms: string
}

interface SavedDiagnosis {
  id: string
  date: string
  disease: string
  severity: "low" | "medium" | "high"
  medication: string
  dosage: string
  tankName: string
}

export default function DiagnosisPage() {
  const [step, setStep] = useState<DiagnosisStep>("tank-select")
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null)
  const [savedDiagnoses, setSavedDiagnoses] = useState<SavedDiagnosis[]>([])

  const handleTankSelect = (tankId: string, tankName: string) => {
    setDiagnosisData({ tankId, tankName, symptoms: [], otherSymptoms: "" })
    setStep("symptoms")
  }

  const handleSymptomSubmit = (symptoms: string[], otherSymptoms: string) => {
    if (diagnosisData) {
      setDiagnosisData({ ...diagnosisData, symptoms, otherSymptoms })
      setStep("result")
    }
  }

  const handleSaveDiagnosis = (diagnosis: SavedDiagnosis) => {
    setSavedDiagnoses([diagnosis, ...savedDiagnoses])
    setStep("saved")
  }

  const handleDiagnoseAgain = () => {
    setStep("tank-select")
    setDiagnosisData(null)
  }

  const handleBackToTanks = () => {
    setStep("tank-select")
    setDiagnosisData(null)
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Fish Disease Diagnosis</h1>
        <p className="text-muted-foreground">Diagnose and track aquarium fish health</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {step === "tank-select" && <TankSelector onSelectTank={handleTankSelect} />}

        {step === "symptoms" && diagnosisData && (
          <SymptomForm tankName={diagnosisData.tankName} onSubmit={handleSymptomSubmit} onBack={handleBackToTanks} />
        )}

        {step === "result" && diagnosisData && (
          <DiagnosisResult
            diagnosisData={diagnosisData}
            onSave={handleSaveDiagnosis}
            onDiagnoseAgain={handleDiagnoseAgain}
          />
        )}

        {step === "saved" && (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Prescription Saved</h2>
              <p className="text-muted-foreground mb-6">Your diagnosis has been added to the tank history</p>
            </div>
            <Button onClick={handleDiagnoseAgain}>
              New Diagnosis
            </Button>
          </div>
        )}
      </div>

      {savedDiagnoses.length > 0 && (
        <div className="mt-12 max-w-4xl mx-auto">
          <DiagnosisHistory diagnoses={savedDiagnoses} />
        </div>
      )}
    </div>
  )
}
