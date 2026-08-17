import { GoogleGenAI, Type } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY
const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite"

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured")
}

const ai = new GoogleGenAI({
  apiKey,
})

export type ParsedResume = {
  profile: {
    full_name: string | null
    email: string | null
    phone: string | null
    location: string | null
    headline: string | null
    summary: string | null
    links: string[]
  }

  skills: {
    name: string
    category: string | null
  }[]

  work_experiences: {
    company_name: string
    job_title: string | null
    start_date: string | null
    end_date: string | null
    is_current: boolean
    responsibilities: string[]
  }[]

  educations: {
    institution: string
    degree: string | null
    field_of_study: string | null
    start_date: string | null
    end_date: string | null
    grade: string | null
    description: string | null
  }[]

  projects: {
    name: string
    description: string | null
    technologies: string[]
    url: string | null
    start_date: string | null
    end_date: string | null
  }[]

  certifications: {
    name: string
    issuer: string | null
    issue_date: string | null
    expiry_date: string | null
    credential_id: string | null
    credential_url: string | null
  }[]
}

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    profile: {
      type: Type.OBJECT,
      properties: {
        full_name: { type: Type.STRING, nullable: true },
        email: { type: Type.STRING, nullable: true },
        phone: { type: Type.STRING, nullable: true },
        location: { type: Type.STRING, nullable: true },
        headline: { type: Type.STRING, nullable: true },
        summary: { type: Type.STRING, nullable: true },
        links: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "full_name",
        "email",
        "phone",
        "location",
        "headline",
        "summary",
        "links",
      ],
    },

    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING, nullable: true },
        },
        required: ["name", "category"],
      },
    },

    work_experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company_name: { type: Type.STRING },
          job_title: { type: Type.STRING, nullable: true },
          start_date: { type: Type.STRING, nullable: true },
          end_date: { type: Type.STRING, nullable: true },
          is_current: { type: Type.BOOLEAN },
          responsibilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          "company_name",
          "job_title",
          "start_date",
          "end_date",
          "is_current",
          "responsibilities",
        ],
      },
    },

    educations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING, nullable: true },
          field_of_study: { type: Type.STRING, nullable: true },
          start_date: { type: Type.STRING, nullable: true },
          end_date: { type: Type.STRING, nullable: true },
          grade: { type: Type.STRING, nullable: true },
          description: { type: Type.STRING, nullable: true },
        },
        required: [
          "institution",
          "degree",
          "field_of_study",
          "start_date",
          "end_date",
          "grade",
          "description",
        ],
      },
    },

    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING, nullable: true },
          technologies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          url: { type: Type.STRING, nullable: true },
          start_date: { type: Type.STRING, nullable: true },
          end_date: { type: Type.STRING, nullable: true },
        },
        required: [
          "name",
          "description",
          "technologies",
          "url",
          "start_date",
          "end_date",
        ],
      },
    },

    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuer: { type: Type.STRING, nullable: true },
          issue_date: { type: Type.STRING, nullable: true },
          expiry_date: { type: Type.STRING, nullable: true },
          credential_id: { type: Type.STRING, nullable: true },
          credential_url: { type: Type.STRING, nullable: true },
        },
        required: [
          "name",
          "issuer",
          "issue_date",
          "expiry_date",
          "credential_id",
          "credential_url",
        ],
      },
    },
  },

  required: [
    "profile",
    "skills",
    "work_experiences",
    "educations",
    "projects",
    "certifications",
  ],
}

export async function parseResume(
  resumeText: string
): Promise<ParsedResume> {
  if (!resumeText.trim()) {
    throw new Error("Resume does not contain any readable text.")
  }

  const prompt = `
You are an expert resume parser.

Analyze the resume text below and extract the candidate's information
into the provided structured schema.

Important rules:

1. Extract only information actually present in the resume.
2. Never invent or hallucinate information.
3. If a field is unavailable, return null.
4. If a list has no entries, return an empty array.
5. Preserve the candidate's wording where appropriate.
6. Extract every relevant skill.
7. Extract every work experience.
8. Extract every responsibility/bullet point under each job.
9. Extract every education entry.
10. Extract projects, certifications and professional links.
11. Normalize dates to YYYY-MM-DD when the exact date is available.
12. If only a month/year is available, use the best reasonable representation.
13. For current employment, set is_current to true and end_date to null.
14. Do not treat contact information as a skill or work experience.

Resume text:

--------------------
${resumeText}
--------------------
`

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema
    },
  })

  const text = response.text

  if (!text) {
    throw new Error("Gemini returned an empty response.")
  }

  try {
    return JSON.parse(text) as ParsedResume
  } catch {
    throw new Error("Gemini returned invalid structured resume data.")
  }
}