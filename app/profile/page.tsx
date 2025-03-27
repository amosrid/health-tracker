"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Edit, Save, Calendar, Activity, Droplet, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-context"
import { Progress } from "@/components/ui/progress"
import { t } from "@/lib/i18n"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [healthData, setHealthData] = useState({
    bmi: null as number | null,
    bmiCategory: "",
    weight: null as number | null,
    height: null as number | null,
    waterGoal: null as number | null,
    waterIntake: null as number | null,
    calorieGoal: null as number | null,
    calorieIntake: null as number | null,
    age: null as number | null,
    gender: "",
    activityLevel: "",
    unit: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    // Set display name from user data
    setDisplayName(user.user_metadata?.name || user.email?.split("@")[0] || "User")

    // Load health data from localStorage
    loadHealthData()
  }, [user, router])

  const loadHealthData = () => {
    try {
      // Get today's date
      const today = new Date().toISOString().split("T")[0]

      // Load BMI data
      const savedBmiHistory = localStorage.getItem("bmiHistory")
      let latestBmi = null
      let bmiCategory = ""

      if (savedBmiHistory) {
        try {
          const parsed = JSON.parse(savedBmiHistory)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Sort by date (newest first)
            const sortedBmi = [...parsed].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            if (sortedBmi[0] && typeof sortedBmi[0].bmi === "number") {
              latestBmi = sortedBmi[0].bmi

              // Determine BMI category
              if (latestBmi < 18.5) {
                bmiCategory = t("bmi.category.underweight")
              } else if (latestBmi < 25) {
                bmiCategory = t("bmi.category.normal")
              } else if (latestBmi < 30) {
                bmiCategory = t("bmi.category.overweight")
              } else {
                bmiCategory = t("bmi.category.obese")
              }
            }
          }
        } catch (e) {
          console.error("Error parsing BMI history:", e)
        }
      }

      // Load water data
      const waterGoal = localStorage.getItem("waterGoal")
        ? Number.parseInt(localStorage.getItem("waterGoal") || "0")
        : null
      const waterIntake = localStorage.getItem(`waterIntake_${today}`)
        ? Number.parseInt(localStorage.getItem(`waterIntake_${today}`) || "0")
        : 0

      // Load calorie data
      const calorieGoal = localStorage.getItem("calorieGoal")
        ? Number.parseInt(localStorage.getItem("calorieGoal") || "0")
        : null

      // Calculate today's calorie intake
      let calorieIntake = 0
      const savedMeals = localStorage.getItem(`meals_${today}`)
      if (savedMeals) {
        try {
          const meals = JSON.parse(savedMeals)
          if (Array.isArray(meals)) {
            calorieIntake = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
          }
        } catch (e) {
          console.error("Error parsing meals:", e)
        }
      }

      // Load user details
      const height = localStorage.getItem("height") ? Number.parseFloat(localStorage.getItem("height") || "0") : null
      const weight = localStorage.getItem("weight") ? Number.parseFloat(localStorage.getItem("weight") || "0") : null
      const age = localStorage.getItem("age") ? Number.parseInt(localStorage.getItem("age") || "0") : null
      const gender = localStorage.getItem("gender") || ""
      const activityLevel = localStorage.getItem("activityLevel") || ""
      const unit = localStorage.getItem("unit") || "metric"

      setHealthData({
        bmi: latestBmi,
        bmiCategory,
        weight,
        height,
        waterGoal,
        waterIntake,
        calorieGoal,
        calorieIntake,
        age,
        gender,
        activityLevel,
        unit,
      })
    } catch (error) {
      console.error("Error loading health data:", error)
    }
  }

  const handleSaveProfile = () => {
    // Save display name to user metadata (in a real app, this would update the database)
    // For now, we'll just show a success message
    toast({
      title: t("profile.updated"),
      description: t("profile.updated.description"),
    })
    setIsEditing(false)
  }

  const formatMeasurement = (value: number | null, type: "weight" | "height") => {
    if (value === null) return t("profile.not.set")

    if (healthData.unit === "metric") {
      return type === "weight" ? `${value} kg` : `${value} cm`
    } else {
      return type === "weight" ? `${(value * 2.20462).toFixed(1)} lbs` : `${(value / 2.54).toFixed(1)} in`
    }
  }

  const getActivityLevelText = (level: string) => {
    switch (level) {
      case "sedentary":
        return t("activity.sedentary")
      case "light":
        return t("activity.light")
      case "moderate":
        return t("activity.moderate")
      case "active":
        return t("activity.active")
      case "very-active":
        return t("activity.very.active")
      default:
        return t("profile.not.set")
    }
  }

  const getBmiColor = (bmi: number | null) => {
    if (bmi === null) return "text-muted-foreground"
    if (bmi < 18.5) return "text-blue-500"
    if (bmi < 25) return "text-green-500"
    if (bmi < 30) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="max-w-[200px]"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{displayName}</h2>
                )}
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              className="mt-4 sm:mt-0"
              onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("profile.save")}
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("profile.edit")}
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("profile.member.since")}</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : t("profile.unknown")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("profile.last.login")}</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : t("profile.unknown")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("health.summary")}</CardTitle>
            <CardDescription>{t("health.summary.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">{t("bmi.status")}</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Activity className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{t("bmi.full")}</div>
                      <div className="text-sm text-muted-foreground">
                        {healthData.bmiCategory || t("bmi.not.calculated")}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getBmiColor(healthData.bmi)}`}>
                    {healthData.bmi !== null ? healthData.bmi.toFixed(1) : "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("water.intake")}</Label>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Droplet className="mr-2 h-5 w-5 text-blue-500" />
                      <div className="font-medium">{t("water.today")}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t("progress")}</span>
                        <span>
                          {healthData.waterIntake || 0} / {healthData.waterGoal || "—"}{" "}
                          {healthData.unit === "metric" ? "ml" : "oz"}
                        </span>
                      </div>
                      <Progress
                        value={healthData.waterGoal ? ((healthData.waterIntake || 0) / healthData.waterGoal) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("calories.intake")}</Label>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Utensils className="mr-2 h-5 w-5 text-orange-500" />
                      <div className="font-medium">{t("calories.today")}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t("progress")}</span>
                        <span>
                          {healthData.calorieIntake || 0} / {healthData.calorieGoal || "—"} kcal
                        </span>
                      </div>
                      <Progress
                        value={
                          healthData.calorieGoal ? ((healthData.calorieIntake || 0) / healthData.calorieGoal) * 100 : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">{t("height")}</Label>
                  <p className="font-medium">
                    {healthData.height !== null ? formatMeasurement(healthData.height, "height") : t("profile.not.set")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("weight")}</Label>
                  <p className="font-medium">
                    {healthData.weight !== null ? formatMeasurement(healthData.weight, "weight") : t("profile.not.set")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("age")}</Label>
                  <p className="font-medium">
                    {healthData.age !== null ? `${healthData.age} ${t("years")}` : t("profile.not.set")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("gender")}</Label>
                  <p className="font-medium">
                    {healthData.gender
                      ? healthData.gender.charAt(0).toUpperCase() + healthData.gender.slice(1)
                      : t("profile.not.set")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("activity.level")}</Label>
                  <p className="font-medium">
                    {healthData.activityLevel ? getActivityLevelText(healthData.activityLevel) : t("profile.not.set")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("measurement.units")}</Label>
                  <p className="font-medium">
                    {healthData.unit === "metric" ? t("units.metric") : t("units.imperial")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">{t("view.detailed.dashboard")}</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("ai.health.insights")}</CardTitle>
            <CardDescription>{t("ai.health.insights.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">{t("ai.health.insights.coming.soon")}</p>
              <p className="text-sm text-muted-foreground">{t("ai.health.insights.integration")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

