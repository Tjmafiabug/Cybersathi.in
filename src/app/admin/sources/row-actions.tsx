"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { deleteSource, toggleSourceActive } from "./actions"

export function SourceRowActions({
  id,
  active,
}: {
  id: string
  active: boolean
}) {
  const [pending, startTransition] = useTransition()

  const toggle = () =>
    startTransition(async () => {
      const res = await toggleSourceActive(id, !active)
      if (res?.error) toast.error(res.error)
      else toast.success(active ? "Source paused." : "Source resumed.")
    })

  const remove = () => {
    if (!confirm("Delete this source? Linked articles stay but lose source name."))
      return
    startTransition(async () => {
      const res = await deleteSource(id)
      if (res?.error) toast.error(res.error)
      else toast.success("Source deleted.")
    })
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button size="xs" variant="outline" disabled={pending} onClick={toggle}>
        {active ? "Pause" : "Resume"}
      </Button>
      <Button
        size="xs"
        variant="destructive"
        disabled={pending}
        onClick={remove}
      >
        Delete
      </Button>
    </div>
  )
}
