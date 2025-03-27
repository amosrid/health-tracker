import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      // Return a fallback if date is invalid
      return "Invalid date"
    }
    return `${date.getMonth() + 1}/${date.getDate()}`
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

export function getLast7Days() {
  try {
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split("T")[0])
    }
    return dates
  } catch (error) {
    console.error("Error getting last 7 days:", error)
    // Return fallback dates if there's an error
    return Array(7)
      .fill("")
      .map((_, i) => `2023-01-${i + 1}`)
  }
}

