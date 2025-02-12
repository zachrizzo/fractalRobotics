import "./globals.css"
import { Inter } from "next/font/google"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import type React from "react"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'arial']
})

export const metadata = {
  title: "Fractal Robotics - Intelligent Home Automation",
  description: "Revolutionizing your home with intelligent automation solutions",
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
        <main className="min-h-screen flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

