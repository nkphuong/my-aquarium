"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const COMMON_SYMPTOMS = [
  { id: "torn-fins", label: "Torn/Frayed Fins" },
  { id: "white-spots", label: "White Spots on Body" },
  { id: "lethargic", label: "Lethargic/Swimming Lethargically" },
  { id: "color-loss", label: "Loss of Color/Fading" },
  { id: "no-appetite", label: "No Appetite/Not Eating" },
]

interface SymptomFormProps {
  tankName: string
  onSubmit: (symptoms: string[], otherSymptoms: string) => void
  onBack: () => void
}

export function SymptomForm({ tankName, onSubmit, onBack }: SymptomFormProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [otherSymptoms, setOtherSymptoms] = useState("")

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleSubmit = () => {
    if (selectedSymptoms.length > 0 || otherSymptoms.trim()) {
      onSubmit(selectedSymptoms, otherSymptoms)
    }
  }

  const isValid = selectedSymptoms.length > 0 || otherSymptoms.trim().length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Diagnosis for {tankName}</h2>
        <p className="text-muted-foreground">Select symptoms you've observed</p>
      </div>

      <Card className="p-8">
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-foreground">Common Symptoms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => (
              <label
                key={symptom.id}
                className="flex items-center p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom.id)}
                  onChange={() => handleSymptomToggle(symptom.id)}
                  className="w-5 h-5 rounded border-border accent-accent cursor-pointer"
                />
                <span className="ml-3 text-foreground font-medium">{symptom.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <label className="block mb-3">
            <span className="text-sm font-semibold text-foreground mb-2 block">Other Symptoms (Optional)</span>
            <textarea
              value={otherSymptoms}
              onChange={(e) => setOtherSymptoms(e.target.value)}
              placeholder="Describe any other symptoms..."
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              rows={3}
            />
          </label>
        </div>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="bg-accent text-accent-foreground hover:opacity-90"
        >
          Diagnose
        </Button>
      </div>
    </div>
  )
}
