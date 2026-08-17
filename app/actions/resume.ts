"use server"

import { createClient } from "@/lib/supabase/server"
import { extractResumeText } from "@/lib/resume/extract-text"
import { parseResume } from "@/lib/resume/parse-resume"
import { saveParsedResumeData } from "@/lib/resume/save-parsed"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

type UploadResumeResult =
  | {
      success: true
      resumeId: string
    }
  | {
      success: false
      error: string
    }

export async function uploadResume(
  formData: FormData
): Promise<UploadResumeResult> {
  const supabase = await createClient()

  // ----------------------------------------------------------
  // 1. Authenticate user
  // ----------------------------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: "You must be signed in to upload a resume.",
    }
  }

  // ----------------------------------------------------------
  // 2. Get uploaded file
  // ----------------------------------------------------------

  const file = formData.get("file")

  if (!(file instanceof File)) {
    return {
      success: false,
      error: "Please select a resume file.",
    }
  }

  // ----------------------------------------------------------
  // 3. Validate file type
  // ----------------------------------------------------------

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Only PDF and DOCX files are supported.",
    }
  }

  // ----------------------------------------------------------
  // 4. Validate file size
  // ----------------------------------------------------------

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "Resume file must be smaller than 10 MB.",
    }
  }

  if (file.size === 0) {
    return {
      success: false,
      error: "The uploaded file is empty.",
    }
  }

  // ----------------------------------------------------------
  // 5. Create unique storage path
  // ----------------------------------------------------------

  const extension = file.name.toLowerCase().endsWith(".pdf")
    ? "pdf"
    : "docx"

  const fileId = crypto.randomUUID()

  const storagePath = `${user.id}/${fileId}.${extension}`

  // ----------------------------------------------------------
  // 6. Upload file to Supabase Storage
  // ----------------------------------------------------------

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error("Resume storage upload failed:", uploadError)

    return {
      success: false,
      error: "Failed to upload your resume. Please try again.",
    }
  }

  // ----------------------------------------------------------
  // 7. Create resume database record
  // ----------------------------------------------------------

  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      file_name: file.name,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type,
      parse_status: "processing",
    })
    .select("id")
    .single()

  if (resumeError || !resume) {
    console.error("Resume database insert failed:", resumeError)

    // Cleanup uploaded file if DB insert fails
    await supabase.storage
      .from("resumes")
      .remove([storagePath])

    return {
      success: false,
      error: "Failed to create the resume record.",
    }
  }

  try {
    // --------------------------------------------------------
    // 8. Extract text from PDF/DOCX
    // --------------------------------------------------------

    const resumeText = await extractResumeText(file)

    if (!resumeText.trim()) {
      throw new Error(
        "We could not extract any readable text from this resume."
      )
    }

    // --------------------------------------------------------
    // 9. Parse resume with Gemini
    // --------------------------------------------------------

    const parsedResume = await parseResume(resumeText)

    // --------------------------------------------------------
    // 10. Save parsed information
    // --------------------------------------------------------

    await saveParsedResumeData(
      supabase,
      user.id,
      parsedResume
    )

    // --------------------------------------------------------
    // 11. Mark resume as completed
    // --------------------------------------------------------

    const { error: updateResumeError } = await supabase
      .from("resumes")
      .update({
        parse_status: "completed",
        parsed_at: new Date().toISOString(),
        parse_error: null,
      })
      .eq("id", resume.id)
      .eq("user_id", user.id)

    if (updateResumeError) {
      throw updateResumeError
    }

    // --------------------------------------------------------
    // 12. Mark onboarding as completed
    // --------------------------------------------------------

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (profileError) {
      throw profileError
    }

    return {
      success: true,
      resumeId: resume.id,
    }
  } catch (error) {
    console.error("Resume processing failed:", error)

    // --------------------------------------------------------
    // Mark resume as failed
    // --------------------------------------------------------

    await supabase
      .from("resumes")
      .update({
        parse_status: "failed",
        parse_error:
          error instanceof Error
            ? error.message
            : "Unknown parsing error",
      })
      .eq("id", resume.id)
      .eq("user_id", user.id)

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process your resume.",
    }
  }
}

// ============================================================
// Resume type
// ============================================================

export type ResumeRecord = {
  id: string
  file_name: string
  storage_path: string
  file_size: number | null
  mime_type: string | null
  parse_status: "pending" | "processing" | "completed" | "failed"
  parse_error: string | null
  uploaded_at: string
  parsed_at: string | null
}


// ============================================================
// Get user's resumes
// ============================================================

export async function getResumes(): Promise<{
  success: boolean
  resumes: ResumeRecord[]
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      resumes: [],
      error: "You must be signed in.",
    }
  }

  const { data, error } = await supabase
    .from("resumes")
    .select(
      `
        id,
        file_name,
        storage_path,
        file_size,
        mime_type,
        parse_status,
        parse_error,
        uploaded_at,
        parsed_at
      `
    )
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch resumes:", error)

    return {
      success: false,
      resumes: [],
      error: "Failed to load your resumes.",
    }
  }

  return {
    success: true,
    resumes: data ?? [],
  }
}


// ============================================================
// Get temporary download URL
// ============================================================

export async function getResumeDownloadUrl(
  resumeId: string
): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: "You must be signed in.",
    }
  }

  // First verify that this resume belongs to the
  // currently authenticated user.
  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("storage_path")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single()

  if (resumeError || !resume) {
    return {
      success: false,
      error: "Resume not found.",
    }
  }

  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(resume.storage_path, 60 * 5)

  if (error || !data?.signedUrl) {
    console.error("Failed to create resume URL:", error)

    return {
      success: false,
      error: "Failed to generate the resume download link.",
    }
  }

  return {
    success: true,
    url: data.signedUrl,
  }
}


// ============================================================
// Delete resume
// ============================================================

export async function deleteResume(
  resumeId: string
): Promise<{
  success: boolean
  error?: string
}> {
  const supabase = await createClient()

  // ----------------------------------------------------------
  // 1. Authenticate user
  // ----------------------------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: "You must be signed in.",
    }
  }

  // ----------------------------------------------------------
  // 2. Get resume and verify ownership
  // ----------------------------------------------------------

  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("id, storage_path, parse_status")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single()

  if (resumeError || !resume) {
    return {
      success: false,
      error: "Resume not found.",
    }
  }

  // ----------------------------------------------------------
  // 3. If this is the user's only completed resume,
  //    don't allow deletion.
  // ----------------------------------------------------------

  if (resume.parse_status === "completed") {
    const { count, error: countError } = await supabase
      .from("resumes")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("parse_status", "completed")

    if (countError) {
      console.error(
        "Failed to check completed resumes:",
        countError
      )

      return {
        success: false,
        error: "Unable to verify your resumes.",
      }
    }

    if ((count ?? 0) <= 1) {
      return {
        success: false,
        error:
          "You only have one resume. Please upload another resume before deleting this one.",
      }
    }
  }

  // ----------------------------------------------------------
  // 4. Delete resume file from Supabase Storage
  // ----------------------------------------------------------

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .remove([resume.storage_path])

  if (storageError) {
    console.error(
      "Failed to delete resume file:",
      storageError
    )

    return {
      success: false,
      error: "Failed to delete the resume file.",
    }
  }

  // ----------------------------------------------------------
  // 5. Delete resume database record
  // ----------------------------------------------------------

  const { error: deleteError } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id)

  if (deleteError) {
    console.error(
      "Failed to delete resume record:",
      deleteError
    )

    return {
      success: false,
      error: "Failed to delete the resume record.",
    }
  }

  return {
    success: true,
  }
}