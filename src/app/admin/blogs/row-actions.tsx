"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { setBlogStatus } from "./actions"

type ContentStatus = "pending_review" | "published" | "rejected" | "archived"

export function BlogRowActions({
  id,
  status,
}: {
  id: string
  status: ContentStatus
}) {
  const [pending, startTransition] = useTransition()

  const change = (next: ContentStatus, label: string) => {
    startTransition(async () => {
      const res = await setBlogStatus(id, next)
      if (res?.error) toast.error(res.error)
      else toast.success(`Moved to ${label}.`)
    })
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {status !== "published" ? (
        <Button
          size="xs"
          variant="outline"
          disabled={pending}
          onClick={() => change("published", "Published")}
        >
          Publish
        </Button>
      ) : null}
      {status !== "rejected" && status !== "archived" ? (
        <Button
          size="xs"
          variant="ghost"
          disabled={pending}
          onClick={() => change("rejected", "Rejected")}
        >
          Reject
        </Button>
      ) : null}
      {status === "published" ? (
        <Button
          size="xs"
          variant="ghost"
          disabled={pending}
          onClick={() => change("archived", "Archived")}
        >
          Archive
        </Button>
      ) : null}
    </div>
  )
}
