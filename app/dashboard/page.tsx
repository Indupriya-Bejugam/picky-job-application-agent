import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single()

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "there"

  return (
    <div className="min-h-full bg-muted/20">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {displayName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Here's an overview of your job search.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                Track your job applications
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Letters</CardTitle>
              <CardDescription>
                AI-generated cover letters
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="truncate text-sm text-muted-foreground">
                {profile?.email ?? user.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}