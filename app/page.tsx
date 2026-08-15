import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <span className="text-lg font-bold">P</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          AI Job Application Agent
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Apply to jobs smarter with AI-tailored cover letters, smart matching,
          and application tracking — all in one place.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link
            href="/sign-up"
            className={buttonVariants({
              size: "lg",
              className: "h-10 min-w-36 text-sm",
            })}
          >
            Get started
          </Link>

          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "h-10 min-w-36 text-sm",
            })}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
