"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTopic, type AddTopicState } from "./actions"

export function AddTopicForm() {
  const [state, action, pending] = useActionState<AddTopicState, FormData>(
    addTopic,
    undefined,
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.error) {
      toast.error(state.error)
    } else if (!state.fieldErrors) {
      toast.success("Topic added.")
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-wrap items-start gap-2"
    >
      <div className="min-w-[240px] flex-1">
        <Input
          name="keyword"
          placeholder="e.g. SIM swap scam India"
          required
          disabled={pending}
          aria-invalid={Boolean(state?.fieldErrors?.keyword)}
        />
        {state?.fieldErrors?.keyword ? (
          <p className="mt-1 text-xs text-destructive">
            {state.fieldErrors.keyword[0]}
          </p>
        ) : null}
      </div>
      <div className="w-28">
        <Input
          type="number"
          name="priority"
          defaultValue={50}
          min={0}
          max={1000}
          placeholder="Priority"
          disabled={pending}
        />
      </div>
      <Button type="submit" disabled={pending} size="default">
        {pending ? "Adding…" : "Add"}
      </Button>
    </form>
  )
}
