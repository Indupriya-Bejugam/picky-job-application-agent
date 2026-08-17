import { extractText } from "unpdf"
import mammoth from "mammoth"

const PDF_MIME_TYPE = "application/pdf"
const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export async function extractResumeText(
  file: File
): Promise<string> {
  const buffer = await file.arrayBuffer()
  const data = new Uint8Array(buffer)

  if (file.type === PDF_MIME_TYPE) {
    const { text } = await extractText(data, {
      mergePages: true,
    })

    return text.trim()
  }

  if (file.type === DOCX_MIME_TYPE) {
    const result = await mammoth.extractRawText({
      arrayBuffer: buffer,
    })

    return result.value.trim()
  }

  throw new Error(
    "Unsupported file type. Please upload a PDF or DOCX file."
  )
}