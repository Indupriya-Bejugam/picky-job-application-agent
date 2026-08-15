"use client"

import { LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { dashboardPages } from "@/lib/dashboard/navigation"

import { createClient } from "@/lib/supabase/client"

export function DashboardHeader() {
  const pathname = usePathname()

  const supabase = createClient()

  const currentPage =
    dashboardPages.find(
      (page) => page.href === pathname
    )

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = "/sign-in"
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger />

      <div className="h-5 w-px bg-border" />

      <h1 className="text-sm font-medium">
        {currentPage?.title ?? "Dashboard"}
      </h1>

      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">
            Sign out
          </span>
        </Button>
      </div>
    </header>
  )
}