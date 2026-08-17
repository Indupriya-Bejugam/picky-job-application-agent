import { getResumes } from "@/app/actions/resume"
import { ResumeList } from "@/components/resume/resume-list"
import { ResumeUpload } from "@/components/resume/resume-upload"

export default async function ResumePage() {
  const result = await getResumes()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Resumes
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your uploaded resumes and keep your profile up to date.
          </p>
        </div>

        <ResumeUpload />
      </div>

      {/* Resume list */}
      {!result.success ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {result.error}
        </div>
      ) : (
        <ResumeList initialResumes={result.resumes} />
      )}
    </div>
  )
}