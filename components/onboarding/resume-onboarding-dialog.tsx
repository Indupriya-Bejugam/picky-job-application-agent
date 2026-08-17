"use client"

import { useRef, useState } from "react"
import { FileText, Loader2, Upload, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { uploadResume } from "@/app/actions/resume"

type ResumeOnboardingDialogProps = {
  open: boolean
}

export function ResumeOnboardingDialog({
  open,
}: ResumeOnboardingDialogProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) return

    setError("")
    setSuccess(false)

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf")

    const isDocx =
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      selectedFile.name.toLowerCase().endsWith(".docx")

    if (!isPdf && !isDocx) {
      setFile(null)
      setError("Please upload a PDF or DOCX file.")
      return
    }

    setFile(selectedFile)
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select your resume first.")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadResume(formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)

      // Give the user a moment to see the success state.
      await new Promise((resolve) => setTimeout(resolve, 700))

      // Re-run the server layout.
      // onboarding_completed_at is now populated,
      // so the dialog will disappear.
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Something went wrong while processing your resume.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-lg"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="size-6 text-primary" />
          </div>

          <DialogTitle className="text-xl">
            Welcome to JobBuddy AI
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Upload your resume to get started. We&apos;ll automatically
            extract your profile, skills, experience, education and
            other relevant information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Upload zone */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="
              flex
              w-full
              flex-col
              items-center
              justify-center
              rounded-xl
              border-2
              border-dashed
              border-muted-foreground/25
              bg-muted/20
              px-6
              py-10
              text-center
              transition
              hover:border-primary/50
              hover:bg-primary/5
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10">
              <Upload className="size-5 text-primary" />
            </div>

            <p className="text-sm font-medium">
              Upload your resume
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              PDF or DOCX
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
          </button>

          {/* Selected file */}
          {file && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {file.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {/* Processing state */}
          {isUploading && (
            <div className="rounded-lg bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="size-5 animate-spin text-primary" />

                <div>
                  <p className="text-sm font-medium">
                    Processing your resume...
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Uploading, parsing and extracting your information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4 text-green-700">
              <CheckCircle2 className="size-5 shrink-0" />

              <div>
                <p className="text-sm font-medium">
                  Resume processed successfully
                </p>

                <p className="text-xs">
                  Your profile has been populated.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading || success}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing Resume...
              </>
            ) : success ? (
              "Resume Processed"
            ) : (
              "Upload & Continue"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your resume is securely stored in your private resume
            storage.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}