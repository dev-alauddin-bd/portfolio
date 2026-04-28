
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { Toaster } from "react-hot-toast"
import LenisProvider from "./LenisProvider"

export const metadata: Metadata = {
  title: "MD ALAUDDIN | Full Stack Developer",
  description: "Senior Full Stack Architect specializing in high-performance web applications, scalable system design, and AI-driven solutions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`html {
          font-family: ${GeistSans.style.fontFamily};
          --font-sans: ${GeistSans.variable};
          --font-mono: ${GeistMono.variable};
        }`}</style>
      </head>
      <body>
        <ThemeProvider attribute="class"
          defaultTheme="dark"
          themes={["dark", "orange"]}
          enableSystem
          disableTransitionOnChange>
          <LenisProvider>
            {children}
          </LenisProvider>

          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
