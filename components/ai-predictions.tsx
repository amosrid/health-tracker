"use client"

// NOTE: This component uses client-side algorithms to generate predictions
// based on the user's historical data. It does not require an external AI API key
// as all calculations are performed locally in the browser using statistical methods.
// For more advanced AI features, you could integrate with OpenAI or other AI services.

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Brain, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface AIPredictionsProps {
  bmiHistory: any[]
  waterHistory: any[]
  calorieHistory: any[]
}

export default function AIPredictions({ bmiHistory, waterHistory, calorieHistory }: AIPredictionsProps) {
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate AI prediction loading
    setLoading(true)
    setError(null)

    setTimeout(() => {
      try {
        // Generate predictions based on historical data
        if (bmiHistory.length < 3) {
          setError("Not enough BMI data to make predictions. Please record more measurements.")
          setLoading(false)
          return
        }

        generatePredictions()
      } catch (err) {
        setError("Failed to generate predictions. Please try again later.")
        setLoading(false)
      }
    }, 1500)
  }, [bmiHistory, waterHistory, calorieHistory])

  const generatePredictions = () => {
    // Sort BMI history by date
    const sortedBmiHistory = [...bmiHistory].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    // Simple linear regression to predict future BMI
    const bmiTrend = calculateTrend(sortedBmiHistory.map((entry) => entry.bmi))

    // Generate future dates
    const lastDate = new Date(sortedBmiHistory[sortedBmiHistory.length - 1].date)
    const futureDates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(lastDate)
      date.setDate(date.getDate() + i + 1)
      return date.toISOString().split("T")[0]
    })

    // Generate BMI predictions
    const lastBmi = sortedBmiHistory[sortedBmiHistory.length - 1].bmi
    const bmiPredictions = futureDates.map((date, index) => {
      return {
        date,
        bmi: Math.max(18.5, Math.min(35, lastBmi + bmiTrend * (index + 1))).toFixed(1),
      }
    })

    // Calculate expected date to reach target BMI
    const targetBmi = 22 // Middle of normal range
    const currentBmi = lastBmi
    const daysToTarget = bmiTrend !== 0 ? Math.abs(Math.round((targetBmi - currentBmi) / bmiTrend)) : null

    let targetDate = null
    if (daysToTarget !== null) {
      targetDate = new Date(lastDate)
      targetDate.setDate(targetDate.getDate() + daysToTarget)
    }

    // Calculate consistency scores
    const waterConsistency = calculateConsistency(waterHistory.map((entry) => entry.intake))
    const calorieConsistency = calculateConsistency(calorieHistory.map((entry) => entry.calories))

    // Generate insights
    const insights = []

    if (bmiTrend < 0 && currentBmi > 25) {
      insights.push("You're on track to reach a healthier BMI. Keep up the good work!")
    } else if (bmiTrend > 0 && currentBmi < 18.5) {
      insights.push("Your BMI is trending upward, which is positive for your underweight status.")
    } else if (bmiTrend > 0 && currentBmi >= 25) {
      insights.push("Your BMI is trending upward. Consider adjusting your diet and exercise routine.")
    } else if (bmiTrend < 0 && currentBmi <= 18.5) {
      insights.push("Your BMI is trending downward from an already low value. Consider consulting a nutritionist.")
    }

    if (waterConsistency < 0.5) {
      insights.push("Your water intake is inconsistent. Try to establish a regular hydration routine.")
    } else if (waterConsistency > 0.8) {
      insights.push("Excellent water intake consistency! This is great for your overall health.")
    }

    if (calorieConsistency < 0.5) {
      insights.push("Your calorie intake varies significantly day to day. More consistent eating patterns may help.")
    } else if (calorieConsistency > 0.8) {
      insights.push("You maintain consistent calorie intake, which is beneficial for metabolism.")
    }

    setPredictions({
      bmiPredictions,
      bmiTrend,
      targetDate: targetDate ? targetDate.toISOString().split("T")[0] : null,
      waterConsistency,
      calorieConsistency,
      insights,
    })

    setLoading(false)
  }

  const calculateTrend = (values: number[]) => {
    if (values.length < 2) return 0

    // Simple linear regression slope
    const n = values.length
    const indices = Array.from({ length: n }, (_, i) => i)

    const sumX = indices.reduce((sum, x) => sum + x, 0)
    const sumY = values.reduce((sum, y) => sum + y, 0)
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0)
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    return slope
  }

  const calculateConsistency = (values: number[]) => {
    if (values.length < 2) return 1

    // Calculate coefficient of variation (lower is more consistent)
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    // Convert to a 0-1 score where 1 is perfectly consistent
    const cv = mean !== 0 ? stdDev / mean : 0
    return Math.max(0, Math.min(1, 1 - cv))
  }

  const refreshPredictions = () => {
    setLoading(true)
    setTimeout(() => {
      generatePredictions()
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Health Insights
        </CardTitle>
        <CardDescription>Personalized predictions based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">BMI Trend Prediction</h3>
              <div className="h-[200px]">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        // Sort all data by date (oldest to newest)
                        ...[
                          ...bmiHistory.map((entry) => ({
                            date: entry.date,
                            bmi: entry.bmi,
                            type: "historical",
                          })),
                          ...predictions.bmiPredictions.map((entry: any) => ({
                            date: entry.date,
                            bmi: Number.parseFloat(entry.bmi),
                            type: "prediction",
                          })),
                        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip
                        formatter={(value) => [`${value}`, "BMI"]}
                        labelFormatter={(label) => {
                          const date = new Date(label)
                          return date.toLocaleDateString()
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Historical data (solid) and AI predictions (dashed)
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Key Insights</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    BMI Trend:
                    <span className={predictions.bmiTrend < 0 ? "text-green-500" : "text-red-500"}>
                      {" "}
                      {predictions.bmiTrend.toFixed(3)} points per day
                    </span>
                  </span>
                </div>

                {predictions.targetDate && (
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>
                      Estimated date to reach ideal BMI:
                      <span className="font-medium"> {new Date(predictions.targetDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="h-5 w-5 mr-2 text-muted-foreground">💧</div>
                  <span>
                    Water consistency score:
                    <span
                      className={`font-medium ${predictions.waterConsistency > 0.7 ? "text-green-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {(predictions.waterConsistency * 100).toFixed(0)}%
                    </span>
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="h-5 w-5 mr-2 text-muted-foreground">🍽️</div>
                  <span>
                    Calorie consistency score:
                    <span
                      className={`font-medium ${predictions.calorieConsistency > 0.7 ? "text-green-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {(predictions.calorieConsistency * 100).toFixed(0)}%
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Personalized Recommendations</h3>
              <ul className="space-y-2">
                {predictions.insights.map((insight: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 mr-2 text-primary">•</div>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={refreshPredictions} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Analyzing Data..." : "Refresh Predictions"}
        </Button>
      </CardFooter>
    </Card>
  )
}

