"use client"

import { useState } from "react"
import { Destaque } from "./Destaque"
import { Reveal } from "./Reveal"
import { useSite } from "./SiteContext"
import { waLink } from "@/lib/whatsapp"

export function Contact({
  block,
  interests,
}: {
  block: Record<string, string>
  interests: { id: string; label?: string }[]
}) {
  const site = useSite()
  const [form, setForm] = useState({ name: "", phone: "", interest: interests[0]?.label ?? "", message: "" })

  /**
   * Sem servidor de e-mail, o formulário monta uma mensagem estruturada e abre
   * o WhatsApp do consultor. O lead chega no canal que a equipe já usa e nada
   * se perde numa caixa de entrada sem dono.
   * TODO(cliente): se quiser registro em CRM, trocar por uma server action que
   * grave o lead antes de redirecionar.
   */
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const text = [
      `Olá! Vim pelo site da ${site.name}.`,
      "",
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `Interesse: ${form.interest}`,
      form.message ? `Mensagem: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    window.open(waLink(site.whatsapp, text), "_blank", "noopener,noreferrer")
  }

  const inputClass =
    "w-full border-0 border-b border-line bg-transparent pb-3 text-sm outline-none transition-colors focus:border-gold"

  return (
    <section id="contato" className="py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          <Reveal variant="left">
            <p className="eyebrow">{block.eyebrow}</p>

            <h2 className="display mt-7 max-w-xs text-[2.25rem] lg:text-[3rem]">
              <Destaque>{block.title}</Destaque>
            </h2>

            <p className="mt-8 max-w-sm text-muted">
{block.text}
            </p>

            <dl className="mt-14 space-y-7 border-t border-line pt-10">
              <div>
                <dt className="text-[9px] uppercase tracking-[0.22em] text-muted">WhatsApp</dt>
                <dd className="mt-2">
                  <a href={waLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="tap text-sm hover:text-gold-deep">
                    {site.whatsappDisplay}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[9px] uppercase tracking-[0.22em] text-muted">E-mail</dt>
                <dd className="mt-2">
                  <a href={`mailto:${site.email}`} className="tap text-sm hover:text-gold-deep">
                    {site.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[9px] uppercase tracking-[0.22em] text-muted">Atendimento</dt>
                <dd className="mt-2 text-sm">
                  {site.street}, {site.district}
                  <br />
                  {site.city} · {site.state}
                  <br />
                  <span className="text-muted">{site.hours}</span>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal variant="right" delay={120}>
          <form onSubmit={handleSubmit} className="grid gap-9 sm:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">Nome</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">Telefone</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">Interesse</span>
              <select
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                className={`${inputClass} appearance-none`}
              >
                {interests.map((option) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">
                Mensagem (opcional)
              </span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-graphite px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold sm:w-auto"
              >
                {block.button} →
              </button>
              <p className="mt-4 text-[12px] text-muted">
                Ao enviar, abrimos o WhatsApp com sua mensagem já preenchida.
              </p>
            </div>
          </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
