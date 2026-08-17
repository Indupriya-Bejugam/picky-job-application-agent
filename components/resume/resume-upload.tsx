"use client"

import { useRef, useState, useTransition } from "react"
import { Loader2, Upload } from "lucide-react"

import { uploadResume } from "@/app/actions/resume"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

export function ResumeUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setError(null)

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are supported.")
      event.target.value = ""
      return
    }

    if (file.size === 0) {
      setError("The uploaded file is empty.")
      event.target.value = ""
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Resume file must be smaller than 10 MB.")
      event.target.value = ""
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    startTransition(async () => {
      const result = await uploadResume(formData)

      if (!result.success) {
        setError(result.error)
        event.target.value = ""
        return
      }

      window.location.reload()
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        size="lg"
        disabled={isPending}
        className="h-11 px-5"
        onClick={() => fileInputRef.current?.click()}
      >
        {isPending ? (
          <Loader2 className="mr-2 size-5 animate-spin" />
        ) : (
          <Upload className="mr-2 size-5" />
        )}

        {isPending ? "Uploading..." : "Upload Resume"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleUpload}
        disabled={isPending}
      />

      {error && (
        <Alert
          variant="destructive"
          className="w-72"
        >
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}