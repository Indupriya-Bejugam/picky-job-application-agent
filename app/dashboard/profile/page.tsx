import { getProfile } from "@/app/actions/profile"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const result = await getProfile()

  if (!result.success) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {result.error}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and edit the information extracted from your resume.
        </p>
      </div>

      <ProfileForm data={result.data} />
    </div>
  )
}