import { supabase } from "@/lib/supabase"

// Function to sync BMI data with Supabase
export async function syncBmiData() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    const savedBmiHistory = localStorage.getItem("bmiHistory")
    if (!savedBmiHistory) return false

    const bmiHistory = JSON.parse(savedBmiHistory)

    // Get existing BMI records from Supabase
    const { data: existingRecords } = await supabase.from("bmi_records").select("*").eq("user_id", user.id)

    // For each BMI record in local storage, check if it exists in Supabase
    for (const record of bmiHistory) {
      const existingRecord = existingRecords?.find((r) => r.date === record.date)

      if (existingRecord) {
        // Update existing record if BMI value is different
        if (existingRecord.bmi !== record.bmi) {
          await supabase.from("bmi_records").update({ bmi: record.bmi }).eq("id", existingRecord.id)
        }
      } else {
        // Insert new record
        await supabase.from("bmi_records").insert({
          user_id: user.id,
          date: record.date,
          bmi: record.bmi,
        })
      }
    }

    return true
  } catch (error) {
    console.error("Error syncing BMI data:", error)
    return false
  }
}

// Function to sync water intake data with Supabase
export async function syncWaterData() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    // Get last 30 days of water intake data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    })

    // Get existing water records from Supabase
    const { data: existingRecords } = await supabase
      .from("water_intake")
      .select("*")
      .eq("user_id", user.id)
      .in("date", last30Days)

    // For each day, check if water intake exists in local storage
    for (const date of last30Days) {
      const savedIntake = localStorage.getItem(`waterIntake_${date}`)
      if (!savedIntake) continue

      const intake = Number.parseInt(savedIntake)
      const existingRecord = existingRecords?.find((r) => r.date === date)

      if (existingRecord) {
        // Update existing record if intake value is different
        if (existingRecord.intake !== intake) {
          await supabase.from("water_intake").update({ intake }).eq("id", existingRecord.id)
        }
      } else {
        // Insert new record
        await supabase.from("water_intake").insert({
          user_id: user.id,
          date,
          intake,
        })
      }
    }

    return true
  } catch (error) {
    console.error("Error syncing water data:", error)
    return false
  }
}

// Function to sync calorie data with Supabase
export async function syncCalorieData() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    // Get last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    })

    // For each day, check if meals exist in local storage
    for (const date of last30Days) {
      const savedMeals = localStorage.getItem(`meals_${date}`)
      if (!savedMeals) continue

      try {
        const meals = JSON.parse(savedMeals)
        if (!Array.isArray(meals) || meals.length === 0) continue

        // Calculate total calories for the day
        const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)

        // Check if record exists for this date
        const { data: existingRecord } = await supabase
          .from("calorie_intake")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", date)
          .single()

        if (existingRecord) {
          // Update existing record
          await supabase
            .from("calorie_intake")
            .update({
              total_calories: totalCalories,
              meals: meals,
            })
            .eq("id", existingRecord.id)
        } else {
          // Insert new record
          await supabase.from("calorie_intake").insert({
            user_id: user.id,
            date,
            total_calories: totalCalories,
            meals: meals,
          })
        }
      } catch (error) {
        console.error(`Error processing meals for date ${date}:`, error)
      }
    }

    return true
  } catch (error) {
    console.error("Error syncing calorie data:", error)
    return false
  }
}

// Function to sync user settings with Supabase
export async function syncUserSettings() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    // Get settings from localStorage
    const waterGoal = localStorage.getItem("waterGoal")
    const glassSize = localStorage.getItem("glassSize")
    const unit = localStorage.getItem("unit")
    const gender = localStorage.getItem("gender")
    const activityLevel = localStorage.getItem("activityLevel")
    const age = localStorage.getItem("age")
    const goal = localStorage.getItem("goal")
    const height = localStorage.getItem("height")
    const weight = localStorage.getItem("weight")

    // Check if user settings exist
    const { data: existingSettings } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

    const settings = {
      water_goal: waterGoal ? Number.parseInt(waterGoal) : null,
      glass_size: glassSize ? Number.parseInt(glassSize) : null,
      unit: unit || "metric",
      gender: gender || "male",
      activity_level: activityLevel || "moderate",
      age: age ? Number.parseInt(age) : null,
      goal: goal || "ideal",
      height: height ? Number.parseFloat(height) : null,
      weight: weight ? Number.parseFloat(weight) : null,
    }

    if (existingSettings) {
      // Update existing settings
      await supabase.from("user_settings").update(settings).eq("id", existingSettings.id)
    } else {
      // Insert new settings
      await supabase.from("user_settings").insert({
        user_id: user.id,
        ...settings,
      })
    }

    return true
  } catch (error) {
    console.error("Error syncing user settings:", error)
    return false
  }
}

// Main function to sync all data
export async function syncAllData() {
  const bmiResult = await syncBmiData()
  const waterResult = await syncWaterData()
  const calorieResult = await syncCalorieData()
  const settingsResult = await syncUserSettings()

  return {
    bmi: bmiResult,
    water: waterResult,
    calories: calorieResult,
    settings: settingsResult,
    success: bmiResult && waterResult && calorieResult && settingsResult,
  }
}

// Function to load data from Supabase to local storage
export async function loadDataFromSupabase() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    // Load BMI data
    const { data: bmiRecords } = await supabase
      .from("bmi_records")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (bmiRecords && bmiRecords.length > 0) {
      const bmiHistory = bmiRecords.map((record) => ({
        date: record.date,
        bmi: record.bmi,
      }))
      localStorage.setItem("bmiHistory", JSON.stringify(bmiHistory))
    }

    // Load water intake data
    const { data: waterRecords } = await supabase
      .from("water_intake")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(30)

    if (waterRecords && waterRecords.length > 0) {
      waterRecords.forEach((record) => {
        localStorage.setItem(`waterIntake_${record.date}`, record.intake.toString())
      })
    }

    // Load calorie data
    const { data: calorieRecords } = await supabase
      .from("calorie_intake")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(30)

    if (calorieRecords && calorieRecords.length > 0) {
      calorieRecords.forEach((record) => {
        if (record.meals) {
          localStorage.setItem(`meals_${record.date}`, JSON.stringify(record.meals))
        }
      })
    }

    // Load user settings
    const { data: userSettings } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

    if (userSettings) {
      if (userSettings.water_goal) localStorage.setItem("waterGoal", userSettings.water_goal.toString())
      if (userSettings.glass_size) localStorage.setItem("glassSize", userSettings.glass_size.toString())
      if (userSettings.unit) localStorage.setItem("unit", userSettings.unit)
      if (userSettings.gender) localStorage.setItem("gender", userSettings.gender)
      if (userSettings.activity_level) localStorage.setItem("activityLevel", userSettings.activity_level)
      if (userSettings.age) localStorage.setItem("age", userSettings.age.toString())
      if (userSettings.goal) localStorage.setItem("goal", userSettings.goal)
      if (userSettings.height) localStorage.setItem("height", userSettings.height.toString())
      if (userSettings.weight) localStorage.setItem("weight", userSettings.weight.toString())
    }

    return true
  } catch (error) {
    console.error("Error loading data from Supabase:", error)
    return false
  }
}

