"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addSource, type AddSourceState } from "./actions"

export function AddSourceForm() {
  const [state, action, pending] = useActionState<AddSourceState, FormData>(
    addSource,
    undefined,
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.error) {
      toast.error(state.error)
    } else if (!state.fieldErrors) {
      toast.success("Source added.")
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={action}
      className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_0.6fr_2fr_auto]"
    >
      <div>
        <Input
          name="name"
          placeholder="The Hacker News RSS"
          required
          disabled={pending}
          aria-invalid={Boolean(state?.fieldErrors?.name)}
        />
        {state?.fieldErrors?.name ? (
          <p className="mt-1 text-xs text-destructive">
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>
      <div>
        <select
          name="type"
          defaultValue="rss"
          disabled={pending}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
        >
          <option value="rss">rss</option>
          <option value="api">api</option>
        </select>
      </div>
      <div>
        <Input
          name="url"
          type="url"
          placeholder="https://example.com/feed.xml"
          required
          disabled={pending}
          aria-invalid={Boolean(state?.fieldErrors?.url)}
        />
        {state?.fieldErrors?.url ? (
          <p className="mt-1 text-xs text-destructive">
            {state.fieldErrors.url[0]}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add"}
      </Button>
    </form>
  )
}
