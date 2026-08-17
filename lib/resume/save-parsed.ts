import type { ParsedResume } from "./parse-resume"
import { createClient } from "@/lib/supabase/server"


// ============================================================
// Save parsed resume information
// ============================================================

export async function saveParsedResumeData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  parsed: ParsedResume
) {
  // ----------------------------------------------------------
  // 1. Update profile
  // ----------------------------------------------------------

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.profile.full_name,
      email: parsed.profile.email,
      phone: parsed.profile.phone,
      location: parsed.profile.location,
      headline: parsed.profile.headline,
      summary: parsed.profile.summary,
      links: parsed.profile.links,
    })
    .eq("id", userId)

  if (profileError) {
    throw profileError
  }

  // ----------------------------------------------------------
  // 2. Remove previous structured data
  //
  // This makes re-uploading a resume safe.
  // ----------------------------------------------------------

  const tables = [
    "work_experiences",
    "educations",
    "skills",
    "projects",
    "certifications",
  ] as const

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("user_id", userId)

    if (error) {
      throw error
    }
  }

  // ----------------------------------------------------------
  // 3. Work experience
  // ----------------------------------------------------------

  if (parsed.work_experiences.length > 0) {
    const { error } = await supabase
      .from("work_experiences")
      .insert(
        parsed.work_experiences.map((experience, index) => ({
          user_id: userId,
          company_name: experience.company_name,
          job_title: experience.job_title,
          start_date: normalizeDate(experience.start_date),
          end_date: normalizeDate(experience.end_date),
          is_current: experience.is_current,
          responsibilities: experience.responsibilities,
          sort_order: index,
        }))
      )

    if (error) {
      throw error
    }
  }

  // ----------------------------------------------------------
  // 4. Education
  // ----------------------------------------------------------

  if (parsed.educations.length > 0) {
    const { error } = await supabase
      .from("educations")
      .insert(
        parsed.educations.map((education, index) => ({
          user_id: userId,
          institution: education.institution,
          degree: education.degree,
          field_of_study: education.field_of_study,
          start_date: normalizeDate(education.start_date),
          end_date: normalizeDate(education.end_date),
          grade: education.grade,
          description: education.description,
          sort_order: index,
        }))
      )

    if (error) {
      throw error
    }
  }

  // ----------------------------------------------------------
  // 5. Skills
  // ----------------------------------------------------------

  if (parsed.skills.length > 0) {
    const uniqueSkills = Array.from(
      new Map(
        parsed.skills
          .filter((skill) => skill.name?.trim())
          .map((skill) => [
            skill.name.trim().toLowerCase(),
            {
              user_id: userId,
              name: skill.name.trim(),
              category: skill.category,
            },
          ])
      ).values()
    )

    if (uniqueSkills.length > 0) {
      const { error } = await supabase
        .from("skills")
        .insert(uniqueSkills)

      if (error) {
        throw error
      }
    }
  }

  // ----------------------------------------------------------
  // 6. Projects
  // ----------------------------------------------------------

  if (parsed.projects.length > 0) {
    const { error } = await supabase
      .from("projects")
      .insert(
        parsed.projects.map((project, index) => ({
          user_id: userId,
          name: project.name,
          description: project.description,
          technologies: project.technologies,
          url: project.url,
          start_date: normalizeDate(project.start_date),
          end_date: normalizeDate(project.end_date),
          sort_order: index,
        }))
      )

    if (error) {
      throw error
    }
  }

  // ----------------------------------------------------------
  // 7. Certifications
  // ----------------------------------------------------------

  if (parsed.certifications.length > 0) {
    const { error } = await supabase
      .from("certifications")
      .insert(
        parsed.certifications.map((certification, index) => ({
          user_id: userId,
          name: certification.name,
          issuer: certification.issuer,
          issue_date: normalizeDate(certification.issue_date),
          expiry_date: normalizeDate(certification.expiry_date),
          credential_id: certification.credential_id,
          credential_url: certification.credential_url,
          sort_order: index,
        }))
      )

    if (error) {
      throw error
    }
  }
}


// ============================================================
// Date normalization
// ============================================================

function normalizeDate(
  value: string | null
): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  // YYYY-MM → first day of month
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return `${trimmed}-01`
  }

  // YYYY → first day of year
  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed}-01-01`
  }

  // Don't put uncertain dates into PostgreSQL DATE columns.
  return null
}