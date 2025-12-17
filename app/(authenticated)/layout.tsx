import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/infrastructure/auth"
import { AppSidebar } from "@/components/app-sidebar"
import AppHeader from "@/components/app-header"
import { SessionMonitor } from "@/components/providers/session-monitor"

/**
 * Authenticated Layout
 *
 * Automatically protects all routes in the (authenticated) group.
 * Redirects to /login if user is not authenticated.
 */
export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check authentication - this runs on the server
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <>
      <SessionMonitor />
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <div className="p-6 md:p-8 pt-0 w-full">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
