import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ToastContainerWrapper } from "@/components/ui/Toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RisparmiApp - Trova le migliori offerte nei supermercati",
  description: "Scopri le migliori offerte nei supermercati vicino a te con RisparmiApp",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ToastContainerWrapper />
        </Providers>
      </body>
    </html>
  )
}
