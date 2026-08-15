import Link from "next/link"
import { Suspense } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Spinner } from "@/components/ui/spinner"

function AuthFormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="size-6" />
    </div>
  )
}

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/40 via-zinc-950 to-zinc-950" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
              <span className="text-sm font-bold">P</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Picky AI
            </span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Your AI job
            <br />
            application agent
          </h2>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-indigo-400" />
              Tailored cover letters in seconds
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-indigo-400" />
              Smart job matching
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-indigo-400" />
              Track every application
            </li>
          </ul>
        </div>
        <div className="relative z-10 text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Picky AI Job Agent
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">P</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Picky AI</span>
          </div>
          <Suspense fallback={<AuthFormFallback />}>
            <AuthForm mode="sign-up" />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
