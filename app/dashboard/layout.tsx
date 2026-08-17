import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ResumeOnboardingDialog } from "@/components/onboarding/resume-onboarding-dialog"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, email, onboarding_completed_at"
    )
    .eq("id", user.id)
    .single()

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User"

  const needsOnboarding =
    !profile?.onboarding_completed_at

  return (
    <>
      <DashboardShell
        user={{
          name: displayName,
          email: profile?.email || user.email || "",
        }}
      >
        {children}
      </DashboardShell>

      <ResumeOnboardingDialog
        open={needsOnboarding}
      />
    </>
  )
}