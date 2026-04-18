import Link from "next/link"
import { ShieldHalf } from "lucide-react"

import { getAdminSession } from "@/lib/auth/dal"
import { Toaster } from "@/components/ui/sonner"
import { AdminSidebar } from "./admin-sidebar"
import { LoginForm } from "./login-form"

export const metadata = {
  title: "Admin — CyberSathi",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/30 px-4 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-foreground"
          >
            <ShieldHalf className="h-7 w-7 text-primary" aria-hidden />
            <span className="text-lg font-semibold tracking-tight">
              CyberSathi
            </span>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">
                Sign in to admin
              </h1>
              <p className="text-sm text-muted-foreground">
                This area is restricted to CyberSathi editors.
              </p>
            </div>

            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Looking for articles?{" "}
            <Link href="/" className="underline underline-offset-4">
              Back to CyberSathi
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar email={session.email} displayName={session.displayName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
