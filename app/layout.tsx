import "./globals.css"
import { Inter } from "next/font/google"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import type React from "react"
import TrackingProvider from "@/components/TrackingProvider"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'arial']
})

export const metadata = {
  title: "Fractal Robotics - Smart Robots That Help",
  description: "Meet R1, our friendly robot helper that makes everyday tasks easier with advanced AI and safe physical capabilities.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navigation />
        <main className="min-h-screen flex flex-col">
          <TrackingProvider>{children}</TrackingProvider>
        </main>
        <Footer />
      </body>
    </html>
  )
}

