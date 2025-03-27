"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Dumbbell, Utensils, Calendar, Clock, ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface WeightManagementPlanProps {
  currentBmi: number
  height: number
  weight: number
  age: number
  gender: string
  activityLevel: string
  unit: string
}

export default function WeightManagementPlan({
  currentBmi,
  height,
  weight,
  age,
  gender,
  activityLevel,
  unit,
}: WeightManagementPlanProps) {
  const [targetBmi, setTargetBmi] = useState(22) // Middle of normal range
  const [targetWeight, setTargetWeight] = useState(0)
  const [weightToLose, setWeightToLose] = useState(0)
  const [dailyCalories, setDailyCalories] = useState(0)
  const [timeToReachGoal, setTimeToReachGoal] = useState({ weeks: 0, months: 0 })
  const [weightLossData, setWeightLossData] = useState<{ week: number; weight: number }[]>([])
  const [calculationError, setCalculationError] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (
        isNaN(currentBmi) ||
        isNaN(height) ||
        isNaN(weight) ||
        isNaN(age) ||
        !currentBmi ||
        !height ||
        !weight ||
        !age
      ) {
        setCalculationError("Missing or invalid input values for weight management plan")
        return
      }

      setCalculationError(null)
      calculatePlan()
    } catch (error) {
      console.error("Error in weight management plan:", error)
      setCalculationError("An error occurred while calculating your plan")
    }
  }, [currentBmi, height, weight, age, gender, activityLevel, targetBmi])

  const calculatePlan = () => {
    // Validate inputs
    if (
      !height ||
      !weight ||
      !age ||
      !currentBmi ||
      isNaN(Number(height)) ||
      isNaN(Number(weight)) ||
      isNaN(Number(age)) ||
      isNaN(Number(currentBmi))
    ) {
      setCalculationError("Missing or invalid values for weight management plan")
      return
    }

    // Convert height to meters if in metric, or to inches if imperial
    const heightInMeters = unit === "metric" ? Number(height) / 100 : Number(height) * 0.0254
    const weightInKg = unit === "metric" ? Number(weight) : Number(weight) * 0.453592

    // Calculate target weight based on target BMI
    const calculatedTargetWeight = targetBmi * (heightInMeters * heightInMeters)
    setTargetWeight(Number.parseFloat(calculatedTargetWeight.toFixed(1)))

    // Calculate weight to lose
    const calculatedWeightToLose = weightInKg - calculatedTargetWeight
    setWeightToLose(Number.parseFloat(calculatedWeightToLose.toFixed(1)))

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr
    if (gender === "male") {
      bmr = 10 * weightInKg + 6.25 * (heightInMeters * 100) - 5 * Number(age) + 5
    } else {
      bmr = 10 * weightInKg + 6.25 * (heightInMeters * 100) - 5 * Number(age) - 161
    }

    // Activity multiplier
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

    // Calculate maintenance calories
    const maintenanceCalories = bmr * activityMultiplier

    // For weight loss, create a moderate deficit (500-750 calories/day)
    // This is a safe rate of weight loss (0.5-0.75 kg per week)
    const deficit = calculatedWeightToLose > 10 ? 750 : 500
    const calculatedDailyCalories = Math.max(1200, Math.round(maintenanceCalories - deficit))
    setDailyCalories(calculatedDailyCalories)

    // Calculate time to reach goal
    // 1 kg of fat is approximately 7700 calories
    // So daily deficit of 500-750 calories = 0.5-0.75 kg per week
    const weeklyWeightLoss = (deficit * 7) / 7700
    const weeksToGoal = Math.abs(calculatedWeightToLose) / weeklyWeightLoss

    setTimeToReachGoal({
      weeks: Math.round(weeksToGoal),
      months: Math.round(weeksToGoal / 4.33),
    })

    // Generate weight loss projection data for chart
    const projectionData = []
    let currentWeightInProjection = weightInKg

    for (let week = 0; week <= Math.min(52, Math.ceil(weeksToGoal)); week++) {
      projectionData.push({
        week,
        weight: Number.parseFloat(currentWeightInProjection.toFixed(1)),
      })

      if (week < Math.ceil(weeksToGoal)) {
        currentWeightInProjection -= weeklyWeightLoss
      }
    }

    // Ensure data is sorted by week (ascending)
    projectionData.sort((a, b) => a.week - b.week)

    setWeightLossData(projectionData)
  }

  const getExerciseRecommendations = () => {
    // Base recommendations on age and activity level
    const isYoung = Number(age) < 30
    const isSedentary = activityLevel === "sedentary" || activityLevel === "light"

    if (isSedentary) {
      return {
        frequency: "3-4 days per week, gradually increasing to 5-6 days",
        types: [
          { name: "Walking", description: "Start with 15-20 minutes and gradually increase to 30-45 minutes" },
          { name: "Swimming", description: "Low-impact exercise ideal for beginners, 20-30 minutes" },
          { name: "Cycling", description: "Stationary or outdoor, 15-30 minutes at moderate intensity" },
          {
            name: "Bodyweight exercises",
            description: "Squats, modified push-ups, lunges, 2-3 sets of 8-12 repetitions",
          },
        ],
        intensity: "Start with low to moderate intensity (able to talk while exercising)",
        progression: "Increase duration by 5 minutes every 1-2 weeks before increasing intensity",
      }
    } else {
      return {
        frequency: "4-6 days per week",
        types: [
          { name: "Brisk walking/jogging", description: "30-45 minutes at moderate pace" },
          {
            name: "HIIT (High-Intensity Interval Training)",
            description: "20-30 minutes, alternating between high intensity (30s) and recovery (90s)",
          },
          {
            name: "Strength training",
            description: "Full body workout 2-3 times per week, 3 sets of 10-15 repetitions",
          },
          { name: "Flexibility exercises", description: "Yoga or stretching, 1-2 times per week for 20-30 minutes" },
        ],
        intensity: "Moderate to high intensity (somewhat difficult to talk while exercising)",
        progression: "Increase intensity gradually and vary workout types to prevent plateaus",
      }
    }
  }

  const exerciseRecommendations = getExerciseRecommendations()

  const getDietRecommendations = () => {
    return [
      {
        title: "Protein Sources",
        items: [
          "Lean meats (chicken breast, turkey)",
          "Fish (salmon, tuna, mackerel)",
          "Eggs and egg whites",
          "Low-fat dairy (Greek yogurt, cottage cheese)",
          "Plant proteins (tofu, tempeh, legumes)",
        ],
      },
      {
        title: "Complex Carbohydrates",
        items: [
          "Whole grains (brown rice, quinoa, oats)",
          "Starchy vegetables (sweet potatoes, corn)",
          "Legumes (beans, lentils)",
          "Fruits (apples, berries, oranges)",
          "Whole grain bread and pasta (in moderation)",
        ],
      },
      {
        title: "Healthy Fats",
        items: ["Avocados", "Nuts and seeds", "Olive oil", "Fatty fish", "Nut butters (in moderation)"],
      },
      {
        title: "Vegetables",
        items: [
          "Leafy greens (spinach, kale)",
          "Cruciferous vegetables (broccoli, cauliflower)",
          "Colorful vegetables (bell peppers, carrots)",
          "Aim for half your plate to be vegetables",
        ],
      },
    ]
  }

  const dietRecommendations = getDietRecommendations()

  const formatWeight = (weight: number) => {
    return unit === "metric" ? `${weight} kg` : `${(weight * 2.20462).toFixed(1)} lbs`
  }

  const calculateWaterIntake = () => {
    // Base water intake calculation (30ml per kg of body weight)
    let waterIntake = Math.round(Number(weight) * 30)

    // Adjust for activity level
    if (activityLevel === "active" || activityLevel === "very-active") {
      waterIntake += 500 // Add 500ml for active individuals
    }

    // Adjust for weight loss goals (additional 500ml)
    if (currentBmi > 25) {
      waterIntake += 500
    }

    // Convert if using imperial units
    if (unit === "imperial") {
      waterIntake = Math.round(waterIntake / 29.574) // Convert to fluid ounces
    }

    // Save to localStorage
    localStorage.setItem("waterGoal", waterIntake.toString())

    return waterIntake
  }

  if (calculationError) {
    return (
      <Card className="p-6">
        <CardContent className="text-center">
          <p className="text-red-500">{calculationError}</p>
          <p className="mt-2">Please make sure you've entered all your information correctly in the BMI calculator.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Weight Management Plan</CardTitle>
          <CardDescription>Personalized plan to help you reach a healthy BMI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current BMI</p>
              <p className="text-2xl font-bold">{currentBmi}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Target BMI</p>
              <p className="text-2xl font-bold text-green-500">{targetBmi}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="text-lg font-medium">{formatWeight(Number(weight))}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Target Weight</p>
              <p className="text-lg font-medium text-green-500">{formatWeight(targetWeight)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weight to lose</span>
              <span className="font-medium">{formatWeight(Math.abs(weightToLose))}</span>
            </div>
            <Progress value={(targetWeight / Number(weight)) * 100} className="h-2" />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Daily Calorie Target</h4>
                <p className="text-sm text-muted-foreground">For safe, sustainable weight loss</p>
              </div>
              <p className="text-2xl font-bold">{dailyCalories} kcal</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Daily Water Intake</h4>
                <p className="text-sm text-muted-foreground">Recommended hydration</p>
              </div>
              <p className="text-2xl font-bold">{calculateWaterIntake()} ml</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Estimated Time to Goal</h4>
                <p className="text-sm text-muted-foreground">With consistent diet and exercise</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{timeToReachGoal.weeks} weeks</p>
                <p className="text-sm text-muted-foreground">({timeToReachGoal.months} months)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {weightLossData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weight Loss Projection</CardTitle>
            <CardDescription>Estimated weekly progress with a safe rate of weight loss</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  weight: {
                    label: "Weight",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightLossData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Weeks", position: "insideBottomRight", offset: -5 }} />
                    <YAxis
                      domain={["auto", "auto"]}
                      label={{
                        value: unit === "metric" ? "Weight (kg)" : "Weight (lbs)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        unit === "metric" ? `${value} kg` : `${(Number(value) * 2.20462).toFixed(1)} lbs`,
                        "Weight",
                      ]}
                      labelFormatter={(label) => `Week ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--color-weight)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="exercise" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="exercise">Exercise Plan</TabsTrigger>
          <TabsTrigger value="diet">Diet Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5" />
                Exercise Recommendations
              </CardTitle>
              <CardDescription>Tailored for your age ({age}) and activity level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Recommended Frequency</h4>
                    <p>{exerciseRecommendations.frequency}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h4 className="font-medium">Intensity and Progression</h4>
                </div>
                <p className="mb-2">{exerciseRecommendations.intensity}</p>
                <p>{exerciseRecommendations.progression}</p>
              </div>

              <h4 className="font-medium mt-4">Recommended Exercise Types</h4>
              <div className="space-y-3">
                {exerciseRecommendations.types.map((exercise, index) => (
                  <div key={index} className="rounded-lg border p-3">
                    <h5 className="font-medium">{exercise.name}</h5>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Important:</strong> Start slowly and gradually increase intensity and duration. Listen to your
                body and rest when needed.
              </p>
              <p className="text-sm text-muted-foreground">
                Consult with a healthcare professional before starting any new exercise program.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="diet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="mr-2 h-5 w-5" />
                Nutrition Guidance
              </CardTitle>
              <CardDescription>Focus on these food groups to support your weight loss</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {dietRecommendations.map((category, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{category.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Meal Planning Tips</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <p>Aim for 3 balanced meals and 1-2 small snacks daily</p>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <p>Include protein with every meal to increase satiety</p>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <p>
                      Fill half your plate with vegetables, one quarter with lean protein, and one quarter with complex
                      carbs
                    </p>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <p>Stay hydrated by drinking at least 2 liters of water daily</p>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <p>Limit processed foods, added sugars, and high-sodium items</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                This plan provides approximately {dailyCalories} calories per day. Adjust portion sizes to meet your
                calorie target.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

