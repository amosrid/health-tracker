"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Utensils, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { indonesianFoods } from "@/lib/food-database"

export default function CalorieCounter() {
  const [calorieGoal, setCalorieGoal] = useState(2000)
  const [currentCalories, setCurrentCalories] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [meals, setMeals] = useState<{ name: string; calories: number; time: string }[]>([])
  const [selectedFood, setSelectedFood] = useState<{ name: string; calories: number } | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const today = new Date().toISOString().split("T")[0]
    const savedCalorieGoal = localStorage.getItem("calorieGoal")
    const savedMeals = localStorage.getItem(`meals_${today}`)

    if (savedCalorieGoal) setCalorieGoal(Number.parseInt(savedCalorieGoal))
    if (savedMeals) {
      const parsedMeals = JSON.parse(savedMeals)
      setMeals(parsedMeals)

      // Calculate total calories
      const total = parsedMeals.reduce((sum: number, meal: { calories: number }) => sum + meal.calories, 0)
      setCurrentCalories(total)
    }
  }, [])

  useEffect(() => {
    // Save meals to localStorage
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(`meals_${today}`, JSON.stringify(meals))
  }, [meals])

  const addMeal = () => {
    if (selectedFood) {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      const newMeal = {
        name: selectedFood.name,
        calories: selectedFood.calories * quantity,
        time: timeString,
      }

      setMeals([...meals, newMeal])
      setCurrentCalories((prev) => prev + newMeal.calories)
      setSelectedFood(null)
      setQuantity(1)
      setDialogOpen(false)
    }
  }

  const removeMeal = (index: number) => {
    const removedCalories = meals[index].calories
    const updatedMeals = meals.filter((_, i) => i !== index)
    setMeals(updatedMeals)
    setCurrentCalories((prev) => prev - removedCalories)
  }

  const filteredFoods = indonesianFoods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const progressPercentage = Math.min(100, (currentCalories / calorieGoal) * 100)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Calorie Intake</CardTitle>
          <CardDescription>Track your daily nutrition</CardDescription>
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
                  {currentCalories} / {calorieGoal} kcal
                </span>
              </div>
            </div>
            <Progress
              value={progressPercentage}
              className={`h-2 mt-1 ${progressPercentage > 100 ? "bg-red-200" : ""}`}
              indicatorClassName={progressPercentage > 100 ? "bg-red-500" : ""}
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Food</DialogTitle>
                <DialogDescription>Search for Indonesian foods to add to your daily log</DialogDescription>
              </DialogHeader>

              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search foods..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10"
                  />
                </div>
                <Button type="submit" size="sm" className="px-3">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-72 rounded-md border p-2">
                <div className="space-y-2">
                  {filteredFoods.map((food, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded cursor-pointer hover:bg-muted ${selectedFood?.name === food.name ? "bg-muted" : ""}`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">{food.calories} kcal per serving</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {selectedFood && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="quantity"
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseFloat(e.target.value) || 1)}
                    />
                    <div className="text-sm">{(selectedFood.calories * quantity).toFixed(0)} kcal</div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button onClick={addMeal} disabled={!selectedFood}>
                  Add to Log
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Utensils className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>No meals logged today</p>
              <p className="text-sm">Add your first meal to start tracking</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {meals.map((meal, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-sm text-muted-foreground">{meal.time}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div>{meal.calories} kcal</div>
                      <Button variant="ghost" size="sm" onClick={() => removeMeal(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

