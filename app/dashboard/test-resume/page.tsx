"use client"

import { useState } from "react"
import { uploadResume } from "@/app/actions/resume"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestResumePage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF or DOCX file.")
      return
    }

    setStatus("Uploading and parsing...")
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadResume(formData)

    if (!result.success) {
      setStatus("")
      setError(result.error)
      return
    }

    setStatus(`Success! Resume ID: ${result.resumeId}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Test Resume Upload</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Resume
            </label>

            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null)
                setStatus("")
                setError("")
              }}
              className="block w-full rounded-md border p-2 text-sm"
            />
          </div>

          {file && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">{file.name}</p>
              <p className="text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || !!status}
            className="w-full"
          >
            {status === "Uploading and parsing..."
              ? "Processing..."
              : "Upload & Parse"}
          </Button>

          {status && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
              {status}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}