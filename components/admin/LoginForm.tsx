"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      // A mensagem da API é genérica de propósito: não revelamos se o e-mail existe.
      setError("E-mail ou senha incorretos.")
      setLoading(false)
      return
    }

    // refresh() força o middleware a rodar de novo com o cookie já gravado.
    router.replace(params.get("redirect") || "/admin")
    router.refresh()
  }

  const inputClass =
    "w-full border-0 border-b border-line bg-transparent pb-3 text-sm outline-none transition-colors focus:border-gold"

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <label className="block">
        <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">E-mail</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">Senha</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </label>

      {error && (
        <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[12px] text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-graphite px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors enabled:hover:bg-gold disabled:opacity-40"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  )
}
