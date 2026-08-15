//This is the single source of truth for dashboard navigation.

import {
  BriefcaseBusiness,
  FileText,
  UserRound,
  ClipboardList,
  CreditCard,
  Settings,
} from "lucide-react"

export const mainNavigation = [
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Resume",
    href: "/dashboard/resume",
    icon: FileText,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    title: "Application Status",
    href: "/dashboard/application-status",
    icon: ClipboardList,
  },
]

export const bottomNavigation = [
  {
    title: "Billing / Credits",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Profile Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export const dashboardPages = [
  {
    href: "/dashboard",
    title: "Dashboard",
  },
  ...mainNavigation.map(({ href, title }) => ({
    href,
    title,
  })),
  ...bottomNavigation.map(({ href, title }) => ({
    href,
    title,
  })),
]