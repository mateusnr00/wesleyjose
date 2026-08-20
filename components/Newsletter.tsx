"use client"

import { useState } from "react"
import { Reveal } from "./Reveal"
import { site } from "@/lib/site"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [sent, setSent] = useState(false)

  /**
   * Sem backend: o cadastro só ecoa na interface.
   * TODO(cliente): plugar num provedor real (Resend, Brevo, RD Station) via
   * server action antes de publicar. Hoje o e-mail digitado não é persistido.
   */
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className="border-y border-line py-24">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <p className="eyebrow justify-center before:hidden">Boletim mensal</p>

        <h2 className="display mt-5 text-[2rem] lg:text-[2.5rem]">Receba a curadoria do mês.</h2>

        <p className="mx-auto mt-5 max-w-md text-[13px] text-muted">
          Uma vez por mês, os imóveis que entraram no portfólio da {site.name} e uma leitura curta do
          mercado de alto padrão em Goiânia. Sem spam, cancelamento em um clique.
        </p>

        {sent ? (
          <p className="mt-10 text-sm text-gold-deep" role="status">
            Pronto, {name || "obrigado"}! Você receberá a próxima edição no e-mail informado.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end">
            <label className="flex-1 text-left">
              <span className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-muted">Nome</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-0 border-b border-line bg-transparent pb-2 text-sm outline-none transition-colors focus:border-gold"
              />
            </label>

            <label className="flex-1 text-left">
              <span className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-muted">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 border-b border-line bg-transparent pb-2 text-sm outline-none transition-colors focus:border-gold"
              />
            </label>

            <button
              type="submit"
              className="shrink-0 bg-graphite px-8 py-3.5 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold"
            >
              Cadastrar
            </button>
          </form>
        )}
      </Reveal>
    </section>
  )
}
