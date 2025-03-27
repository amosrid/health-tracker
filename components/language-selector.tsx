"use client"

import { useState, useEffect } from "react"
import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { setLocale, getLocale, availableLocales } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

export default function LanguageSelector() {
  const [mounted, setMounted] = useState(false)
  const [currentLocale, setCurrentLocale] = useState(getLocale())
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)

    // Listen for locale changes
    const handleLocaleChange = () => {
      setCurrentLocale(getLocale())
    }

    window.addEventListener("localeChanged", handleLocaleChange)

    return () => {
      window.removeEventListener("localeChanged", handleLocaleChange)
    }
  }, [])

  const changeLanguage = (localeCode: string) => {
    try {
      setLocale(localeCode as any)
      setCurrentLocale(localeCode as any)

      // Force a page reload to apply translations
      toast({
        title: "Language changed",
        description: `The application language has been changed to ${availableLocales.find((l) => l.code === localeCode)?.name}.`,
      })

      // Reload the page after a short delay to allow the toast to be seen
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error changing language:", error)
    }
  }

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {availableLocales.find((locale) => locale.code === currentLocale)?.name || "English"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLocales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => changeLanguage(locale.code)}
            className="flex items-center justify-between"
          >
            {locale.name}
            {currentLocale === locale.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

