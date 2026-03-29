import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { isMockMode, MOCK_USER } from "@/lib/mock-data"
import { SessionMonitor } from "@/components/providers/session-monitor"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"

/**
 * Authenticated Layout
 *
 * Automatically protects all routes in the (authenticated) group.
 * Redirects to /login if user is not authenticated.
 * In mock mode, uses dummy user data.
 */
export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let userName = ""

  if (isMockMode()) {
    userName = MOCK_USER.fullname
  } else {
    const session = await auth()
    if (!session?.user) {
      redirect("/login")
    }
    userName = session?.user.fullname || ""
  }

  return (
    <>
      <SessionMonitor />
      <SidebarProvider>
        <AppSidebar user={{ name: userName }} />
        <SidebarInset>
          <AppTopbar />
          <div className="flex-1 p-6 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
