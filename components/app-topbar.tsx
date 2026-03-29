'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tanks': 'My Tanks',
  '/tanks/create': 'Create Tank',
  '/chat': 'Chat',
  '/diagnosis': 'Diagnosis',
}

export function AppTopbar() {
  const pathname = usePathname()
  const label = routeLabels[pathname] || 'AquaHeart'

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </header>
  )
}
