"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { deleteTopic, toggleTopicActive } from "./actions"

export function TopicRowActions({
  id,
  active,
}: {
  id: string
  active: boolean
}) {
  const [pending, startTransition] = useTransition()

  const toggle = () =>
    startTransition(async () => {
      const res = await toggleTopicActive(id, !active)
      if (res?.error) toast.error(res.error)
      else toast.success(active ? "Topic paused." : "Topic resumed.")
    })

  const remove = () => {
    if (!confirm("Delete this topic? This cannot be undone.")) return
    startTransition(async () => {
      const res = await deleteTopic(id)
      if (res?.error) toast.error(res.error)
      else toast.success("Topic deleted.")
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
