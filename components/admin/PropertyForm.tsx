"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { ImageUploader } from "./ImageUploader"
import type { ActionResult } from "@/app/admin/actions"
import {
  kindLabels,
  purposeLabels,
  statusLabels,
  type Property,
  type PropertyKind,
  type PropertyStatus,
  type Purpose,
} from "@/lib/properties"

export function PropertyForm({
  action,
  property,
  submitLabel,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  property?: Property
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, null)

  return (
    <form action={formAction} className="mt-10 space-y-12">
      {state && "error" in state && (
        <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-5 py-3 text-[13px] text-red-800">
          {state.error}
        </p>
      )}

      <Section title="Identificação">
        <Field label="Nome do imóvel" required full>
          <input name="name" required defaultValue={property?.name} className={input} />
        </Field>

        <Field label="Bairro" required>
          <input name="district" required defaultValue={property?.district} className={input} />
        </Field>

        <Field label="Cidade">
          <input name="city" defaultValue={property?.city ?? "Goiânia"} className={input} />
        </Field>

        <Field
          label="Endereço na URL (slug)"
          hint="Deixe em branco para gerar a partir do nome. Mudar isso quebra links já compartilhados."
          full
        >
          <input name="slug" defaultValue={property?.slug} placeholder="gerado a partir do nome" className={input} />
        </Field>
      </Section>

      <Section title="Classificação">
        <Field label="Finalidade">
          <select name="purpose" defaultValue={property?.purpose ?? "venda"} className={input}>
            {(Object.keys(purposeLabels) as Purpose[]).map((k) => (
              <option key={k} value={k}>
                {purposeLabels[k]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tipo">
          <select name="kind" defaultValue={property?.kind ?? "residencia"} className={input}>
            {(Object.keys(kindLabels) as PropertyKind[]).map((k) => (
              <option key={k} value={k}>
                {kindLabels[k]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Situação">
          <select name="status" defaultValue={property?.status ?? "disponivel"} className={input}>
            {(Object.keys(statusLabels) as PropertyStatus[]).map((k) => (
              <option key={k} value={k}>
                {statusLabels[k]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Preço (R$)" hint="Deixe vazio para exibir “Sob consulta”.">
          <input
            name="price"
            inputMode="numeric"
            defaultValue={property?.price ?? ""}
            placeholder="4850000"
            className={input}
          />
        </Field>
      </Section>

      <Section title="Medidas">
        <Field label="Área (m²)">
          <input name="area" inputMode="numeric" defaultValue={property?.area ?? ""} className={input} />
        </Field>

        <Field label="Quartos">
          <input name="bedrooms" inputMode="numeric" defaultValue={property?.bedrooms ?? ""} className={input} />
        </Field>

        <Field label="Suítes">
          <input name="suites" inputMode="numeric" defaultValue={property?.suites ?? ""} className={input} />
        </Field>

        <Field label="Vagas">
          <input name="parking" inputMode="numeric" defaultValue={property?.parking ?? ""} className={input} />
        </Field>
      </Section>

      <Section title="Texto">
        <Field label="Chamada" hint="Uma frase, exibida em destaque na página do imóvel." full>
          <input name="headline" defaultValue={property?.headline} className={input} />
        </Field>

        <Field label="Descrição" full>
          <textarea name="description" rows={6} defaultValue={property?.description} className={`${input} resize-y`} />
        </Field>

        <Field label="Diferenciais" hint="Um por linha." full>
          <textarea
            name="features"
            rows={6}
            defaultValue={property?.features.join("\n")}
            placeholder={"Piscina aquecida\nAdega climatizada"}
            className={`${input} resize-y`}
          />
        </Field>
      </Section>

      <Section title="Fotos">
        <div className="sm:col-span-2">
          <ImageUploader
            label="Foto de capa"
            hint="É a imagem usada nos cards e no topo da página do imóvel."
            name="image"
            initial={property?.image ? [property.image] : []}
          />
        </div>

        <div className="sm:col-span-2">
          <ImageUploader
            label="Galeria"
            hint="As duas primeiras aparecem ao lado da capa na página do imóvel."
            name="gallery"
            multiple
            initial={property?.gallery ?? []}
          />
        </div>
      </Section>

      <Section title="Publicação">
        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            type="checkbox"
            name="published"
            defaultChecked={property?.published ?? true}
            className="mt-1 size-4 accent-[#b08d57]"
          />
          <span>
            <span className="block text-[13px]">Publicado no site</span>
            <span className="block text-[11px] text-muted">
              Desmarcado, o imóvel fica só no painel como rascunho.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={property?.featured ?? true}
            className="mt-1 size-4 accent-[#b08d57]"
          />
          <span>
            <span className="block text-[13px]">Destaque na home</span>
            <span className="block text-[11px] text-muted">
              A home mostra até seis destaques, dos mais recentes para os mais antigos.
            </span>
          </span>
        </label>
      </Section>

      <div className="flex items-center gap-6 border-t border-line pt-8">
        <Submit label={submitLabel} />
        <Link href="/admin" className="text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

function Submit({ label }: { label: string }) {
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

const input =
  "w-full border-0 border-b border-line bg-transparent pb-3 text-sm outline-none transition-colors focus:border-gold"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-8 w-full border-b border-line pb-3 text-[9px] uppercase tracking-[0.22em] text-muted">
        {title}
      </legend>
      <div className="grid gap-8 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function Field({
  label,
  hint,
  required,
  full,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">
        {label}
        {required && <span className="text-gold-deep"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-2 block text-[11px] text-muted">{hint}</span>}
    </label>
  )
}
