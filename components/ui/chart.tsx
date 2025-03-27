"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContextValue {
  config: ChartConfig
  colors: string[]
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartProvider")
  }
  return context
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig
}

function ChartContainer({ config = {}, className, children, ...props }: ChartContainerProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Make sure config is an object, not null or undefined
  const safeConfig = config && typeof config === "object" ? config : {}

  // Generate colors for the chart
  const colors = React.useMemo(() => {
    // Make sure we're iterating over a valid object
    if (!safeConfig || typeof safeConfig !== "object") {
      return []
    }

    try {
      return Object.entries(safeConfig).map(([key, value]) => {
        return value?.color || "hsl(var(--chart-1))"
      })
    } catch (error) {
      console.error("Error generating chart colors:", error)
      return []
    }
  }, [safeConfig])

  // Update CSS variables when the theme changes
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={cn("h-full w-full", className)} {...props} />
  }

  return (
    <ChartContext.Provider
      value={{
        config: safeConfig,
        colors,
      }}
    >
      <div
        className={cn("h-full w-full", className)}
        {...props}
        style={
          {
            "--chart-1": "222.2 84% 4.9%",
            "--chart-2": "217.2 91.2% 59.8%",
            "--chart-3": "280 83.7% 40.6%",
            "--chart-4": "201.3 96.3% 32.2%",
            "--chart-5": "358.7 100% 61.8%",
            "--chart-6": "262.1 83.3% 57.8%",
            "--chart-7": "24.6 95% 53.1%",
            "--chart-8": "261.2 72.6% 47.8%",
            "--chart-9": "187.9 100% 42.2%",
            "--chart-10": "48.5 100% 50.6%",
            ...Object.fromEntries(
              Object.entries(safeConfig || {}).map(([key, value], index) => {
                return [
                  `--color-${key}`,
                  theme === "dark" && value?.color
                    ? value.color.replace("hsl(", "hsl(").replace(")", ")")
                    : value?.color || `var(--chart-${index + 1})`,
                ]
              }),
            ),
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

export { ChartContainer, useChart }

