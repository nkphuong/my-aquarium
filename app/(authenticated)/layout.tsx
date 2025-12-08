import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AppSidebar />
      <main className="md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </>
  )
}
