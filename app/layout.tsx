import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import ChatWidget from "@/components/chat-widget" // Import the new ChatWidget

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitTracker - Your Personal Fitness Dashboard",
  description: "Track your fitness activities, monitor health metrics, and achieve your wellness goals.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatWidget /> {/* Add the ChatWidget here */}
        </Providers>
      </body>
    </html>
  )
}
