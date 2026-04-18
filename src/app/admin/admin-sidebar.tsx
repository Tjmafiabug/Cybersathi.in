"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  LayoutDashboard,
  Newspaper,
  PlayCircle,
  Rss,
  Settings2,
  ShieldHalf,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { logout } from "./actions"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/videos", label: "Videos", icon: PlayCircle },
  { href: "/admin/topics", label: "Topics", icon: Settings2 },
  { href: "/admin/sources", label: "Sources", icon: Rss },
  { href: "/admin/jobs", label: "Jobs", icon: Workflow },
]

export function AdminSidebar({
  email,
  displayName,
}: {
  email: string
  displayName: string | null
}) {
  const pathname = usePathname()

  return (
    <aside className="flex h-dvh w-60 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <Link
        href="/admin"
        className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4"
      >
        <ShieldHalf className="h-6 w-6 text-primary" aria-hidden />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">
            CyberSathi
          </span>
          <span className="text-[0.7rem] text-muted-foreground">Admin</span>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const Icon = item.icon
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    active &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 px-1.5">
          <p className="truncate text-sm font-medium">
            {displayName ?? email.split("@")[0]}
          </p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <form action={logout}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full"
          >
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  )
}
