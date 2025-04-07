import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Lato, Cormorant_Garamond } from "next/font/google"

// Load Google Fonts
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Roman & Svetlana Wedding",
  description: "Wedding invitation for Roman & Svetlana",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  )
}



import './globals.css'