import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WaterTracker from "@/components/water-tracker"
import CalorieCounter from "@/components/calorie-counter"
import BmiCalculator from "@/components/bmi-calculator"
import { Settings, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import CalorieConfirmationDialog from "@/components/calorie-confirmation-dialog"
import LatestWeightManagementPlan from "@/components/latest-weight-management-plan"
import Onboarding from "@/components/onboarding"
import UserProfile from "@/components/auth/user-profile"
import { t } from "@/lib/i18n"

export default function Home() {
  return (
    <main className="container max-w-6xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("app.name")}</h1>
        <div className="flex gap-2 items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <LayoutDashboard className="h-5 w-5" />
              <span className="sr-only">{t("nav.dashboard")}</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">{t("settings.title")}</span>
            </Button>
          </Link>
          <UserProfile />
        </div>
      </div>

      <Tabs defaultValue="bmi" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="water">{t("nav.water")}</TabsTrigger>
          <TabsTrigger value="calories">{t("nav.calories")}</TabsTrigger>
          <TabsTrigger value="bmi">{t("nav.bmi")}</TabsTrigger>
        </TabsList>
        <TabsContent value="water">
          <WaterTracker />
        </TabsContent>
        <TabsContent value="calories">
          <CalorieCounter />
        </TabsContent>
        <TabsContent value="bmi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <BmiCalculator />
            </div>
            <div className="hidden lg:block">
              <LatestWeightManagementPlan />
            </div>
          </div>
          {/* Show on mobile/tablet as a separate section */}
          <div className="lg:hidden">
            <LatestWeightManagementPlan />
          </div>
        </TabsContent>
      </Tabs>
      <CalorieConfirmationDialog />
      <Onboarding />
    </main>
  )
}

