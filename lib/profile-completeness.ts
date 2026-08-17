import type { ProfileData } from "@/app/actions/profile"

export function getProfileCompleteness(
    data: ProfileData
) {
    const sections = [
        {
            name: "Personal Information",
            completed:
                Boolean(
                    data.profile.full_name?.trim()
                ) &&
                Boolean(
                    data.profile.email?.trim()
                ) &&
                Boolean(
                    data.profile.phone?.trim()
                ) &&
                Boolean(
                    data.profile.location?.trim()
                ),
        },

        {
            name: "Professional Summary",
            completed:
                Boolean(
                    data.profile.headline?.trim()
                ) &&
                Boolean(
                    data.profile.summary?.trim()
                ),
        },

        {
            name: "Skills",
            completed:
                data.skills.length > 0 &&
                data.skills.some(
                    (skill) =>
                        skill.name.trim().length > 0
                ),
        },

        {
            name: "Work Experience",
            completed:
                data.work_experiences.length > 0,
        },

        {
            name: "Education",
            completed:
                data.educations.length > 0,
        },

        {
            name: "Projects",
            completed:
                data.projects.length > 0,
        },

        {
            name: "Certifications",
            completed:
                data.certifications.length > 0,
        },
    ]

    const completed = sections.filter(
        (section) => section.completed
    ).length

    const total = sections.length

    const percentage = Math.round(
        (completed / total) * 100
    )

    return {
        percentage,
        completed,
        total,
        sections,
    }
}