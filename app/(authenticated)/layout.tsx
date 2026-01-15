import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/infrastructure/auth"
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
  console.log(session)
  return (
    <>
      <SessionMonitor />
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader user={{ name: session?.fullname || "" }} />
        <main className="flex-1">
          <div className="px-6 md:px-8 pt-0 w-full">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
