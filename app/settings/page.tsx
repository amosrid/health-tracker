"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import ThemeCustomizer from "@/components/theme-customizer"
import LanguageSelector from "@/components/language-selector"
import PrivacyPolicy from "@/components/privacy-policy"
import { t } from "@/lib/i18n"
import DataSyncButton from "@/components/auth/data-sync-button"

export default function Settings() {
  const [waterGoal, setWaterGoal] = useState(2000)
  const [glassSize, setGlassSize] = useState(250)
  const [unit, setUnit] = useState("metric")
  const [darkMode, setDarkMode] = useState(false)
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [goal, setGoal] = useState("ideal")

  useEffect(() => {
    // Load settings from localStorage
    const savedWaterGoal = localStorage.getItem("waterGoal")
    const savedGlassSize = localStorage.getItem("glassSize")
    const savedUnit = localStorage.getItem("unit")
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedGender = localStorage.getItem("gender")
    const savedActivityLevel = localStorage.getItem("activityLevel")
    const savedAge = localStorage.getItem("age")
    const savedGoal = localStorage.getItem("goal")

    if (savedWaterGoal) setWaterGoal(Number.parseInt(savedWaterGoal))
    if (savedGlassSize) setGlassSize(Number.parseInt(savedGlassSize))
    if (savedUnit) setUnit(savedUnit)
    if (savedDarkMode) setDarkMode(savedDarkMode === "true")
    if (savedGender) setGender(savedGender)
    if (savedActivityLevel) setActivityLevel(savedActivityLevel)
    if (savedAge) setAge(savedAge)
    if (savedGoal) setGoal(savedGoal)

    // Apply dark mode if needed
    if (savedDarkMode === "true") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("waterGoal", waterGoal.toString())
    localStorage.setItem("glassSize", glassSize.toString())
    localStorage.setItem("unit", unit)
    localStorage.setItem("darkMode", darkMode.toString())
    localStorage.setItem("gender", gender)
    localStorage.setItem("activityLevel", activityLevel)
    localStorage.setItem("age", age)
    localStorage.setItem("goal", goal)

    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    saveSettings()
  }, [waterGoal, glassSize, unit, darkMode, gender, activityLevel, age, goal])

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Water Tracking</CardTitle>
            <CardDescription>Customize your hydration goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="waterGoal">Daily Water Goal ({unit === "metric" ? "ml" : "oz"})</Label>
              <Input
                id="waterGoal"
                type="number"
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="glassSize">Default Glass Size ({unit === "metric" ? "ml" : "oz"})</Label>
              <Select value={glassSize.toString()} onValueChange={(value) => setGlassSize(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select glass size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">Small (150 {unit === "metric" ? "ml" : "oz"})</SelectItem>
                  <SelectItem value="250">Medium (250 {unit === "metric" ? "ml" : "oz"})</SelectItem>
                  <SelectItem value="350">Large (350 {unit === "metric" ? "ml" : "oz"})</SelectItem>
                  <SelectItem value="500">Extra Large (500 {unit === "metric" ? "ml" : "oz"})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your profile for accurate calculations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male-setting" />
                  <Label htmlFor="male-setting">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female-setting" />
                  <Label htmlFor="female-setting">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-setting">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activity-setting">
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
              <Label>Fitness Goal</Label>
              <RadioGroup value={goal} onValueChange={setGoal} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ideal" id="ideal-setting" />
                  <Label htmlFor="ideal-setting">Achieve Ideal BMI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bulking" id="bulking-setting" />
                  <Label htmlFor="bulking-setting">Bulking</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Label>Data Synchronization</Label>
              <DataSyncButton />
            </div>
            <div className="flex items-center justify-between mb-4">
              <Label>Theme Customization</Label>
              <ThemeCustomizer />
            </div>

            <div className="space-y-2">
              <Label>Measurement Units</Label>
              <RadioGroup value={unit} onValueChange={setUnit} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric">Metric (ml, kg)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial">Imperial (oz, lb)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 mt-4">
              <Label>{t("settings.language")}</Label>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Select your preferred language</span>
                <LanguageSelector />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 text-center">
        <PrivacyPolicy />
      </div>
    </div>
  )
}

