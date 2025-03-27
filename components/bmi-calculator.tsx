"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WeightManagementPlan from "@/components/weight-management-plan"

export default function BmiCalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState("")
  const [bmiHistory, setBmiHistory] = useState<{ date: string; bmi: number }[]>([])
  const [recommendedCalories, setRecommendedCalories] = useState<number | null>(null)
  const [unit, setUnit] = useState("metric")
  const [goal, setGoal] = useState("ideal")
  const [showWeightPlan, setShowWeightPlan] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const savedUnit = localStorage.getItem("unit")
    const savedBmiHistory = localStorage.getItem("bmiHistory")
    const savedGender = localStorage.getItem("gender")
    const savedActivityLevel = localStorage.getItem("activityLevel")
    const savedAge = localStorage.getItem("age")
    const savedGoal = localStorage.getItem("goal")

    if (savedUnit) setUnit(savedUnit)

    if (savedBmiHistory) {
      try {
        const parsedHistory = JSON.parse(savedBmiHistory)
        if (Array.isArray(parsedHistory)) {
          setBmiHistory(parsedHistory)
        } else {
          setBmiHistory([])
        }
      } catch (e) {
        console.error("Error parsing BMI history:", e)
        setBmiHistory([])
      }
    }

    if (savedGender) setGender(savedGender)
    if (savedActivityLevel) setActivityLevel(savedActivityLevel)
    if (savedAge) setAge(savedAge)
    if (savedGoal) setGoal(savedGoal)
  }, [])

  useEffect(() => {
    // Save BMI history to localStorage
    localStorage.setItem("bmiHistory", JSON.stringify(bmiHistory))
    localStorage.setItem("gender", gender)
    localStorage.setItem("activityLevel", activityLevel)
    localStorage.setItem("age", age)
    localStorage.setItem("goal", goal)
  }, [bmiHistory, gender, activityLevel, age, goal])

  const calculateBMI = () => {
    if (!height || !weight || !age) return

    let bmiValue: number

    if (unit === "metric") {
      // Metric calculation: weight (kg) / height (m)^2
      const heightInMeters = Number.parseFloat(height) / 100
      bmiValue = Number.parseFloat(weight) / (heightInMeters * heightInMeters)
    } else {
      // Imperial calculation: (weight (lb) * 703) / height (in)^2
      bmiValue = (Number.parseFloat(weight) * 703) / (Number.parseFloat(height) * Number.parseFloat(height))
    }

    bmiValue = Number.parseFloat(bmiValue.toFixed(1))
    setBmi(bmiValue)

    // Determine BMI category
    if (bmiValue < 18.5) {
      setBmiCategory("Underweight")
    } else if (bmiValue < 25) {
      setBmiCategory("Normal weight")
    } else if (bmiValue < 30) {
      setBmiCategory("Overweight")
    } else {
      setBmiCategory("Obese")
    }

    // Calculate recommended calories using Mifflin-St Jeor Equation
    let bmr: number
    const ageValue = Number.parseInt(age)

    if (unit === "metric") {
      if (gender === "male") {
        bmr = 10 * Number.parseFloat(weight) + 6.25 * Number.parseFloat(height) - 5 * ageValue + 5
      } else {
        bmr = 10 * Number.parseFloat(weight) + 6.25 * Number.parseFloat(height) - 5 * ageValue - 161
      }
    } else {
      // Convert imperial to metric first
      const weightInKg = Number.parseFloat(weight) * 0.453592
      const heightInCm = Number.parseFloat(height) * 2.54

      if (gender === "male") {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageValue + 5
      } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageValue - 161
      }
    }

    // Activity level multiplier
    let activityMultiplier = 1.2 // Sedentary
    switch (activityLevel) {
      case "light":
        activityMultiplier = 1.375
        break
      case "moderate":
        activityMultiplier = 1.55
        break
      case "active":
        activityMultiplier = 1.725
        break
      case "very-active":
        activityMultiplier = 1.9
        break
    }

    // Adjust based on BMI category and goal
    let calorieAdjustment = 1.0

    if (goal === "bulking") {
      // For bulking, increase calories regardless of BMI
      calorieAdjustment = 1.15 // 15% calorie surplus for bulking
    } else {
      // For ideal BMI goal, adjust based on current BMI
      if (bmiValue < 18.5) {
        calorieAdjustment = 1.1 // Increase for underweight
      } else if (bmiValue >= 25 && bmiValue < 30) {
        calorieAdjustment = 0.9 // Decrease for overweight
      } else if (bmiValue >= 30) {
        calorieAdjustment = 0.8 // Decrease more for obese
      }
    }

    const calculatedCalories = Math.round(bmr * activityMultiplier * calorieAdjustment)
    setRecommendedCalories(calculatedCalories)

    // Add to history
    const today = new Date().toISOString().split("T")[0]

    // Check if we already have an entry for today
    const existingEntryIndex = bmiHistory.findIndex((entry) => entry.date === today)

    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedHistory = [...bmiHistory]
      updatedHistory[existingEntryIndex] = { date: today, bmi: bmiValue }
      setBmiHistory(updatedHistory)
    } else {
      // Add new entry
      setBmiHistory([...bmiHistory, { date: today, bmi: bmiValue }])
    }

    // Save the calculated BMI and calorie goal to localStorage
    localStorage.setItem("calorieGoal", calculatedCalories.toString())

    // Calculate and save water intake goal based on weight and activity level
    const waterIntake = calculateWaterIntake(Number.parseFloat(weight), activityLevel, unit, bmiValue)
    localStorage.setItem("waterGoal", waterIntake.toString())

    // Store height and weight in localStorage for the dashboard
    localStorage.setItem("height", height)
    localStorage.setItem("weight", weight)

    // Show weight management plan if overweight or obese and goal is ideal
    if (bmiValue >= 25 && goal === "ideal") {
      setShowWeightPlan(true)
    } else {
      setShowWeightPlan(false)
    }
  }

  const getBmiColor = (bmiValue: number) => {
    if (bmiValue < 18.5) return "text-blue-500"
    if (bmiValue < 25) return "text-green-500"
    if (bmiValue < 30) return "text-yellow-500"
    return "text-red-500"
  }

  const getChartData = () => {
    // Sort history by date
    return [...bmiHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const calculateWaterIntake = (weight: number, activityLevel: string, unit: string, bmi: number) => {
    // Convert weight to kg if in imperial
    const weightInKg = unit === "metric" ? weight : weight * 0.453592

    // Base water intake calculation (30ml per kg of body weight)
    let waterIntake = Math.round(weightInKg * 30)

    // Adjust for activity level
    if (activityLevel === "active" || activityLevel === "very-active") {
      waterIntake += 500 // Add 500ml for active individuals
    }

    // Adjust for weight loss goals (additional 500ml)
    if (bmi > 25) {
      waterIntake += 500
    }

    return waterIntake
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Calculate your Body Mass Index</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "inches"})</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={unit === "metric" ? "175" : "69"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={unit === "metric" ? "70" : "154"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger id="activity">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (intense exercise daily)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                <RadioGroup value={goal} onValueChange={setGoal} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ideal" id="ideal" />
                    <Label htmlFor="ideal">Achieve Ideal BMI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bulking" id="bulking" />
                    <Label htmlFor="bulking">Bulking</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={calculateBMI} className="w-full">
                Calculate BMI
              </Button>

              {bmi !== null && (
                <div className="mt-4 p-4 border rounded-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      <span className={getBmiColor(bmi)}>{bmi}</span>
                    </div>
                    <div className={`font-medium ${getBmiColor(bmi)}`}>{bmiCategory}</div>
                    {recommendedCalories && (
                      <div className="mt-4 text-sm">
                        <p>Recommended daily calories:</p>
                        <p className="font-bold text-lg">{recommendedCalories} kcal</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {bmiHistory.length > 0 ? (
                <div className="h-64">
                  <ChartContainer
                    config={{
                      bmi: {
                        label: "BMI",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData()}>
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
                          stroke="var(--color-bmi)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No BMI history available</p>
                  <p className="text-sm">Calculate your BMI to start tracking</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showWeightPlan && bmi !== null && (
        <WeightManagementPlan
          currentBmi={bmi}
          height={Number(height)}
          weight={Number(weight)}
          age={Number(age)}
          gender={gender}
          activityLevel={activityLevel}
          unit={unit}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>BMI Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Underweight</span>
              <span className="text-blue-500">Below 18.5</span>
            </div>
            <div className="flex justify-between">
              <span>Normal weight</span>
              <span className="text-green-500">18.5 - 24.9</span>
            </div>
            <div className="flex justify-between">
              <span>Overweight</span>
              <span className="text-yellow-500">25 - 29.9</span>
            </div>
            <div className="flex justify-between">
              <span>Obesity</span>
              <span className="text-red-500">30 or greater</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

