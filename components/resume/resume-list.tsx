"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react"

import {
  deleteResume,
  getResumeDownloadUrl,
  type ResumeRecord,
} from "@/app/actions/resume"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

type ResumeListProps = {
  initialResumes: ResumeRecord[]
}

export function ResumeList({
  initialResumes,
}: ResumeListProps) {
  const [resumes, setResumes] =
    useState<ResumeRecord[]>(initialResumes)

  const [actionError, setActionError] =
    useState<string | null>(null)

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  const [downloadingId, setDownloadingId] =
    useState<string | null>(null)

  // ----------------------------------------------------------
  // Download
  // ----------------------------------------------------------

  async function handleDownload(resumeId: string) {
    setActionError(null)
    setDownloadingId(resumeId)

    try {
      const result =
        await getResumeDownloadUrl(resumeId)

      if (!result.success || !result.url) {
        setActionError(
          result.error ||
            "Failed to download the resume."
        )

        return
      }

      window.open(result.url, "_blank")
    } catch (error) {
      console.error(error)

      setActionError(
        "Failed to download the resume."
      )
    } finally {
      setDownloadingId(null)
    }
  }

  // ----------------------------------------------------------
  // Delete
  // ----------------------------------------------------------

  async function handleDelete(
    resume: ResumeRecord
  ) {

    if (resumes.length <= 1) {
        setActionError(
        "You must upload another resume before deleting your current resume."
        )
        return
    }

    setActionError(null)

    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.file_name}"?`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(resume.id)

    try {
      const result =
        await deleteResume(resume.id)

      if (!result.success) {
        setActionError(
          result.error ||
            "Failed to delete the resume."
        )

        return
      }

      setResumes((current) =>
        current.filter(
          (item) => item.id !== resume.id
        )
      )
    } catch (error) {
      console.error(error)

      setActionError(
        "Failed to delete the resume."
      )
    } finally {
      setDeletingId(null)
    }
  }

  // ----------------------------------------------------------
  // Formatting helpers
  // ----------------------------------------------------------

  function formatFileSize(
    bytes: number | null
  ) {
    if (!bytes) {
      return "Unknown size"
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date))
  }

  function getFileType(
    mimeType: string | null
  ) {
    if (mimeType === "application/pdf") {
      return "PDF"
    }

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "DOCX"
    }

    return "Resume"
  }

  // ----------------------------------------------------------
  // Status
  // ----------------------------------------------------------

  function renderStatus(
    resume: ResumeRecord
  ) {
    if (resume.parse_status === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <CheckCircle2 className="size-3.5" />
          Parsed
        </span>
      )
    }

    if (
      resume.parse_status ===
      "processing"
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Processing
        </span>
      )
    }

    if (
      resume.parse_status ===
      "pending"
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock3 className="size-3.5" />
          Pending
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
        <XCircle className="size-3.5" />
        Failed
      </span>
    )
  }

  return (
    <div className="space-y-4">

      {/* Errors */}

      {actionError && (
        <Alert variant="destructive">
          <AlertDescription>
            {actionError}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty state */}

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-60 flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="size-6 text-primary" />
            </div>

            <h2 className="text-lg font-semibold">
              No resumes uploaded
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Upload a PDF or DOCX resume to
              automatically populate your profile.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {/* File icon */}

                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>

                {/* Information */}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {resume.file_name}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {getFileType(
                        resume.mime_type
                      )}
                    </span>

                    <span>•</span>

                    <span>
                      {formatFileSize(
                        resume.file_size
                      )}
                    </span>

                    <span>•</span>

                    <span>
                      Uploaded{" "}
                      {formatDate(
                        resume.uploaded_at
                      )}
                    </span>
                  </div>

                  <div className="mt-2">
                    {renderStatus(resume)}
                  </div>

                  {resume.parse_status ===
                    "failed" &&
                    resume.parse_error && (
                      <p className="mt-1 text-xs text-destructive">
                        {resume.parse_error}
                      </p>
                    )}
                </div>

                {/* Actions */}

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownload(
                        resume.id
                      )
                    }
                    disabled={
                      downloadingId ===
                      resume.id
                    }
                  >
                    {downloadingId ===
                    resume.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}

                    <span className="hidden sm:inline">
                      Download
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(resume)}
                    disabled={
                        resumes.length <= 1 ||
                        deletingId === resume.id
                    }
                    className="text-destructive hover:text-destructive"
                    title={
                        resumes.length <= 1
                        ? "Upload another resume before deleting this resume"
                        : "Delete resume"
                    }
                  >
                    {deletingId === resume.id ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Trash2 className="size-4" />
                    )}

                    <span className="hidden sm:inline">
                        Delete
                    </span>
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}