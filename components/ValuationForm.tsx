"use client"

import { useState } from "react"
import { kindLabels, type PropertyKind } from "@/lib/properties"
import { site, whatsappLink } from "@/lib/site"

type Data = {
  kind: string
  district: string
  area: string
  bedrooms: string
  timing: string
  name: string
  phone: string
}

const steps = [
  { title: "O imóvel", hint: "Tipo e localização" },
  { title: "Os números", hint: "Área, quartos e prazo" },
  { title: "Seu contato", hint: "Para onde enviamos" },
]

const timings = [
  "O quanto antes",
  "Nos próximos 3 meses",
  "Ainda este ano",
  "Só quero saber o valor",
]

/**
 * Formulário de avaliação em três passos. Passos curtos reduzem o abandono:
 * o proprietário só chega no campo de telefone depois de já ter investido
 * algum esforço no preenchimento.
 */
export function ValuationForm({ districts }: { districts: string[] }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Data>({
    kind: "",
    district: "",
    area: "",
    bedrooms: "",
    timing: timings[0],
    name: "",
    phone: "",
  })

  const set = (patch: Partial<Data>) => setData((prev) => ({ ...prev, ...patch }))

  /** Cada passo exige que seus campos essenciais estejam preenchidos. */
  const canAdvance =
    step === 0 ? Boolean(data.kind && data.district) : step === 1 ? Boolean(data.area) : Boolean(data.name && data.phone)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canAdvance) return

    if (step < steps.length - 1) {
      setStep(step + 1)
      return
    }

    const text = [
      `Olá! Quero uma avaliação gratuita do meu imóvel (site da ${site.name}).`,
      "",
      `Tipo: ${kindLabels[data.kind as PropertyKind] ?? data.kind}`,
      `Bairro: ${data.district}`,
      `Área: ${data.area} m²`,
      data.bedrooms ? `Quartos: ${data.bedrooms}` : "",
      `Prazo para vender: ${data.timing}`,
      "",
      `Nome: ${data.name}`,
      `Telefone: ${data.phone}`,
    ]
      .filter(Boolean)
      .join("\n")

    window.open(whatsappLink(text), "_blank", "noopener,noreferrer")
  }

  const inputClass =
    "w-full border-0 border-b border-line bg-transparent pb-3 text-sm outline-none transition-colors focus:border-gold"

  return (
    <form onSubmit={handleSubmit} className="bg-paper p-8 shadow-[0_24px_70px_-50px_rgba(0,0,0,0.5)] lg:p-12">
      {/* Indicador de progresso */}
      <ol className="flex gap-2" aria-label="Etapas do formulário">
        {steps.map((item, index) => (
          <li key={item.title} className="flex-1">
            <span
              className={`block h-px transition-colors duration-500 ${index <= step ? "bg-gold" : "bg-line"}`}
              aria-hidden="true"
            />
            <span
              className={`mt-3 block text-[9px] uppercase tracking-[0.18em] transition-colors ${
                index <= step ? "text-graphite" : "text-muted-light"
              }`}
            >
              {index + 1}. {item.title}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-muted">{steps[step].hint}</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {step === 0 && (
          <>
            <Field label="Tipo de imóvel">
              <select
                required
                value={data.kind}
                onChange={(e) => set({ kind: e.target.value })}
                className={`${inputClass} appearance-none`}
              >
                <option value="">Selecione</option>
                {(Object.keys(kindLabels) as PropertyKind[]).map((k) => (
                  <option key={k} value={k}>
                    {kindLabels[k]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Bairro">
              <input
                required
                list="bairros-goiania"
                value={data.district}
                onChange={(e) => set({ district: e.target.value })}
                placeholder="Ex.: Setor Marista"
                className={inputClass}
              />
              <datalist id="bairros-goiania">
                {districts.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Área privativa (m²)">
              <input
                required
                type="number"
                min={1}
                inputMode="numeric"
                value={data.area}
                onChange={(e) => set({ area: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Quartos">
              <select
                value={data.bedrooms}
                onChange={(e) => set({ bedrooms: e.target.value })}
                className={`${inputClass} appearance-none`}
              >
                <option value="">Selecione</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quando pretende vender?" full>
              <select
                value={data.timing}
                onChange={(e) => set({ timing: e.target.value })}
                className={`${inputClass} appearance-none`}
              >
                {timings.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Nome">
              <input
                required
                type="text"
                value={data.name}
                onChange={(e) => set({ name: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="WhatsApp">
              <input
                required
                type="tel"
                value={data.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="(62) 9 0000-0000"
                className={inputClass}
              />
            </Field>

            <p className="text-[11px] leading-relaxed text-muted sm:col-span-2">
              Usamos seus dados apenas para elaborar e enviar a avaliação. Nada é publicado, nenhuma
              placa é colocada e seu imóvel não entra em portal sem sua autorização.
            </p>
          </>
        )}
      </div>

      <div className="mt-10 flex items-center gap-4">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-graphite"
          >
            ← Voltar
          </button>
        )}

        <button
          type="submit"
          disabled={!canAdvance}
          className="ml-auto bg-graphite px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors enabled:hover:bg-gold disabled:cursor-not-allowed disabled:opacity-35"
        >
          {step === steps.length - 1 ? "Receber avaliação" : "Continuar →"}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">{label}</span>
      {children}
    </label>
  )
}
