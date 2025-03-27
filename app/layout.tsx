import type React from "react"
import ClientLayout from "./ClientLayout"

export const metadata = {
  title: "HealthTrack - Water, Calories & BMI Tracker",
  description: "Track your daily water intake, calories, and BMI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}



import './globals.css'