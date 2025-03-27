"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AdvancedChartsProps {
  bmiData: any[]
  waterData: any[]
  calorieData: any[]
}

export default function AdvancedCharts({ bmiData, waterData, calorieData }: AdvancedChartsProps) {
  const [timeRange, setTimeRange] = useState("week")

  // Calculate BMI category distribution
  const bmiCategories = bmiData.reduce((acc: any, entry) => {
    let category = "Unknown"
    if (entry.bmi < 18.5) category = "Underweight"
    else if (entry.bmi < 25) category = "Normal"
    else if (entry.bmi < 30) category = "Overweight"
    else category = "Obese"

    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const bmiDistributionData = Object.entries(bmiCategories).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate daily averages for water and calories
  const dailyAverages = calorieData
    .map((entry, index) => ({
      date: entry.date,
      calories: entry.calories,
      water: waterData[index]?.intake || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate goal achievement rates
  const waterGoal = localStorage.getItem("waterGoal")
    ? Number.parseInt(localStorage.getItem("waterGoal") || "2000")
    : 2000
  const calorieGoal = localStorage.getItem("calorieGoal")
    ? Number.parseInt(localStorage.getItem("calorieGoal") || "2000")
    : 2000

  const goalAchievementData = [
    { name: "Water", achieved: waterData.filter((d) => d.intake >= waterGoal).length, total: waterData.length },
    {
      name: "Calories",
      achieved: calorieData.filter((d) => d.calories <= calorieGoal).length,
      total: calorieData.length,
    },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Advanced Analytics</CardTitle>
          <CardDescription>Detailed insights into your health data</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="goals">Goal Achievement</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="water" fill="#8884d8" stroke="#8884d8" />
                  <Bar yAxisId="right" dataKey="calories" barSize={20} fill="#82ca9d" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Combined view of water intake (area) and calorie consumption (bars)
            </p>
          </TabsContent>

          <TabsContent value="distribution">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bmiDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bmiDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} measurements`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Distribution of BMI measurements by category
            </p>
          </TabsContent>

          <TabsContent value="goals">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalAchievementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "achievementRate") {
                        return [`${(Number(value) * 100).toFixed(0)}%`, "Achievement Rate"]
                      }
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey={(data) => (data.total > 0 ? data.achieved / data.total : 0)}
                    name="achievementRate"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Percentage of days you achieved your water and calorie goals
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

