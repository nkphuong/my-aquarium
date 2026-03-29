import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "sonner"
import { clsx } from "clsx"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "AquaHeart - Care That Comes from the Heart",
  description: "Your fish are waiting for you. Give them the love they deserve with AI-powered aquarium management.",
  // icons: {
  //   icon: [
  //     {
  //       url: "/icon-light-32x32.png",
  //       media: "(prefers-color-scheme: light)",
  //     },
  //     {
  //       url: "/icon-dark-32x32.png",
  //       media: "(prefers-color-scheme: dark)",
  //     },
  //     {
  //       url: "/icon.svg",
  //       type: "image/svg+xml",
  //     },
  //   ],
  //   apple: "/apple-icon.png",
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={clsx(poppins.variable, inter.variable, "font-sans antialiased")}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
