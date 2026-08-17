"use server"

import { createClient } from "@/lib/supabase/server"

export type ProfileData = {
    profile: {
        id: string
        email: string
        full_name: string | null
        phone: string | null
        location: string | null
        headline: string | null
        summary: string | null
        links: string[]
    }

    skills: {
        id: string
        name: string
        category: string | null
        sort_order: number
    }[]

    work_experiences: {
        id: string
        company_name: string
        job_title: string | null
        start_date: string | null
        end_date: string | null
        is_current: boolean
        responsibilities: string[]
        sort_order: number
    }[]

    educations: {
        id: string
        institution: string
        degree: string | null
        field_of_study: string | null
        start_date: string | null
        end_date: string | null
        grade: string | null
        description: string | null
        sort_order: number
    }[]

    projects: {
        id: string
        name: string
        description: string | null
        technologies: string[]
        url: string | null
        start_date: string | null
        end_date: string | null
        sort_order: number
    }[]

    certifications: {
        id: string
        name: string
        issuer: string | null
        issue_date: string | null
        expiry_date: string | null
        credential_id: string | null
        credential_url: string | null
        sort_order: number
    }[]
}

export async function getProfile(): Promise<
    | {
        success: true
        data: ProfileData
    }
    | {
        success: false
        error: string
    }
> {
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
    // 2. Fetch profile
    // ----------------------------------------------------------

    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select(
                `
          id,
          email,
          full_name,
          phone,
          location,
          headline,
          summary,
          links
        `
            )
            .eq("id", user.id)
            .single()

    if (profileError || !profile) {
        console.error(
            "Failed to fetch profile:",
            profileError
        )

        return {
            success: false,
            error: "Failed to load your profile.",
        }
    }

    // ----------------------------------------------------------
    // 3. Fetch skills
    // ----------------------------------------------------------

    const { data: skills, error: skillsError } =
        await supabase
            .from("skills")
            .select(
                `
          id,
          name,
          category,
          sort_order
        `
            )
            .eq("user_id", user.id)
            .order("sort_order", { ascending: true })

    if (skillsError) {
        console.error(
            "Failed to fetch skills:",
            skillsError
        )

        return {
            success: false,
            error: "Failed to load your skills.",
        }
    }

    // ----------------------------------------------------------
    // 4. Fetch work experience
    // ----------------------------------------------------------

    const {
        data: workExperiences,
        error: workError,
    } = await supabase
        .from("work_experiences")
        .select(
            `
        id,
        company_name,
        job_title,
        start_date,
        end_date,
        is_current,
        responsibilities,
        sort_order
      `
        )
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true })

    if (workError) {
        console.error(
            "Failed to fetch work experience:",
            workError
        )

        return {
            success: false,
            error: "Failed to load your work experience.",
        }
    }

    // ----------------------------------------------------------
    // 5. Fetch education
    // ----------------------------------------------------------

    const { data: educations, error: educationError } =
        await supabase
            .from("educations")
            .select(
                `
          id,
          institution,
          degree,
          field_of_study,
          start_date,
          end_date,
          grade,
          description,
          sort_order
        `
            )
            .eq("user_id", user.id)
            .order("sort_order", { ascending: true })

    if (educationError) {
        console.error(
            "Failed to fetch education:",
            educationError
        )

        return {
            success: false,
            error: "Failed to load your education.",
        }
    }

    // ----------------------------------------------------------
    // 6. Fetch projects
    // ----------------------------------------------------------

    const { data: projects, error: projectsError } =
        await supabase
            .from("projects")
            .select(
                `
          id,
          name,
          description,
          technologies,
          url,
          start_date,
          end_date,
          sort_order
        `
            )
            .eq("user_id", user.id)
            .order("sort_order", { ascending: true })

    if (projectsError) {
        console.error(
            "Failed to fetch projects:",
            projectsError
        )

        return {
            success: false,
            error: "Failed to load your projects.",
        }
    }

    // ----------------------------------------------------------
    // 7. Fetch certifications
    // ----------------------------------------------------------

    const {
        data: certifications,
        error: certificationsError,
    } = await supabase
        .from("certifications")
        .select(
            `
        id,
        name,
        issuer,
        issue_date,
        expiry_date,
        credential_id,
        credential_url,
        sort_order
      `
        )
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true })

    if (certificationsError) {
        console.error(
            "Failed to fetch certifications:",
            certificationsError
        )

        return {
            success: false,
            error: "Failed to load your certifications.",
        }
    }

    return {
        success: true,
        data: {
            profile: {
                ...profile,
                links: Array.isArray(profile.links)
                    ? profile.links
                    : [],
            },

            skills: skills ?? [],

            work_experiences:
                workExperiences ?? [],

            educations:
                educations ?? [],

            projects:
                projects ?? [],

            certifications:
                certifications ?? [],
        },
    }
}

// ============================================================
// Update Profile
// ============================================================

export async function updateProfile(
    data: {
        full_name: string
        email: string
        phone: string
        location: string
        headline: string
        summary: string
        links: string[]

        skills: {
            id: string
            name: string
            category: string
        }[]

        work_experiences: {
            id: string
            company_name: string
            job_title: string
            start_date: string
            end_date: string
            is_current: boolean
            responsibilities: string[]
        }[]

        educations: {
            id: string
            institution: string
            degree: string
            field_of_study: string
            start_date: string
            end_date: string
            grade: string
            description: string
        }[]

        projects: {
            id: string
            name: string
            description: string
            technologies: string[]
            url: string
            start_date: string
            end_date: string
        }[]

        certifications: {
            id: string
            name: string
            issuer: string
            issue_date: string
            expiry_date: string
            credential_id: string
            credential_url: string
        }[]
    }
): Promise<
    | {
        success: true
    }
    | {
        success: false
        error: string
    }
> {
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
    // 2. Validate required fields
    // ----------------------------------------------------------

    if (!data.full_name.trim()) {
        return {
            success: false,
            error: "Full name is required.",
        }
    }

    if (!data.email.trim()) {
        return {
            success: false,
            error: "Email is required.",
        }
    }

    // ----------------------------------------------------------
    // 3. Update profile
    // ----------------------------------------------------------

    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            full_name: data.full_name.trim(),
            email: data.email.trim(),
            phone: data.phone.trim() || null,
            location: data.location.trim() || null,
            headline: data.headline.trim() || null,
            summary: data.summary.trim() || null,
            links: data.links,
        })
        .eq("id", user.id)

    if (profileError) {
        console.error(
            "Failed to update profile:",
            profileError
        )

        return {
            success: false,
            error: "Failed to save your profile.",
        }
    }

    // ----------------------------------------------------------
    // 4. Delete existing skills
    // ----------------------------------------------------------

    const { error: deleteSkillsError } =
        await supabase
            .from("skills")
            .delete()
            .eq("user_id", user.id)

    if (deleteSkillsError) {
        console.error(
            "Failed to delete existing skills:",
            deleteSkillsError
        )

        return {
            success: false,
            error: "Failed to update your skills.",
        }
    }

    // ----------------------------------------------------------
    // 5. Prepare skills
    // ----------------------------------------------------------

    const skillsToInsert = data.skills
        .map((skill, index) => ({
            user_id: user.id,
            name: skill.name.trim(),
            category: skill.category.trim() || null,
            sort_order: index,
        }))
        .filter(
            (skill) => skill.name.length > 0
        )

    // ----------------------------------------------------------
    // 6. Insert skills
    // ----------------------------------------------------------

    if (skillsToInsert.length > 0) {
        const { error: skillsError } =
            await supabase
                .from("skills")
                .insert(skillsToInsert)

        if (skillsError) {
            console.error(
                "Failed to insert skills:",
                skillsError
            )

            return {
                success: false,
                error: "Failed to save your skills.",
            }
        }
    }

    // ----------------------------------------------------------
    // 7. Delete existing work experience
    // ----------------------------------------------------------

    const { error: deleteWorkError } =
        await supabase
            .from("work_experiences")
            .delete()
            .eq("user_id", user.id)

    if (deleteWorkError) {
        console.error(
            "Failed to delete existing work experience:",
            deleteWorkError
        )

        return {
            success: false,
            error: "Failed to update your work experience.",
        }
    }

    // ----------------------------------------------------------
    // 8. Prepare work experience
    // ----------------------------------------------------------

    const workToInsert = data.work_experiences
        .map((experience, index) => ({
            user_id: user.id,
            company_name: experience.company_name.trim(),
            job_title:
                experience.job_title.trim() || null,
            start_date:
                experience.start_date || null,
            end_date:
                experience.is_current
                    ? null
                    : experience.end_date || null,
            is_current: experience.is_current,
            responsibilities:
                experience.responsibilities
                    .map((item) => item.trim())
                    .filter(Boolean),
            sort_order: index,
        }))
        .filter(
            (experience) =>
                experience.company_name.length > 0
        )

    // ----------------------------------------------------------
    // 9. Insert work experience
    // ----------------------------------------------------------

    if (workToInsert.length > 0) {
        const { error: workError } =
            await supabase
                .from("work_experiences")
                .insert(workToInsert)

        if (workError) {
            console.error(
                "Failed to insert work experience:",
                workError
            )

            return {
                success: false,
                error:
                    "Failed to save your work experience.",
            }
        }
    }

    // ----------------------------------------------------------
    // 10. Delete existing education
    // ----------------------------------------------------------

    const { error: deleteEducationError } =
        await supabase
            .from("educations")
            .delete()
            .eq("user_id", user.id)

    if (deleteEducationError) {
        console.error(
            "Failed to delete existing education:",
            deleteEducationError
        )

        return {
            success: false,
            error: "Failed to update your education.",
        }
    }

    // ----------------------------------------------------------
    // 11. Prepare education
    // ----------------------------------------------------------

    const educationToInsert = data.educations
        .map((education, index) => ({
            user_id: user.id,
            institution:
                education.institution.trim(),
            degree:
                education.degree.trim() || null,
            field_of_study:
                education.field_of_study.trim() || null,
            start_date:
                education.start_date || null,
            end_date:
                education.end_date || null,
            grade:
                education.grade.trim() || null,
            description:
                education.description.trim() || null,
            sort_order: index,
        }))
        .filter(
            (education) =>
                education.institution.length > 0
        )

    // ----------------------------------------------------------
    // 12. Insert education
    // ----------------------------------------------------------

    if (educationToInsert.length > 0) {
        const { error: educationError } =
            await supabase
                .from("educations")
                .insert(educationToInsert)

        if (educationError) {
            console.error(
                "Failed to insert education:",
                educationError
            )

            return {
                success: false,
                error:
                    "Failed to save your education.",
            }
        }
    }

    // ----------------------------------------------------------
    // 13. Delete existing projects
    // ----------------------------------------------------------

    const { error: deleteProjectsError } =
        await supabase
            .from("projects")
            .delete()
            .eq("user_id", user.id)

    if (deleteProjectsError) {
        console.error(
            "Failed to delete existing projects:",
            deleteProjectsError
        )

        return {
            success: false,
            error: "Failed to update your projects.",
        }
    }

    // ----------------------------------------------------------
    // 14. Prepare projects
    // ----------------------------------------------------------

    const projectsToInsert = data.projects
        .map((project, index) => ({
            user_id: user.id,
            name: project.name.trim(),
            description:
                project.description.trim() || null,
            technologies:
                project.technologies
                    .map((technology) =>
                        technology.trim()
                    )
                    .filter(Boolean),
            url:
                project.url.trim() || null,
            start_date:
                project.start_date || null,
            end_date:
                project.end_date || null,
            sort_order: index,
        }))
        .filter(
            (project) =>
                project.name.length > 0
        )

    // ----------------------------------------------------------
    // 15. Insert projects
    // ----------------------------------------------------------

    if (projectsToInsert.length > 0) {
        const { error: projectsError } =
            await supabase
                .from("projects")
                .insert(projectsToInsert)

        if (projectsError) {
            console.error(
                "Failed to insert projects:",
                projectsError
            )

            return {
                success: false,
                error:
                    "Failed to save your projects.",
            }
        }
    }

    // ----------------------------------------------------------
    // 16. Delete existing certifications
    // ----------------------------------------------------------

    const { error: deleteCertificationsError } =
        await supabase
            .from("certifications")
            .delete()
            .eq("user_id", user.id)

    if (deleteCertificationsError) {
        console.error(
            "Failed to delete existing certifications:",
            deleteCertificationsError
        )

        return {
            success: false,
            error:
                "Failed to update your certifications.",
        }
    }

    // ----------------------------------------------------------
    // 17. Prepare certifications
    // ----------------------------------------------------------

    const certificationsToInsert =
        data.certifications
            .map((certification, index) => ({
                user_id: user.id,
                name:
                    certification.name.trim(),
                issuer:
                    certification.issuer.trim() ||
                    null,
                issue_date:
                    certification.issue_date ||
                    null,
                expiry_date:
                    certification.expiry_date ||
                    null,
                credential_id:
                    certification.credential_id.trim() ||
                    null,
                credential_url:
                    certification.credential_url.trim() ||
                    null,
                sort_order: index,
            }))
            .filter(
                (certification) =>
                    certification.name.length > 0
            )

    // ----------------------------------------------------------
    // 18. Insert certifications
    // ----------------------------------------------------------

    if (certificationsToInsert.length > 0) {
        const { error: certificationsError } =
            await supabase
                .from("certifications")
                .insert(
                    certificationsToInsert
                )

        if (certificationsError) {
            console.error(
                "Failed to insert certifications:",
                certificationsError
            )

            return {
                success: false,
                error:
                    "Failed to save your certifications.",
            }
        }
    }

    // ----------------------------------------------------------
    // 19. Success
    // ----------------------------------------------------------

    return {
        success: true,
    }
}