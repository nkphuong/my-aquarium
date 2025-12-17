'use client'

import Link from "next/link"
import { Bell, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AppHeader() {
  async function handleLogout() {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/80 backdrop-blur-md px-6 lg:px-10 py-3 mb-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="text-emerald-500 size-8">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <h2 className="text-foreground text-xl font-bold leading-tight tracking-[-0.015em]">
          AquaCare
        </h2>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link href="/tanks" className="text-emerald-500">
          My Tanks
        </Link>
        <Link
          href="/species"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Species
        </Link>
        <Link
          href="/maintenance"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Maintenance
        </Link>
        <Link
          href="/community"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Community
        </Link>
      </nav>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center p-2 rounded-full text-muted-foreground hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <span className="hidden sm:block text-sm font-bold text-foreground">
            Alex Waterfield
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Avatar className="size-10 ring-2 ring-emerald-500/20 cursor-pointer">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAIEN2BfKPokeFrVfM3ENus0TTtbY9K23T2mlVaQ_ooPR3ijeErGUqnnOq0Ffv6FbL7QRV29B78HJ4a866LKO8zXJsSFxeO2J06CsFd5MmfDtkyYY3OydvgR6NoQ-wZ2_JsF9UbR0Ve34Hj_nfJWz0cqsqQC1hK5_ZCvLSXUp-y1vUDGrhXtddPp41SNQYpgRLSIIdHVaorEO5E72q8xj9TgavILKOFj6M8aq3Rli7ohK-MG1uNWpyI4T3YOXbPOCnDe6QbHbuSm8" />
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
