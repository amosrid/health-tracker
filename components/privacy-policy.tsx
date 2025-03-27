"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, Lock, Eye, Database } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPolicy() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-muted-foreground">
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription>How we handle your health data</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Lock className="mr-2 h-5 w-5 text-primary" />
                Data Storage
              </h3>
              <p className="text-sm">
                HealthTrack stores all your health data locally on your device. We use your browser's localStorage and
                IndexedDB to securely store your information. This means your data stays on your device and is not
                transmitted to our servers unless you explicitly choose to enable cloud sync.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Eye className="mr-2 h-5 w-5 text-primary" />
                Data Usage
              </h3>
              <p className="text-sm">
                We use your data solely to provide you with health insights and tracking functionality. We do not sell,
                rent, or share your personal information with third parties. Any analytics we collect are anonymized and
                used only to improve the app's functionality.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Database className="mr-2 h-5 w-5 text-primary" />
                Data Control
              </h3>
              <p className="text-sm">
                You have complete control over your data. You can export, delete, or reset your data at any time from
                the settings page. If you choose to delete your account, all associated data will be permanently removed
                from our systems.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Permissions</h3>
              <p className="text-sm">HealthTrack may request the following permissions:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Storage access (to save your health data locally)</li>
                <li>Notification permissions (for reminders and alerts)</li>
                <li>Camera access (for scanning food labels, if you enable this feature)</li>
              </ul>
              <p className="text-sm mt-2">
                All permissions are optional and can be revoked at any time through your device settings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Updates</h3>
              <p className="text-sm">
                This privacy policy may be updated periodically. We will notify you of any significant changes. Last
                updated: March 2023.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

