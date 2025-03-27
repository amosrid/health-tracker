"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WeightManagementPlan from "@/components/weight-management-plan"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function LatestWeightManagementPlan() {
  const [latestBmi, setLatestBmi] = useState<number | null>(null)
  const [userDetails, setUserDetails] = useState({
    height: 0,
    weight: 0,
    age: 0,
    gender: "male",
    activityLevel: "moderate",
    unit: "metric",
  })
  const [showPlan, setShowPlan] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Load BMI history
      const savedBmiHistory = localStorage.getItem("bmiHistory")
      if (savedBmiHistory) {
        try {
          const parsed = JSON.parse(savedBmiHistory)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Filter out invalid entries and create a safe copy to sort
            const validEntries = parsed.filter(
              (entry) => entry && typeof entry === "object" && "date" in entry && "bmi" in entry && !isNaN(entry.bmi),
            )

            if (validEntries.length > 0) {
              // Sort by date (oldest to newest) for display
              validEntries.sort((a, b) => {
                try {
                  return new Date(a.date).getTime() - new Date(b.date).getTime()
                } catch (e) {
                  return 0
                }
              })

              if (validEntries[0] && typeof validEntries[0].bmi === "number") {
                setLatestBmi(validEntries[0].bmi)
              }
            }
          }
        } catch (e) {
          console.error("Error parsing BMI history:", e)
          setError("Failed to parse BMI history data")
        }
      }

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
      console.error("Error loading weight management plan data:", error)
      setError("Failed to load weight management plan data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Second useEffect to handle latestBmi changes
  useEffect(() => {
    if (latestBmi && latestBmi >= 25 && userDetails.height > 0 && userDetails.weight > 0 && userDetails.age > 0) {
      setShowPlan(true)
    }
  }, [latestBmi, userDetails])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading plan data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!showPlan) {
    return (
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
            <Link href="/dashboard">
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Weight Management Plan</CardTitle>
        <CardDescription>Based on your latest BMI calculation</CardDescription>
      </CardHeader>
      <CardContent>
        {latestBmi && userDetails.height > 0 && userDetails.weight > 0 && (
          <WeightManagementPlan
            currentBmi={latestBmi}
            height={userDetails.height}
            weight={userDetails.weight}
            age={userDetails.age}
            gender={userDetails.gender}
            activityLevel={userDetails.activityLevel}
            unit={userDetails.unit}
          />
        )}
      </CardContent>
    </Card>
  )
}

