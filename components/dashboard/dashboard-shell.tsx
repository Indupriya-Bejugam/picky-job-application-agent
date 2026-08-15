"use client"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { TooltipProvider } from "@/components/ui/tooltip"

import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"

type DashboardShellProps = {
  children: React.ReactNode
  user: {
    name: string
    email: string
  }
}

export function DashboardShell({
  children,
  user,
}: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} />

        <SidebarInset>
          <DashboardHeader />

          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}