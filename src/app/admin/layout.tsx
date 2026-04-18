import { requireAdmin } from "@/lib/auth/dal"
import { AdminSidebar } from "./admin-sidebar"

export const metadata = {
  title: "Admin — CyberSathi",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar email={session.email} displayName={session.displayName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
