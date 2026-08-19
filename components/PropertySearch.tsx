"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { kindLabels, type PropertyKind } from "@/lib/properties"

const priceBands = [
  { value: "", label: "Qualquer valor" },
  { value: "0-3000000", label: "Até R$ 3 milhões" },
  { value: "3000000-5000000", label: "R$ 3 a 5 milhões" },
  { value: "5000000-8000000", label: "R$ 5 a 8 milhões" },
  { value: "8000000-", label: "Acima de R$ 8 milhões" },
]

/**
 * Busca rápida do hero. Não filtra localmente — monta a query e delega
 * para /imoveis, que é a página que sabe filtrar (e é linkável/compartilhável).
 */
export function PropertySearch({
  districts,
  variant = "hero",
}: {
  districts: string[]
  variant?: "hero" | "inline"
}) {
  const router = useRouter()
  const [kind, setKind] = useState("")
  const [district, setDistrict] = useState("")
  const [band, setBand] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (kind) params.set("tipo", kind)
    if (district) params.set("bairro", district)
    if (band) params.set("preco", band)
    router.push(`/imoveis${params.size ? `?${params}` : ""}`)
  }

  const fieldClass =
    "w-full appearance-none border-0 border-b border-line bg-transparent pb-3 pr-6 text-sm text-graphite outline-none transition-colors focus:border-gold"

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end lg:gap-8 ${
        variant === "hero" ? "bg-paper p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)] lg:p-10" : ""
      }`}
    >
      <Field label="Tipo de imóvel">
        <select value={kind} onChange={(e) => setKind(e.target.value)} className={fieldClass}>
          <option value="">Todos os tipos</option>
          {(Object.keys(kindLabels) as PropertyKind[]).map((k) => (
            <option key={k} value={k}>
              {kindLabels[k]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Bairro">
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className={fieldClass}>
          <option value="">Todos os bairros</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Faixa de valor">
        <select value={band} onChange={(e) => setBand(e.target.value)} className={fieldClass}>
          {priceBands.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className="bg-graphite px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold sm:col-span-2 lg:col-span-1"
      >
        Buscar
      </button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">{label}</span>
      {children}
    </label>
  )
}
