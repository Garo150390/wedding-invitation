import type React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Lato, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

// Load Google Fonts
const lato = Lato({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700', '900'],
    variable: '--font-lato',
})

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-cormorant',
})

export const metadata: Metadata = {
    title: 'Arev birthday',
    description: 'Invitation for Arev birthday',
    generator: 'v0.dev'
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${lato.variable} ${cormorant.variable}`}>
        {children}
        <Toaster />
        </body>
        </html>
    )
}


import './globals.css'
