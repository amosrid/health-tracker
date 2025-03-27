"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplet, Plus, Minus, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Confetti from "@/components/confetti"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { t } from "@/lib/i18n"

export default function WaterTracker() {
  const [waterGoal, setWaterGoal] = useState(2000)
  const [glassSize, setGlassSize] = useState(250)
  const [currentIntake, setCurrentIntake] = useState(0)
  const [unit, setUnit] = useState("metric")
  const [showCelebration, setShowCelebration] = useState(false)
  const [customGlasses, setCustomGlasses] = useState<{ size: number; name: string }[]>([])
  const [newGlassSize, setNewGlassSize] = useState("")
  const [newGlassName, setNewGlassName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const today = new Date().toISOString().split("T")[0]
    const savedWaterGoal = localStorage.getItem("waterGoal")
    const savedGlassSize = localStorage.getItem("glassSize")
    const savedUnit = localStorage.getItem("unit")
    const savedIntake = localStorage.getItem(`waterIntake_${today}`)
    const savedCustomGlasses = localStorage.getItem("customGlasses")

    if (savedWaterGoal) setWaterGoal(Number.parseInt(savedWaterGoal))
    if (savedGlassSize) setGlassSize(Number.parseInt(savedGlassSize))
    if (savedUnit) setUnit(savedUnit)
    if (savedIntake) setCurrentIntake(Number.parseInt(savedIntake))
    if (savedCustomGlasses) setCustomGlasses(JSON.parse(savedCustomGlasses))
  }, [])

  useEffect(() => {
    // Save current intake to localStorage
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(`waterIntake_${today}`, currentIntake.toString())

    // Check if goal is reached
    if (currentIntake >= waterGoal && currentIntake - glassSize < waterGoal) {
      setShowCelebration(true)
      toast({
        title: "Goal Reached! 🎉",
        description: "Congratulations! You've reached your daily water intake goal.",
      })

      // Hide celebration after 5 seconds
      setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
    }
  }, [currentIntake, waterGoal, glassSize, toast])

  const addWater = (size: number) => {
    setCurrentIntake((prev) => prev + size)
  }

  const removeWater = () => {
    setCurrentIntake((prev) => Math.max(0, prev - glassSize))
  }

  const resetWater = () => {
    setCurrentIntake(0)
  }

  const addCustomGlass = () => {
    if (!newGlassSize || !newGlassName) return

    const size = Number.parseInt(newGlassSize)
    if (isNaN(size) || size <= 0) return

    const newGlass = { size, name: newGlassName }
    const updatedGlasses = [...customGlasses, newGlass]

    setCustomGlasses(updatedGlasses)
    localStorage.setItem("customGlasses", JSON.stringify(updatedGlasses))

    setNewGlassSize("")
    setNewGlassName("")
  }

  const progressPercentage = Math.min(100, (currentIntake / waterGoal) * 100)

  const formatVolume = (volume: number) => {
    if (unit === "imperial") {
      // Convert ml to oz (approximate)
      return `${(volume / 29.574).toFixed(1)} oz`
    }
    return `${volume} ml`
  }

  // Predefined glass sizes
  const standardGlasses = [
    { size: 150, name: t("water.glass.small", undefined) || "Small" },
    { size: 250, name: t("water.glass.medium", undefined) || "Medium" },
    { size: 350, name: t("water.glass.large", undefined) || "Large" },
    { size: 500, name: t("water.glass.xl", undefined) || "XL" },
  ]

  // Combine standard and custom glasses
  const allGlasses = [...standardGlasses, ...customGlasses]

  return (
    <div className="space-y-4">
      {showCelebration && <Confetti />}

      {/* Today's Progress Card - Now placed ABOVE Water Intake */}
      <Card>
        <CardHeader>
          <CardTitle>{t("water.progress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted-foreground stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${progressPercentage * 2.51} 251.2`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplet
                  className={`h-16 w-16 ${progressPercentage >= 100 ? "text-blue-500 fill-blue-500" : "text-blue-500"}`}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Intake Card - Now placed BELOW Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t("water.title")}</CardTitle>
          <CardDescription>{t("water.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-primary">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block">
                  {formatVolume(currentIntake)} / {formatVolume(waterGoal)}
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2 mt-1" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {allGlasses.map((glass, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 p-0 flex flex-col items-center justify-center"
                onClick={() => addWater(glass.size)}
              >
                <Droplet
                  className={`h-8 w-8 ${currentIntake > 0 ? "text-blue-500 fill-blue-500 opacity-50" : "text-gray-300"}`}
                />
                <span className="text-xs mt-1">{glass.name}</span>
                <span className="text-xs">{formatVolume(glass.size)}</span>
              </Button>
            ))}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-20 p-0 flex flex-col items-center justify-center">
                  <Plus className="h-8 w-8 text-gray-300" />
                  <span className="text-xs mt-1">{t("water.add.custom")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("water.add.custom.title")}</DialogTitle>
                  <DialogDescription>{t("water.add.custom.description")}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="glass-name">{t("water.glass.name")}</Label>
                    <Input
                      id="glass-name"
                      placeholder={t("water.glass.name.placeholder")}
                      value={newGlassName}
                      onChange={(e) => setNewGlassName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="glass-size">
                      {t("water.glass.size")} ({unit === "metric" ? "ml" : "oz"})
                    </Label>
                    <Input
                      id="glass-size"
                      type="number"
                      placeholder="300"
                      value={newGlassSize}
                      onChange={(e) => setNewGlassSize(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={addCustomGlass}>{t("water.add.glass")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="icon" onClick={removeWater}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="default" onClick={() => addWater(glassSize)}>
            <Droplet className="h-4 w-4 mr-2" />
            {t("water.add")}
          </Button>
          <Button variant="outline" size="icon" onClick={resetWater}>
            <Award className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

