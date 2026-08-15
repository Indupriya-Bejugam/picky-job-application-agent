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

export default function SignInPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-950 to-zinc-950" />
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
        <div className="relative z-10 space-y-4">
          <blockquote className="text-xl font-medium leading-relaxed text-zinc-300">
            &ldquo;Land your dream job faster with AI-powered applications
            tailored to every role.&rdquo;
          </blockquote>
          <p className="text-sm text-zinc-500">
            Trusted by job seekers worldwide
          </p>
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
            <AuthForm mode="sign-in" />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
