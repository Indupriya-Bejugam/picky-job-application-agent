"use client"

import {
    CheckCircle2,
    CircleAlert,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

type ProfileCompletenessCardProps = {
    percentage: number
    completed: number
    total: number
}

export function ProfileCompletenessCard({
    percentage,
    completed,
    total,
}: ProfileCompletenessCardProps) {
    const radius = 42
    const circumference = 2 * Math.PI * radius
    const offset =
        circumference -
        (percentage / 100) * circumference

    return (
        <Card className="overflow-hidden border-2 shadow-sm">
            <CardContent className="flex items-center gap-5 p-5">
                {/* Circular progress */}

                <div className="relative size-24 shrink-0">
                    <svg
                        className="size-24 -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-muted/30"
                        />

                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className="text-primary transition-all duration-700"
                            strokeDasharray={
                                circumference
                            }
                            strokeDashoffset={offset}
                        />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">
                            {percentage}%
                        </span>
                    </div>
                </div>

                {/* Information */}

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {percentage === 100 ? (
                            <CheckCircle2 className="size-5 text-green-600" />
                        ) : (
                            <CircleAlert className="size-5 text-primary" />
                        )}

                        <h3 className="font-semibold">
                            Profile Completeness
                        </h3>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {percentage === 100
                            ? "Your profile is complete."
                            : "Complete your profile to improve your job applications."}
                    </p>

                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                        {completed} of {total} sections completed
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}