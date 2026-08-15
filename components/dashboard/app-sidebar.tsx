"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  mainNavigation,
  bottomNavigation,
} from "@/lib/dashboard/navigation"

import { CreditsDisplay } from "./credits-display"

type AppSidebarProps = {
  user: {
    name: string
    email: string
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">

      {/* =========================
          HEADER / BRAND
      ========================== */}
      <SidebarHeader className="pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="JobBuddy AI"
              className="h-12"
            >
              <Link
                href="/dashboard"
                className="flex w-full items-center gap-3"
              >
                {/* Logo */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-5" />
                </div>

                {/* Brand */}
                <div className="min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="block truncate text-base font-semibold">
                    JobBuddy
                  </span>

                  <span className="block truncate text-xs text-muted-foreground">
                    AI
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      {/* =========================
          SIDEBAR CONTENT
      ========================== */}
      <SidebarContent className="flex flex-col ">

        {/* MAIN NAVIGATION */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide group-data-[collapsible=icon]:hidden">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {mainNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-11"
                    >
                      <Link
                        href={item.href}
                        className="flex w-full items-center gap-3"
                      >
                        <item.icon className="size-5 shrink-0" />

                        <span className="truncate text-[15px] font-medium group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* =========================
            BOTTOM SIDEBAR SECTION
            Stays near bottom
        ========================== */}
        <SidebarGroup className="mt-auto pb-2">
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Credits */}
              <CreditsDisplay />

              {/* Billing / Settings */}
              {bottomNavigation
                .filter(
                  (item) => item.href !== "/dashboard/billing"
                )
                .map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="h-11"
                      >
                        <Link
                          href={item.href}
                          className="flex w-full items-center gap-3"
                        >
                          <item.icon className="size-5 shrink-0" />

                          <span className="truncate text-[15px] font-medium group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>


      {/* =========================
          USER FOOTER
      ========================== */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={user.name}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <span className="text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-[15px] font-medium">
                  {user.name}
                </span>

                <span className="block truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}