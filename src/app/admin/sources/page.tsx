import { desc } from "drizzle-orm"
import { formatDistanceToNow } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"
import { cn } from "@/lib/utils"

import { EmptyState } from "../_components/empty-state"
import { PageHeader } from "../_components/page-header"
import { AddSourceForm } from "./add-source-form"
import { SourceRowActions } from "./row-actions"

export const dynamic = "force-dynamic"

export const metadata = { title: "Sources — Admin · CyberSathi" }

export default async function AdminSourcesPage() {
  const session = await getAdminSession()
  if (!session) return null

  const rows = await db
    .select()
    .from(schema.newsSources)
    .orderBy(desc(schema.newsSources.active), desc(schema.newsSources.createdAt))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Sources"
        description="RSS feeds and APIs the news scraper pulls from."
      />

      <section className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Add a new source
        </p>
        <AddSourceForm />
      </section>

      {rows.length === 0 ? (
        <EmptyState
          title="No sources configured"
          description="Add RSS feeds or API endpoints above to start scraping."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[80px]">Type</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="w-[180px]">Last polled</TableHead>
                <TableHead className="w-[200px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    {r.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground uppercase">
                    {r.type}
                  </TableCell>
                  <TableCell className="max-w-[320px] truncate text-sm text-muted-foreground">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      {r.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-transparent",
                        r.active
                          ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {r.active ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.lastPolledAt
                      ? formatDistanceToNow(r.lastPolledAt, {
                          addSuffix: true,
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <SourceRowActions id={r.id} active={r.active} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
