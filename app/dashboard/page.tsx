"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { formatDate, getLast7Days } from "@/lib/utils"
import WeightManagementPlan from "@/components/weight-management-plan"

// Add imports for new components
import AdvancedCharts from "@/components/advanced-charts"
import AIPredictions from "@/components/ai-predictions"

export default function Dashboard() {
  const [waterHistory, setWaterHistory] = useState<any[]>([])
  const [calorieHistory, setCalorieHistory] = useState<any[]>([])
  const [bmiHistory, setBmiHistory] = useState<any[]>([])
  const [latestBmi, setLatestBmi] = useState<number | null>(null)
  const [userDetails, setUserDetails] = useState({
    height: 0,
    weight: 0,
    age: 0,
    gender: "male",
    activityLevel: "moderate",
    unit: "metric",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Load data from localStorage
      const savedBmiHistory = localStorage.getItem("bmiHistory")
      let parsedBmiHistory: any[] = []

      if (savedBmiHistory) {
        try {
          const parsed = JSON.parse(savedBmiHistory)
          if (Array.isArray(parsed)) {
            // Ensure each entry has the required properties
            parsedBmiHistory = parsed
              .map((entry) => {
                if (!entry || typeof entry !== "object") return { date: new Date().toISOString().split("T")[0], bmi: 0 }
                return {
                  date: entry.date || new Date().toISOString().split("T")[0],
                  bmi: typeof entry.bmi === "number" ? entry.bmi : 0,
                }
              })
              .filter((entry) => entry.date && typeof entry.bmi === "number")

            setBmiHistory(parsedBmiHistory)

            // Get latest BMI entry
            if (parsedBmiHistory.length > 0) {
              // Create a safe copy to sort
              const sortableBmiHistory = [...parsedBmiHistory]

              sortableBmiHistory.sort((a, b) => {
                try {
                  return new Date(b.date).getTime() - new Date(a.date).getTime()
                } catch (e) {
                  return 0
                }
              })

              if (sortableBmiHistory[0] && typeof sortableBmiHistory[0].bmi === "number") {
                setLatestBmi(sortableBmiHistory[0].bmi)
              }
            }
          } else {
            console.error("BMI history is not an array")
            setBmiHistory([])
          }
        } catch (e) {
          console.error("Error parsing BMI history:", e)
          setBmiHistory([])
        }
      } else {
        setBmiHistory([])
      }

      // Get water intake history for the last 7 days
      const last7Days = getLast7Days()
      const waterData = last7Days.map((date) => {
        const savedIntake = localStorage.getItem(`waterIntake_${date}`)
        return {
          date,
          intake: savedIntake && !isNaN(Number(savedIntake)) ? Number.parseInt(savedIntake) : 0,
        }
      })
      setWaterHistory(waterData)

      // Get calorie intake history for the last 7 days
      const calorieData = last7Days.map((date) => {
        const savedMeals = localStorage.getItem(`meals_${date}`)
        let meals = []
        try {
          if (savedMeals) {
            const parsedMeals = JSON.parse(savedMeals)
            if (Array.isArray(parsedMeals)) {
              meals = parsedMeals
            }
          }
        } catch (e) {
          console.error(`Error parsing meals for date ${date}:`, e)
        }

        const totalCalories = Array.isArray(meals)
          ? meals.reduce((sum: number, meal: any) => {
              const mealCalories =
                meal && typeof meal === "object" && "calories" in meal ? Number(meal.calories) || 0 : 0
              return sum + mealCalories
            }, 0)
          : 0

        return {
          date,
          calories: totalCalories,
        }
      })
      setCalorieHistory(calorieData)

      // Load user details with safe defaults
      const height = localStorage.getItem("height")
      const weight = localStorage.getItem("weight")
      const age = localStorage.getItem("age")
      const gender = localStorage.getItem("gender")
      const activityLevel = localStorage.getItem("activityLevel")
      const unit = localStorage.getItem("unit")

      const userDetailsObj = {
        height: height && !isNaN(Number(height)) ? Number(height) : 0,
        weight: weight && !isNaN(Number(weight)) ? Number(weight) : 0,
        age: age && !isNaN(Number(age)) ? Number(age) : 0,
        gender: gender || "male",
        activityLevel: activityLevel || "moderate",
        unit: unit || "metric",
      }

      setUserDetails(userDetailsObj)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto p-4 pb-20 flex justify-center items-center min-h-screen">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto p-4 pb-20 flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  // Ensure we have valid data for charts
  const validBmiHistory =
    Array.isArray(bmiHistory) && bmiHistory.length > 0
      ? bmiHistory.filter((entry) => entry && typeof entry === "object" && "date" in entry && "bmi" in entry)
      : []

  const validWaterHistory =
    Array.isArray(waterHistory) && waterHistory.length > 0
      ? waterHistory.filter((entry) => entry && typeof entry === "object" && "date" in entry && "intake" in entry)
      : []

  const validCalorieHistory =
    Array.isArray(calorieHistory) && calorieHistory.length > 0
      ? calorieHistory.filter((entry) => entry && typeof entry === "object" && "date" in entry && "calories" in entry)
      : []

  return (
    <div className="container max-w-4xl mx-auto p-4 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>BMI Progress</CardTitle>
                <CardDescription>Your BMI history over time</CardDescription>
              </CardHeader>
              <CardContent>
                {validBmiHistory.length > 0 ? (
                  <div className="h-64">
                    <ChartContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={validBmiHistory.sort((a, b) => {
                            try {
                              // Sort by date (oldest to newest)
                              return new Date(a.date).getTime() - new Date(b.date).getTime()
                            } catch (e) {
                              return 0
                            }
                          })}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => {
                              try {
                                return formatDate(value)
                              } catch (e) {
                                return value
                              }
                            }}
                          />
                          <YAxis domain={["auto", "auto"]} />
                          <Tooltip
                            formatter={(value) => [`${value}`, "BMI"]}
                            labelFormatter={(label) => {
                              try {
                                return formatDate(label)
                              } catch (e) {
                                return label
                              }
                            }}
                          />
                          <Line type="monotone" dataKey="bmi" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No BMI history available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Water Intake</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={validWaterHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => {
                              try {
                                return formatDate(value)
                              } catch (e) {
                                return value
                              }
                            }}
                          />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${value} ml`, "Water Intake"]}
                            labelFormatter={(label) => {
                              try {
                                return formatDate(label)
                              } catch (e) {
                                return label
                              }
                            }}
                          />
                          <Line type="monotone" dataKey="intake" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calorie Intake</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={validCalorieHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => {
                              try {
                                return formatDate(value)
                              } catch (e) {
                                return value
                              }
                            }}
                          />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${value} kcal`, "Calories"]}
                            labelFormatter={(label) => {
                              try {
                                return formatDate(label)
                              } catch (e) {
                                return label
                              }
                            }}
                          />
                          <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>BMI History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {validBmiHistory.length > 0 ? (
                  validBmiHistory
                    .sort((a, b) => {
                      try {
                        return new Date(b.date).getTime() - new Date(a.date).getTime()
                      } catch (e) {
                        return 0
                      }
                    })
                    .map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{formatDate(entry.date)}</div>
                        </div>
                        <div className={`font-bold ${getBmiColor(entry.bmi)}`}>{entry.bmi}</div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No BMI history available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan">
          {latestBmi && latestBmi >= 25 && userDetails.height > 0 && userDetails.weight > 0 ? (
            <WeightManagementPlan
              currentBmi={latestBmi}
              height={userDetails.height}
              weight={userDetails.weight}
              age={userDetails.age}
              gender={userDetails.gender}
              activityLevel={userDetails.activityLevel}
              unit={userDetails.unit}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Weight Management Plan</CardTitle>
                <CardDescription>Calculate your BMI to see a personalized weight management plan</CardDescription>
              </CardHeader>
              <CardContent className="text-center p-6">
                <p className="mb-4 text-muted-foreground">
                  {latestBmi
                    ? "Your current BMI is in the healthy range. No weight management plan needed."
                    : "No BMI data available. Calculate your BMI to generate a plan."}
                </p>
                <Button asChild>
                  <Link href="/">Return to BMI Calculator</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {!isLoading && !error && (
        <div className="mt-6 space-y-6">
          <AdvancedCharts bmiData={validBmiHistory} waterData={validWaterHistory} calorieData={validCalorieHistory} />

          <div className="mt-4">
            <AIPredictions
              bmiHistory={validBmiHistory}
              waterHistory={validWaterHistory}
              calorieHistory={validCalorieHistory}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function getBmiColor(bmiValue: number | undefined | null) {
  if (bmiValue === undefined || bmiValue === null || isNaN(bmiValue)) return "text-muted-foreground"
  if (bmiValue < 18.5) return "text-blue-500"
  if (bmiValue < 25) return "text-green-500"
  if (bmiValue < 30) return "text-yellow-500"
  return "text-red-500"
}

