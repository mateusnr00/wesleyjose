"use client"

import { useState } from "react"
import { site, whatsappLink } from "@/lib/site"

const interests = [
  "Comprar um imóvel",
  "Vender meu imóvel",
  "Avaliar meu imóvel",
  "Investimento / lançamento",
  "Outro assunto",
]

export function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", interest: interests[0], message: "" })

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

    window.open(whatsappLink(text), "_blank", "noopener,noreferrer")
  }

  const inputClass =
    "w-full border-0 border-b border-line bg-transparent pb-3 text-sm outline-none transition-colors focus:border-gold"

  return (
    <section id="contato" className="py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          <div>
            <p className="eyebrow">Contato direto</p>

            <h2 className="display mt-7 max-w-xs text-[2.25rem] lg:text-[3rem]">
              Vamos conversar sobre o que você <em>procura</em>.
            </h2>

            <p className="mt-8 max-w-sm text-muted">
              Responder uma mensagem leva menos tempo do que percorrer trinta anúncios. Conte o que você
              precisa e a gente volta com uma lista curta — ou com a informação de que ainda não é hora
              de comprar.
            </p>

            <dl className="mt-14 space-y-7 border-t border-line pt-10">
              <div>
                <dt className="text-[9px] uppercase tracking-[0.22em] text-muted">WhatsApp</dt>
                <dd className="mt-2">
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gold">
                    {site.contact.whatsappDisplay}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[9px] uppercase tracking-[0.22em] text-muted">E-mail</dt>
                <dd className="mt-2">
                  <a href={`mailto:${site.contact.email}`} className="text-sm hover:text-gold">
                    {site.contact.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[9px] uppercase tracking-[0.22em] text-muted">Atendimento</dt>
                <dd className="mt-2 text-sm">
                  {site.contact.address.street}, {site.contact.address.district}
                  <br />
                  {site.contact.address.city} · {site.contact.address.state}
                  <br />
                  <span className="text-muted">{site.contact.hours}</span>
                </dd>
              </div>
            </dl>
          </div>

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
                  <option key={option} value={option}>
                    {option}
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
                Enviar pelo WhatsApp →
              </button>
              <p className="mt-4 text-[11px] text-muted">
                Ao enviar, abrimos o WhatsApp com sua mensagem já preenchida.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
