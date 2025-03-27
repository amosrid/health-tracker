"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-context"
import { syncAllData, loadDataFromSupabase } from "@/lib/data-sync"
import { Cloud, Download, Upload, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function DataSyncButton() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)

  if (!user) return null

  const handleSyncToCloud = async () => {
    setIsSyncing(true)
    try {
      const result = await syncAllData()

      if (result.success) {
        toast({
          title: "Data synced successfully",
          description: "Your health data has been saved to the cloud.",
        })
      } else {
        toast({
          title: "Sync partially completed",
          description: "Some data may not have been synced properly.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "There was an error syncing your data.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLoadFromCloud = async () => {
    setIsSyncing(true)
    try {
      const success = await loadDataFromSupabase()

      if (success) {
        toast({
          title: "Data loaded successfully",
          description: "Your health data has been loaded from the cloud.",
        })
        // Reload the page to reflect the new data
        window.location.reload()
      } else {
        toast({
          title: "Load failed",
          description: "There was an error loading your data.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Load failed",
        description: "There was an error loading your data.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isSyncing}>
          <Cloud className="mr-2 h-4 w-4" />
          {isSyncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            "Sync Data"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSyncToCloud}>
          <Upload className="mr-2 h-4 w-4" />
          Save to Cloud
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLoadFromCloud}>
          <Download className="mr-2 h-4 w-4" />
          Load from Cloud
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

