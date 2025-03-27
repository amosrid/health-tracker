"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CalorieConfirmationDialog() {
  const [open, setOpen] = useState(false)
  const [calorieGoal, setCalorieGoal] = useState(0)
  const [waterGoal, setWaterGoal] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    // Check if we have a new calorie goal that hasn't been confirmed
    const savedCalorieGoal = localStorage.getItem("calorieGoal")
    const savedWaterGoal = localStorage.getItem("waterGoal")
    const calorieConfirmed = localStorage.getItem("calorieConfirmed")

    if (savedCalorieGoal) {
      setCalorieGoal(Number(savedCalorieGoal))
    }

    if (savedWaterGoal) {
      setWaterGoal(Number(savedWaterGoal))
    }

    // Only show dialog if we have goals and they haven't been confirmed
    if (savedCalorieGoal && savedWaterGoal && (!calorieConfirmed || calorieConfirmed !== savedCalorieGoal)) {
      setOpen(true)
      setConfirmed(false)
    } else {
      setConfirmed(true)
    }
  }, [])

  const handleConfirm = () => {
    // Mark as confirmed
    localStorage.setItem("calorieConfirmed", calorieGoal.toString())
    setConfirmed(true)
    setOpen(false)
  }

  if (confirmed) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Daily Targets</DialogTitle>
          <DialogDescription>
            Based on your BMI calculation, we've set the following daily targets for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Daily Calorie Target</p>
              <p className="text-sm text-muted-foreground">For safe, sustainable weight loss</p>
            </div>
            <p className="text-xl font-bold">{calorieGoal} kcal</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Daily Water Intake</p>
              <p className="text-sm text-muted-foreground">Recommended hydration</p>
            </div>
            <p className="text-xl font-bold">{waterGoal} ml</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Targets
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

