"use client"

import { useState } from "react"

/**
 * Mapa que só carrega quando o visitante pede.
 *
 * Um iframe de mapa traz centenas de KB de terceiro e trabalho de main thread.
 * Carregar isso sempre custaria o desempenho da página inteira para um recurso
 * que a maioria não abre. Até o clique, mostramos o endereço, que é a
 * informação que a pessoa realmente precisa.
 */
export function PropertyMap({ district, city, state }: { district: string; city: string; state: string }) {
  const [carregado, setCarregado] = useState(false)
  const consulta = encodeURIComponent(`${district}, ${city} - ${state}`)

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-cream-deep sm:aspect-[21/9]">
      {carregado ? (
        <iframe
          title={`Mapa de ${district}, ${city}`}
          src={`https://www.google.com/maps?q=${consulta}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
          {/* Grade discreta, para o espaço não parecer um bloco vazio. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="relative flex flex-col items-center gap-4">
            <svg viewBox="0 0 24 24" className="size-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>

            <p className="display text-xl">
              {district}, {city}
            </p>

            <button
              type="button"
              onClick={() => setCarregado(true)}
              className="border border-graphite/25 px-7 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-graphite hover:bg-graphite hover:text-cream"
            >
              Carregar o mapa
            </button>

            <span className="text-[11px] text-muted">Carregado só quando você pede, para a página abrir rápido.</span>
          </div>
        </div>
      )}
    </div>
  )
}
