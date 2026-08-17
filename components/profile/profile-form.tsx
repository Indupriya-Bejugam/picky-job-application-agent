"use client"

import { useState } from "react"
import {
    Plus,
    X,
    Briefcase,
    CalendarDays,
    MapPin,
    UserRound,
    Code2,
    BriefcaseBusiness,
    GraduationCap,
    FolderGit2,
    Award,
    CircleCheck,
} from "lucide-react"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    updateProfile,
    type ProfileData,
} from "@/app/actions/profile"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"

type ProfileFormProps = {
    data: ProfileData
}

export function ProfileForm({
    data,
}: ProfileFormProps) {
    const [fullName, setFullName] = useState(
        data.profile.full_name ?? ""
    )

    const [email, setEmail] = useState(
        data.profile.email ?? ""
    )

    const [phone, setPhone] = useState(
        data.profile.phone ?? ""
    )

    const [location, setLocation] = useState(
        data.profile.location ?? ""
    )

    const [headline, setHeadline] = useState(
        data.profile.headline ?? ""
    )

    const [summary, setSummary] = useState(
        data.profile.summary ?? ""
    )

    const [isSaving, setIsSaving] = useState(false)

    const [saveError, setSaveError] =
        useState<string | null>(null)

    const [saveSuccess, setSaveSuccess] =
        useState(false)

    const [skills, setSkills] = useState(
        data.skills.map((skill) => ({
            id: skill.id,
            name: skill.name,
            category: skill.category ?? "",
        }))
    )

    const [workExperiences, setWorkExperiences] =
        useState(
            data.work_experiences.map(
                (experience) => ({
                    id: experience.id,
                    company_name:
                        experience.company_name,
                    job_title:
                        experience.job_title ?? "",
                    start_date:
                        experience.start_date ?? "",
                    end_date:
                        experience.end_date ?? "",
                    is_current:
                        experience.is_current,
                    responsibilities:
                        experience.responsibilities ??
                        [],
                })
            )
        )

    // ============================================================
    // EDUCATION
    // ============================================================

    const [educations, setEducations] =
        useState(
            data.educations.map((education) => ({
                id: education.id,
                institution:
                    education.institution,
                degree:
                    education.degree ?? "",
                field_of_study:
                    education.field_of_study ?? "",
                start_date:
                    education.start_date ?? "",
                end_date:
                    education.end_date ?? "",
                grade:
                    education.grade ?? "",
                description:
                    education.description ?? "",
            }))
        )

    // ============================================================
    // PROJECTS
    // ============================================================

    const [projects, setProjects] =
        useState(
            data.projects.map((project) => ({
                id: project.id,
                name: project.name,
                description:
                    project.description ?? "",
                technologies:
                    project.technologies ?? [],
                url:
                    project.url ?? "",
                start_date:
                    project.start_date ?? "",
                end_date:
                    project.end_date ?? "",
            }))
        )

    // ============================================================
    // CERTIFICATIONS
    // ============================================================

    const [certifications, setCertifications] =
        useState(
            data.certifications.map(
                (certification) => ({
                    id: certification.id,
                    name:
                        certification.name,
                    issuer:
                        certification.issuer ?? "",
                    issue_date:
                        certification.issue_date ?? "",
                    expiry_date:
                        certification.expiry_date ?? "",
                    credential_id:
                        certification.credential_id ??
                        "",
                    credential_url:
                        certification.credential_url ??
                        "",
                })
            )
        )

    // ============================================================
    // SAVE
    // ============================================================

    async function handleSave() {
        setIsSaving(true)
        setSaveError(null)
        setSaveSuccess(false)

        try {
            const result = await updateProfile({
                full_name: fullName,
                email,
                phone,
                location,
                headline,
                summary,
                links: data.profile.links,
                skills,
                work_experiences:
                    workExperiences,

                educations,

                projects,

                certifications,
            })

            if (!result.success) {
                setSaveError(result.error)
                return
            }

            setSaveSuccess(true)
        } catch (error) {
            console.error(
                "Profile save failed:",
                error
            )

            setSaveError(
                "Failed to save your profile. Please try again."
            )
        } finally {
            setIsSaving(false)
        }
    }

    // ============================================================
    // SKILLS
    // ============================================================

    function updateSkill(
        id: string,
        value: string
    ) {
        setSkills((current) =>
            current.map((skill) =>
                skill.id === id
                    ? {
                          ...skill,
                          name: value,
                      }
                    : skill
            )
        )
    }

    function removeSkill(id: string) {
        setSkills((current) =>
            current.filter(
                (skill) => skill.id !== id
            )
        )
    }

    function addSkill() {
        setSkills((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                name: "",
                category: "",
            },
        ])
    }

    // ============================================================
    // WORK EXPERIENCE
    // ============================================================

    function addWorkExperience() {
        setWorkExperiences((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                company_name: "",
                job_title: "",
                start_date: "",
                end_date: "",
                is_current: false,
                responsibilities: [""],
            },
        ])
    }

    function removeWorkExperience(
        id: string
    ) {
        setWorkExperiences((current) =>
            current.filter(
                (experience) =>
                    experience.id !== id
            )
        )
    }

    function updateWorkExperience(
        id: string,
        field: string,
        value: string | boolean
    ) {
        setWorkExperiences((current) =>
            current.map((experience) =>
                experience.id === id
                    ? {
                          ...experience,
                          [field]: value,
                      }
                    : experience
            )
        )
    }

    // ============================================================
    // RESPONSIBILITIES
    // ============================================================

    function updateResponsibility(
        experienceId: string,
        index: number,
        value: string
    ) {
        setWorkExperiences((current) =>
            current.map((experience) => {
                if (
                    experience.id !==
                    experienceId
                ) {
                    return experience
                }

                const responsibilities = [
                    ...experience.responsibilities,
                ]

                responsibilities[index] =
                    value

                return {
                    ...experience,
                    responsibilities,
                }
            })
        )
    }

    function addResponsibility(
        experienceId: string
    ) {
        setWorkExperiences((current) =>
            current.map((experience) =>
                experience.id ===
                experienceId
                    ? {
                          ...experience,
                          responsibilities: [
                              ...experience.responsibilities,
                              "",
                          ],
                      }
                    : experience
            )
        )
    }

    function removeResponsibility(
        experienceId: string,
        index: number
    ) {
        setWorkExperiences((current) =>
            current.map((experience) => {
                if (
                    experience.id !==
                    experienceId
                ) {
                    return experience
                }

                return {
                    ...experience,
                    responsibilities:
                        experience.responsibilities.filter(
                            (_, i) =>
                                i !== index
                        ),
                }
            })
        )
    }

    // ============================================================
    // EDUCATION
    // ============================================================

    function addEducation() {
        setEducations((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                institution: "",
                degree: "",
                field_of_study: "",
                start_date: "",
                end_date: "",
                grade: "",
                description: "",
            },
        ])
    }

    function removeEducation(
        id: string
    ) {
        setEducations((current) =>
            current.filter(
                (education) =>
                    education.id !== id
            )
        )
    }

    function updateEducation(
        id: string,
        field: string,
        value: string
    ) {
        setEducations((current) =>
            current.map((education) =>
                education.id === id
                    ? {
                          ...education,
                          [field]: value,
                      }
                    : education
            )
        )
    }

    // ============================================================
    // PROJECTS
    // ============================================================

    function addProject() {
        setProjects((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                name: "",
                description: "",
                technologies: [],
                url: "",
                start_date: "",
                end_date: "",
            },
        ])
    }

    function removeProject(
        id: string
    ) {
        setProjects((current) =>
            current.filter(
                (project) =>
                    project.id !== id
            )
        )
    }

    function updateProject(
        id: string,
        field: string,
        value: string
    ) {
        setProjects((current) =>
            current.map((project) =>
                project.id === id
                    ? {
                          ...project,
                          [field]: value,
                      }
                    : project
            )
        )
    }

    function updateProjectTechnologies(
        id: string,
        value: string
    ) {
        setProjects((current) =>
            current.map((project) =>
                project.id === id
                    ? {
                          ...project,
                          technologies:
                              value
                                  .split(",")
                                  .map(
                                      (
                                          technology
                                      ) =>
                                          technology.trim()
                                  )
                                  .filter(
                                      Boolean
                                  ),
                      }
                    : project
            )
        )
    }

    // ============================================================
    // CERTIFICATIONS
    // ============================================================

    function addCertification() {
        setCertifications((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                name: "",
                issuer: "",
                issue_date: "",
                expiry_date: "",
                credential_id: "",
                credential_url: "",
            },
        ])
    }

    function removeCertification(
        id: string
    ) {
        setCertifications((current) =>
            current.filter(
                (certification) =>
                    certification.id !==
                    id
            )
        )
    }

    function updateCertification(
        id: string,
        field: string,
        value: string
    ) {
        setCertifications((current) =>
            current.map((certification) =>
                certification.id === id
                    ? {
                          ...certification,
                          [field]: value,
                      }
                    : certification
            )
        )
    }

        // ============================================================
    // PROFILE COMPLETENESS
    // ============================================================

    const completenessSections = [
        Boolean(
            fullName.trim() &&
            email.trim() &&
            phone.trim() &&
            location.trim()
        ),

        Boolean(
            headline.trim() &&
            summary.trim()
        ),

        skills.some(
            (skill) => skill.name.trim().length > 0
        ),

        workExperiences.length > 0,

        educations.length > 0,

        projects.length > 0,

        certifications.length > 0,
    ]

    const completedSections =
        completenessSections.filter(Boolean).length

    const totalSections =
        completenessSections.length

    const profileCompleteness = Math.round(
        (completedSections / totalSections) * 100
    )

    const progressRadius = 42
    const progressCircumference =
        2 * Math.PI * progressRadius

    const progressOffset =
        progressCircumference -
        (profileCompleteness / 100) *
            progressCircumference

    return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-28 [zoom:1.1]">

        {/* ================================================== */}
        {/* PROFILE COMPLETENESS */}
        {/* ================================================== */}

        <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
            <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row">

                <div className="relative flex size-28 shrink-0 items-center justify-center">
                    <svg
                        className="size-28 -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r={progressRadius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-muted/30"
                        />

                        <circle
                            cx="50"
                            cy="50"
                            r={progressRadius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className="text-primary transition-all duration-500"
                            strokeDasharray={progressCircumference}
                            strokeDashoffset={progressOffset}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">
                            {profileCompleteness}%
                        </span>

                        <span className="text-[10px] text-muted-foreground">
                            Complete
                        </span>
                    </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg font-semibold">
                        Profile Completeness
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Complete your profile to make your
                        resume stronger and improve your
                        job application experience.
                    </p>

                    <div className="mt-3 flex items-center justify-center gap-2 text-sm sm:justify-start">
                        <CircleCheck className="size-4 text-primary" />

                        <span>
                            {completedSections} of{" "}
                            {totalSections} sections completed
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* ================================================== */}
        {/* PROFILE TABS */}
        {/* ================================================== */}

        <Tabs
            defaultValue="personal"
            className="w-full"
        >

            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-3 lg:grid-cols-6">

                <TabsTrigger
                    value="personal"
                    className="gap-2 py-3"
                >
                    <UserRound className="size-4" />
                    <span>Personal</span>
                </TabsTrigger>

                <TabsTrigger
                    value="skills"
                    className="gap-2 py-3"
                >
                    <Code2 className="size-4" />
                    <span>Skills</span>
                </TabsTrigger>

                <TabsTrigger
                    value="experience"
                    className="gap-2 py-3"
                >
                    <BriefcaseBusiness className="size-4" />
                    <span>Experience</span>
                </TabsTrigger>

                <TabsTrigger
                    value="education"
                    className="gap-2 py-3"
                >
                    <GraduationCap className="size-4" />
                    <span>Education</span>
                </TabsTrigger>

                <TabsTrigger
                    value="projects"
                    className="gap-2 py-3"
                >
                    <FolderGit2 className="size-4" />
                    <span>Projects</span>
                </TabsTrigger>

                <TabsTrigger
                    value="certifications"
                    className="gap-2 py-3"
                >
                    <Award className="size-4" />
                    <span>Certificates</span>
                </TabsTrigger>

            </TabsList>

            {/* ================================================== */}
            {/* PERSONAL TAB */}
            {/* ================================================== */}

            <TabsContent
                value="personal"
                className="mt-6 space-y-6"
            >

        {/* ================================================== */}
        {/* PERSONAL INFORMATION */}
        {/* ================================================== */}

            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle>
                        Personal Information
                    </CardTitle>

                    <CardDescription>
                        Your basic contact and professional
                        information.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-5 p-6 sm:grid-cols-2">

                    {/* Full name */}

                    <div className="space-y-2">
                        <Label htmlFor="full-name">
                            Full name
                        </Label>

                        <Input
                            id="full-name"
                            value={fullName}
                            onChange={(event) =>
                                setFullName(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Your full name"
                        />
                    </div>

                    {/* Email */}

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Phone */}

                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Phone
                        </Label>

                        <Input
                            id="phone"
                            value={phone}
                            onChange={(event) =>
                                setPhone(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>

                    {/* Location */}

                    <div className="space-y-2">
                        <Label htmlFor="location">
                            Location
                        </Label>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="location"
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="City, Country"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Headline */}

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="headline">
                            Professional headline
                        </Label>

                        <Input
                            id="headline"
                            value={headline}
                            onChange={(event) =>
                                setHeadline(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Software Engineer | Full Stack Developer"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ================================================== */}
            {/* SUMMARY */}
            {/* ================================================== */}

            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle>
                        Professional Summary
                    </CardTitle>

                    <CardDescription>
                        A short overview of your
                        professional background.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                    <Textarea
                        value={summary}
                        onChange={(event) =>
                            setSummary(
                                event.target.value
                            )
                        }
                        placeholder="Write a brief professional summary..."
                        className="min-h-30 resize-y"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                        Keep this concise and focused
                        on your strongest experience and
                        skills.
                    </p>
                </CardContent>
            </Card>
            </TabsContent>

            {/* ================================================== */}
            {/* SKILLS */}
            {/* ================================================== */}
            <TabsContent
                value="skills"
                className="mt-6 space-y-6"
            >

            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
                <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>
                                Skills
                            </CardTitle>

                            <CardDescription>
                                Skills extracted from your
                                resume.
                            </CardDescription>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addSkill}
                        >
                            <Plus className="mr-2 size-4" />
                            Add Skill
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">

                    {skills.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                No skills added yet.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={addSkill}
                            >
                                <Plus className="mr-2 size-4" />
                                Add Skill
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                            {skills.map(
                                (skill) => (
                                    <div
                                        key={
                                            skill.id
                                        }
                                        className="group flex items-center gap-2 rounded-lg border bg-background p-2 transition-colors hover:border-primary/30"
                                    >
                                        <Input
                                            value={
                                                skill.name
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSkill(
                                                    skill.id,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="e.g. Java"
                                            className="border-0 shadow-none focus-visible:ring-0"
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeSkill(
                                                    skill.id
                                                )
                                            }
                                            className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                                            title="Remove skill"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            </TabsContent>

            {/* ================================================== */}
            {/* WORK EXPERIENCE */}
            {/* ================================================== */}
            <TabsContent
                value="experience"
                className="mt-6 space-y-6"
            >

            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
                <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>
                                Work Experience
                            </CardTitle>

                            <CardDescription>
                                Your professional work
                                experience and achievements.
                            </CardDescription>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={
                                addWorkExperience
                            }
                        >
                            <Plus className="mr-2 size-4" />
                            Add Experience
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">

                    {workExperiences.length ===
                    0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <Briefcase className="mx-auto size-8 text-muted-foreground" />

                            <p className="mt-3 text-sm font-medium">
                                No work experience
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Add your professional
                                experience to strengthen
                                your profile.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={
                                    addWorkExperience
                                }
                            >
                                <Plus className="mr-2 size-4" />
                                Add Experience
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {workExperiences.map(
                                (
                                    experience,
                                    index
                                ) => (
                                    <div
                                        key={
                                            experience.id
                                        }
                                        className="rounded-xl border bg-background p-5 shadow-sm"
                                    >

                                        {/* Experience Header */}

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex gap-3">

                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                    <Briefcase className="size-5 text-primary" />
                                                </div>

                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        Experience{" "}
                                                        {index +
                                                            1}
                                                    </p>

                                                    <h3 className="mt-1 text-base font-semibold">
                                                        {experience.company_name ||
                                                            "New Experience"}
                                                    </h3>

                                                    {experience.job_title && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                experience.job_title
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeWorkExperience(
                                                        experience.id
                                                    )
                                                }
                                                className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                title="Remove experience"
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>

                                        {/* Fields */}

                                        <div className="mt-5 grid gap-4 sm:grid-cols-2">

                                            <div className="space-y-2">
                                                <Label>
                                                    Company
                                                </Label>

                                                <Input
                                                    value={
                                                        experience.company_name
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateWorkExperience(
                                                            experience.id,
                                                            "company_name",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Company name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Job title
                                                </Label>

                                                <Input
                                                    value={
                                                        experience.job_title
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateWorkExperience(
                                                            experience.id,
                                                            "job_title",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Software Engineer"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Start date
                                                </Label>

                                                <div className="relative">
                                                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                    <Input
                                                        type="date"
                                                        value={
                                                            experience.start_date
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateWorkExperience(
                                                                experience.id,
                                                                "start_date",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    End date
                                                </Label>

                                                <div className="relative">
                                                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                    <Input
                                                        type="date"
                                                        value={
                                                            experience.end_date
                                                        }
                                                        disabled={
                                                            experience.is_current
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateWorkExperience(
                                                                experience.id,
                                                                "end_date",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Current Job */}

                                        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    experience.is_current
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateWorkExperience(
                                                        experience.id,
                                                        "is_current",
                                                        event
                                                            .target
                                                            .checked
                                                    )
                                                }
                                                className="size-4 rounded"
                                            />

                                            <span>
                                                I currently
                                                work here
                                            </span>
                                        </label>

                                        {/* Divider */}

                                        <div className="my-5 border-t" />

                                        {/* Responsibilities */}

                                        <div className="space-y-3">

                                            <div className="flex items-start justify-between gap-4">

                                                <div>
                                                    <Label>
                                                        Responsibilities
                                                        & achievements
                                                    </Label>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Highlight what
                                                        you built,
                                                        improved, or
                                                        achieved.
                                                    </p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        addResponsibility(
                                                            experience.id
                                                        )
                                                    }
                                                >
                                                    <Plus className="mr-2 size-4" />
                                                    Add
                                                </Button>
                                            </div>

                                            {experience
                                                .responsibilities
                                                .length ===
                                            0 ? (
                                                <div className="rounded-lg border border-dashed p-5 text-center">
                                                    <p className="text-sm text-muted-foreground">
                                                        No responsibilities
                                                        added yet.
                                                    </p>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-3"
                                                        onClick={() =>
                                                            addResponsibility(
                                                                experience.id
                                                            )
                                                        }
                                                    >
                                                        <Plus className="mr-2 size-4" />
                                                        Add Responsibility
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {experience.responsibilities.map(
                                                        (
                                                            responsibility,
                                                            responsibilityIndex
                                                        ) => (
                                                            <div
                                                                key={
                                                                    responsibilityIndex
                                                                }
                                                                className="flex items-start gap-2"
                                                            >

                                                                <div className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />

                                                                <Input
                                                                    value={
                                                                        responsibility
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        updateResponsibility(
                                                                            experience.id,
                                                                            responsibilityIndex,
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="e.g. Developed scalable web applications"
                                                                    className="flex-1"
                                                                />

                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        removeResponsibility(
                                                                            experience.id,
                                                                            responsibilityIndex
                                                                        )
                                                                    }
                                                                    className="size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                                    title="Remove responsibility"
                                                                >
                                                                    <X className="size-4" />
                                                                </Button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            </TabsContent>

            {/* ================================================== */}
            {/* EDUCATION */}
            {/* ================================================== */}

            <TabsContent
                value="education"
                className="mt-6 space-y-6"
            >

            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
                <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>
                                Education
                            </CardTitle>

                            <CardDescription>
                                Your academic background and qualifications.
                            </CardDescription>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addEducation}
                        >
                            <Plus className="mr-2 size-4" />
                            Add Education
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {educations.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                No education added yet.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={addEducation}
                            >
                                <Plus className="mr-2 size-4" />
                                Add Education
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {educations.map(
                                (
                                    education,
                                    index
                                ) => (
                                    <div
                                        key={
                                            education.id
                                        }
                                        className="rounded-xl border bg-background p-5 shadow-sm"
                                    >
                                        <div className="mb-5 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Education{" "}
                                                    {index +
                                                        1}
                                                </p>

                                                <h3 className="mt-1 text-base font-semibold">
                                                    {education.institution ||
                                                        "New Education"}
                                                </h3>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeEducation(
                                                        education.id
                                                    )
                                                }
                                                className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                title="Remove education"
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>
                                                    Institution
                                                </Label>

                                                <Input
                                                    value={
                                                        education.institution
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEducation(
                                                            education.id,
                                                            "institution",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="University / College"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Degree
                                                </Label>

                                                <Input
                                                    value={
                                                        education.degree
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEducation(
                                                            education.id,
                                                            "degree",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="B.Tech"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Field of study
                                                </Label>

                                                <Input
                                                    value={
                                                        education.field_of_study
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEducation(
                                                            education.id,
                                                            "field_of_study",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Computer Science"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Grade
                                                </Label>

                                                <Input
                                                    value={
                                                        education.grade
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEducation(
                                                            education.id,
                                                            "grade",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="8.5 CGPA"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Start date
                                                </Label>

                                                <Input
                                                    type="date"
                                                    value={
                                                        education.start_date
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEducation(
                                                            education.id,
                                                            "start_date",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    End date
                                                </Label>

                                                <Input
                                                    type="date"
                                                    value={
                                                        education.end_date
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEducation(
                                                            education.id,
                                                            "end_date",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2 sm:col-span-2">
                                                <Label>
                                                    Description
                                                </Label>

                                                <Textarea
                                                    value={
                                                        education.description
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateEducation(
                                                            education.id,
                                                            "description",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Relevant coursework, achievements, activities..."
                                                    className="min-h-24 resize-y"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            </TabsContent>

            {/* ================================================== */}
            {/* PROJECTS */}
            {/* ================================================== */}
            <TabsContent
                value="projects"
                className="mt-6 space-y-6"
            >

            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
                <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>
                                Projects
                            </CardTitle>

                            <CardDescription>
                                Showcase your technical and personal projects.
                            </CardDescription>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addProject}
                        >
                            <Plus className="mr-2 size-4" />
                            Add Project
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {projects.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                No projects added yet.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={addProject}
                            >
                                <Plus className="mr-2 size-4" />
                                Add Project
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {projects.map(
                                (
                                    project,
                                    index
                                ) => (
                                    <div
                                        key={
                                            project.id
                                        }
                                        className="rounded-xl border bg-background p-5 shadow-sm"
                                    >
                                        <div className="mb-5 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Project{" "}
                                                    {index +
                                                        1}
                                                </p>

                                                <h3 className="mt-1 text-base font-semibold">
                                                    {project.name ||
                                                        "New Project"}
                                                </h3>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeProject(
                                                        project.id
                                                    )
                                                }
                                                className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                title="Remove project"
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2 sm:col-span-2">
                                                <Label>
                                                    Project name
                                                </Label>

                                                <Input
                                                    value={
                                                        project.name
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateProject(
                                                            project.id,
                                                            "name",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="AI Job Application Agent"
                                                />
                                            </div>

                                            <div className="space-y-2 sm:col-span-2">
                                                <Label>
                                                    Description
                                                </Label>

                                                <Textarea
                                                    value={
                                                        project.description
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateProject(
                                                            project.id,
                                                            "description",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Describe what you built and the problem it solves..."
                                                    className="min-h-24 resize-y"
                                                />
                                            </div>

                                            <div className="space-y-2 sm:col-span-2">
                                                <Label>
                                                    Technologies
                                                </Label>

                                                <Input
                                                    value={project.technologies.join(
                                                        ", "
                                                    )}
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateProjectTechnologies(
                                                            project.id,
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="React, Next.js, TypeScript, Supabase"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Separate technologies with commas.
                                                </p>
                                            </div>

                                            <div className="space-y-2 sm:col-span-2">
                                                <Label>
                                                    Project URL
                                                </Label>

                                                <Input
                                                    value={
                                                        project.url
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateProject(
                                                            project.id,
                                                            "url",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Start date
                                                </Label>

                                                <Input
                                                    type="date"
                                                    value={
                                                        project.start_date
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateProject(
                                                            project.id,
                                                            "start_date",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    End date
                                                </Label>

                                                <Input
                                                    type="date"
                                                    value={
                                                        project.end_date
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateProject(
                                                            project.id,
                                                            "end_date",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            </TabsContent>

            {/* ================================================== */}
            {/* CERTIFICATIONS */}
            {/* ================================================== */}
            <TabsContent
                value="certifications"
                className="mt-6 space-y-6"
            >

            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm dark:border-gray-400">
                <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>
                                Certifications
                            </CardTitle>

                            <CardDescription>
                                Professional certifications and credentials.
                            </CardDescription>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={
                                addCertification
                            }
                        >
                            <Plus className="mr-2 size-4" />
                            Add Certification
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {certifications.length ===
                    0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                No certifications added yet.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={
                                    addCertification
                                }
                            >
                                <Plus className="mr-2 size-4" />
                                Add Certification
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {certifications.map(
                                (
                                    certification,
                                    index
                                ) => (
                                    <div
                                        key={
                                            certification.id
                                        }
                                        className="rounded-xl border bg-background p-5 shadow-sm"
                                    >
                                        <div className="mb-5 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Certification{" "}
                                                    {index +
                                                        1}
                                                </p>

                                                <h3 className="mt-1 text-base font-semibold">
                                                    {certification.name ||
                                                        "New Certification"}
                                                </h3>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeCertification(
                                                        certification.id
                                                    )
                                                }
                                                className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                title="Remove certification"
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>
                                                    Certification name
                                                </Label>

                                                <Input
                                                    value={
                                                        certification.name
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateCertification(
                                                            certification.id,
                                                            "name",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="AWS Certified Cloud Practitioner"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Issuer
                                                </Label>

                                                <Input
                                                    value={
                                                        certification.issuer
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateCertification(
                                                            certification.id,
                                                            "issuer",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Amazon Web Services"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Issue date
                                                </Label>

                                                <Input
                                                    type="date"
                                                    value={
                                                        certification.issue_date
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateCertification(
                                                            certification.id,
                                                            "issue_date",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Expiry date
                                                </Label>

                                                <Input
                                                    type="date"
                                                    value={
                                                        certification.expiry_date
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateCertification(
                                                            certification.id,
                                                            "expiry_date",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Credential ID
                                                </Label>

                                                <Input
                                                    value={
                                                        certification.credential_id
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateCertification(
                                                            certification.id,
                                                            "credential_id",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="ABC123XYZ"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Credential URL
                                                </Label>

                                                <Input
                                                    value={
                                                        certification.credential_url
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateCertification(
                                                            certification.id,
                                                            "credential_url",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>

            {/* ================================================== */}
            {/* FEEDBACK */}
            {/* ================================================== */}

            {saveError && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {saveError}
                    </AlertDescription>
                </Alert>
            )}

            {saveSuccess && (
                <Alert>
                    <AlertDescription>
                        Profile saved successfully.
                    </AlertDescription>
                </Alert>
            )}

            {/* ================================================== */}
            {/* STICKY SAVE BAR */}
            {/* ================================================== */}

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <div className="hidden text-sm sm:block">
                        {saveSuccess ? (
                            <span className="text-green-600">
                                Profile saved successfully.
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                Remember to save your changes.
                            </span>
                        )}
                    </div>

                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="ml-auto"
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    )
}