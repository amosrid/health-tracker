"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export default function AdvancedCharts({ bmiData, waterData, calorieData }) {
  // Make sure data is sorted by date
  const sortedBmiData = [...(bmiData || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const sortedWaterData = [...(waterData || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const sortedCalorieData = [...(calorieData || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Combined data for correlation charts
  const combinedData = []
  
  // Only process if we have all three datasets
  if (sortedBmiData.length && sortedWaterData.length && sortedCalorieData.length) {
    // Create a map of dates for each dataset for easy lookup
    const bmiMap = new Map(sortedBmiData.map(item => [item.date, item.bmi]))
    const waterMap = new Map(sortedWaterData.map(item => [item.date, item.intake]))
    const calorieMap = new Map(sortedCalorieData.map(item => [item.date, item.calories]))
    
    // Get all unique dates
    const allDates = [...new Set([
      ...sortedBmiData.map(item => item.date),
      ...sortedWaterData.map(item => item.date),
      ...sortedCalorieData.map(item => item.date)
    ])].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    
    // Create combined dataset
    allDates.forEach(date => {
      combinedData.push({
        date,
        bmi: bmiMap.get(date) || null,
        water: waterMap.get(date) || 0,
        calories: calorieMap.get(date) || 0
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Analytics</CardTitle>
        <CardDescription>Visualize correlations between your health metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {combinedData.length > 0 ? (
          <>
            <div>
              <h3 className="text-lg font-medium mb-2">Water & Calorie Intake</h3>
              <div className="h-72">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => formatDate(value)}
                      />
                      <YAxis yAxisId="left" orientation="left" stroke="#06b6d4" />
                      <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
                      <Tooltip
                        labelFormatter={(label) => formatDate(label)}
                        formatter={(value, name) => {
                          if (name === "water") return [`${value} ml`, "Water Intake"];
                          if (name === "calories") return [`${value} kcal`, "Calorie Intake"];
                          return [value, name];
                        }}
                      />
                      <Bar yAxisId="left" dataKey="water" fill="#06b6d4" name="water" />
                      <Bar yAxisId="right" dataKey="calories" fill="#f97316" name="calories" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Health Metrics Over Time</h3>
              <div className="h-72">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => formatDate(value)}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label) => formatDate(label)}
                        formatter={(value, name) => {
                          if (name === "bmi") return [value, "BMI"];
                          if (name === "water") return [`${value} ml`, "Water"];
                          if (name === "calories") return [`${value} kcal`, "Calories"];
                          return [value, name];
                        }}
                      />
                      <Line type="monotone" dataKey="bmi" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Not enough data available to generate advanced charts.</p>
            <p className="text-sm mt-2">Continue tracking your health metrics to unlock insights.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

