"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const phData = [
  { day: "Mon", ph: 7.1 },
  { day: "Tue", ph: 7.15 },
  { day: "Wed", ph: 7.3 },
  { day: "Thu", ph: 7.25 },
  { day: "Fri", ph: 7.2 },
  { day: "Sat", ph: 7.18 },
  { day: "Sun", ph: 7.2 },
]

export function PHChart() {
  const accentColor = "oklch(0.7 0.25 180)" // cyan

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle>pH Fluctuation Trend</CardTitle>
        <CardDescription>Weekly pH level monitoring (Optimal: 6.8-7.4)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={phData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0.02 280)" />
              <XAxis dataKey="day" stroke="oklch(0.65 0 0)" style={{ fontSize: "12px" }} />
              <YAxis domain={[6.5, 7.5]} stroke="oklch(0.65 0 0)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.15 0.02 280)",
                  border: "1px solid oklch(0.2 0.02 280)",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "oklch(0.95 0 0)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "1rem" }} textColor="oklch(0.95 0 0)" />
              <Line
                type="monotone"
                dataKey="ph"
                stroke={accentColor}
                strokeWidth={3}
                dot={{ fill: accentColor, r: 5 }}
                activeDot={{ r: 7 }}
                name="pH Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
