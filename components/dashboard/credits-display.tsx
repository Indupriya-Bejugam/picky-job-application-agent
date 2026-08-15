"use client"

import { CreditCard } from "lucide-react"

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function CreditsDisplay() {
  const remainingCredits = 50
  const totalCredits = 200

  const percentage = (remainingCredits / totalCredits) * 100

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={`${remainingCredits} credits remaining`}
        className="
          h-auto
          min-h-20
          rounded-lg
          bg-primary/10
          px-3
          py-3
          hover:bg-primary/15
          group-data-[collapsible=icon]:min-h-11
          group-data-[collapsible=icon]:justify-center
          group-data-[collapsible=icon]:px-0
          group-data-[collapsible=icon]:py-0
        "
      >
        {/* Credit icon */}
        <div
          className="
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-primary
            text-primary-foreground
          "
        >
          <CreditCard className="size-5" />
        </div>

        {/* Credit information - hidden when collapsed */}
        <div
          className="
            grid
            min-w-0
            flex-1
            text-left
            leading-tight
            group-data-[collapsible=icon]:hidden
          "
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold">
              Credits Remaining
            </span>

            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {remainingCredits}/{totalCredits}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="mt-1.5 text-xs text-muted-foreground">
            {remainingCredits} credits available
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}