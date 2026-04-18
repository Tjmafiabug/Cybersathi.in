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
import { AddTopicForm } from "./add-topic-form"
import { TopicRowActions } from "./row-actions"

export const dynamic = "force-dynamic"

export const metadata = { title: "Topics — Admin · CyberSathi" }

export default async function AdminTopicsPage() {
  const session = await getAdminSession()
  if (!session) return null

  const rows = await db
    .select()
    .from(schema.topicQueue)
    .orderBy(desc(schema.topicQueue.priority), desc(schema.topicQueue.createdAt))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Topics"
        description="Keywords that drive blog generation and YouTube video search."
      />

      <section className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Add a new topic
        </p>
        <AddTopicForm />
      </section>

      {rows.length === 0 ? (
        <EmptyState
          title="No topics in the queue"
          description="Add keywords above to feed the content pipelines."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="w-[180px]">Last used</TableHead>
                <TableHead className="w-[200px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.keyword}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.priority}
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
                    {r.lastUsedAt
                      ? formatDistanceToNow(r.lastUsedAt, { addSuffix: true })
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <TopicRowActions id={r.id} active={r.active} />
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
