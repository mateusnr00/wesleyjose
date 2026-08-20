"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { ContentFields } from "./ContentFields"
import type { ContentResult } from "@/app/admin/content-actions"
import type { Field } from "@/lib/content-schema"

export function ContentForm({
  action,
  fields,
  values,
  submitLabel,
  cancelHref,
}: {
  action: (prev: ContentResult | null, formData: FormData) => Promise<ContentResult>
  fields: readonly Field[]
  values: Record<string, string>
  submitLabel: string
  cancelHref: string
}) {
  const [state, formAction] = useActionState(action, null)

  return (
    <form action={formAction} className="mt-10">
      {state && "error" in state && (
        <p role="alert" className="mb-8 border-l-2 border-red-700 bg-red-50 px-5 py-3 text-[13px] text-red-800">
          {state.error}
        </p>
      )}

      <ContentFields fields={fields} values={values} />

      <div className="mt-12 flex items-center gap-6 border-t border-line pt-8">
        <Enviar label={submitLabel} />
        <Link href={cancelHref} className="tap text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

function Enviar({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-graphite px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors enabled:hover:bg-gold disabled:opacity-40"
    >
      {pending ? "Salvando…" : label}
    </button>
  )
}
