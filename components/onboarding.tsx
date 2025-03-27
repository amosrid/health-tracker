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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, Utensils, Activity, ChevronRight } from "lucide-react"

export default function Onboarding() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 4

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")

    // Only show onboarding if it's the first visit and there's no user data yet
    const hasBmiData = localStorage.getItem("bmiHistory")
    const hasWaterData = localStorage.getItem("waterGoal")

    // If user already has data, mark onboarding as seen
    if (hasBmiData || hasWaterData) {
      localStorage.setItem("hasSeenOnboarding", "true")
      setOpen(false)
    } else if (!hasSeenOnboarding) {
      setOpen(true)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setOpen(false)
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to HealthTrack</DialogTitle>
          <DialogDescription>Let's get you started with tracking your health journey</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={`step-${step}`} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <TabsTrigger
                  key={i}
                  value={`step-${i + 1}`}
                  disabled
                  className={i + 1 <= step ? "bg-primary text-primary-foreground" : ""}
                >
                  {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="step-1" className="space-y-4 text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Droplet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Track Your Water Intake</h3>
              <p className="text-sm text-muted-foreground">
                Stay hydrated by tracking your daily water consumption. Set goals and get reminders.
              </p>
            </TabsContent>

            <TabsContent value="step-2" className="space-y-4 text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Monitor Your Calories</h3>
              <p className="text-sm text-muted-foreground">
                Log your meals and track your calorie intake with our extensive food database.
              </p>
            </TabsContent>

            <TabsContent value="step-3" className="space-y-4 text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Calculate Your BMI</h3>
              <p className="text-sm text-muted-foreground">
                Track your Body Mass Index and get personalized weight management plans.
              </p>
            </TabsContent>

            <TabsContent value="step-4" className="space-y-4 text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium">You're All Set!</h3>
              <p className="text-sm text-muted-foreground">
                Start your health journey today. Your data is stored locally and you can customize your experience in
                settings.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
          <Button onClick={nextStep}>
            {step < totalSteps ? (
              <>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

