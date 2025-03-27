"use client"

import { useState, useEffect } from "react"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { t } from "@/lib/i18n"

const themes = [
  {
    name: "Default",
    primaryColor: "hsl(221.2 83.2% 53.3%)",
    primaryLight: "hsl(217.2 91.2% 59.8%)",
    accentColor: "hsl(262.1 83.3% 57.8%)",
  },
  {
    name: "Green",
    primaryColor: "hsl(142.1 76.2% 36.3%)",
    primaryLight: "hsl(142.1 70.6% 45.3%)",
    accentColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    name: "Purple",
    primaryColor: "hsl(262.1 83.3% 57.8%)",
    primaryLight: "hsl(263.4 70% 50.4%)",
    accentColor: "hsl(221.2 83.2% 53.3%)",
  },
  {
    name: "Orange",
    primaryColor: "hsl(24.6 95% 53.1%)",
    primaryLight: "hsl(20.5 90.2% 48.2%)",
    accentColor: "hsl(43 96% 56.1%)",
  },
  {
    name: "Pink",
    primaryColor: "hsl(339 90.6% 51.4%)",
    primaryLight: "hsl(330 81.1% 60.1%)",
    accentColor: "hsl(262.1 83.3% 57.8%)",
  },
]

export default function ThemeCustomizer() {
  const [theme, setTheme] = useState(themes[0])
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("selectedTheme")
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme)
        setTheme(parsedTheme)
        applyTheme(parsedTheme)
      } catch (e) {
        console.error("Error parsing saved theme:", e)
      }
    }
  }, [])

  const applyTheme = (selectedTheme: (typeof themes)[0]) => {
    if (!mounted) return

    // Apply CSS variables to the document root
    const root = document.documentElement

    // Set primary color
    root.style.setProperty("--primary", selectedTheme.primaryColor.replace("hsl(", "").replace(")", ""))

    // Set accent color
    root.style.setProperty("--accent", selectedTheme.accentColor.replace("hsl(", "").replace(")", ""))

    // Update button and other UI elements that use primary color
    root.style.setProperty("--ring", selectedTheme.primaryLight.replace("hsl(", "").replace(")", ""))

    // Update the theme in localStorage
    localStorage.setItem("selectedTheme", JSON.stringify(selectedTheme))
  }

  const selectTheme = (selectedTheme: (typeof themes)[0]) => {
    setTheme(selectedTheme)
    applyTheme(selectedTheme)

    // Show toast notification
    toast({
      title: t("theme.changed"),
      description: t("theme.changed.description").replace("{theme}", selectedTheme.name),
    })

    // Force reload to apply theme changes throughout the app
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  if (!mounted) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Palette className="mr-2 h-4 w-4" />
          <span>{t("settings.theme")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">{t("settings.theme")}</h4>
            <p className="text-xs text-muted-foreground">{t("theme.customize")}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <div
                key={t.name}
                className={cn(
                  "cursor-pointer space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground",
                  theme.name === t.name && "bg-accent text-accent-foreground",
                )}
                onClick={() => selectTheme(t)}
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-5 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                  {theme.name === t.name && <Check className="h-4 w-4" />}
                </div>
                <div className="text-xs">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

