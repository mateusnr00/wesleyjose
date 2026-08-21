import Image from "next/image"
import { Destaque } from "./Destaque"
import { Reveal } from "./Reveal"

type Cliente = { id: string; nome?: string; descricao?: string; logo?: string }

/**
 * Prova social por nome, em tratamento tipográfico.
 *
 * Logotipo de terceiro raramente combina entre si: cada um vem numa proporção,
 * num peso e numa cor, e a fileira acaba parecendo um painel de patrocínio.
 * O nome composto na tipografia do site mantém a página inteira coerente e
 * ainda evita reproduzir marca alheia.
 */
export function Clients({ block, items }: { block: Record<string, string>; items: Cliente[] }) {
  if (items.length === 0) return null

  return (
    <section className="border-y border-line py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          <Reveal variant="left">
            <p className="eyebrow">{block.eyebrow}</p>
            <h2 className="display mt-7 max-w-sm text-[2.25rem] lg:text-[3rem]">
              <Destaque>{block.title}</Destaque>
            </h2>
            <p className="mt-8 max-w-sm text-[13px] leading-relaxed text-muted">{block.text}</p>
          </Reveal>

          {/* O reveal precisa ser o próprio <li>: um wrapper entre <ul> e <li>
              quebra a estrutura da lista para leitor de tela. */}
          {/* Linhas por borda, não por fundo aparecendo entre células: com número
              ímpar de clientes, a célula vazia da última fileira virava um
              bloco cinza solto. */}
          <ul className="grid self-start border-l border-t border-line sm:grid-cols-2">
            {items.map((cliente, i) => (
              <Reveal
                key={cliente.id}
                as="li"
                variant="up"
                delay={Math.min(i * 80, 400)}
                className="flex min-h-[8.5rem] flex-col justify-between gap-4 border-b border-r border-line p-7"
              >
                {/* Com logo, ele ocupa o lugar do nome, que segue no alt para
                    leitor de tela. Sem logo, o nome é composto na tipografia
                    do site. A descrição fica embaixo nos dois casos, para as
                    células não ficarem com estruturas diferentes. */}
                {cliente.logo ? (
                  <span className="relative block h-10 w-full max-w-[11rem]">
                    <Image
                      src={cliente.logo}
                      alt={cliente.nome ?? ""}
                      fill
                      sizes="176px"
                      className="object-contain object-left"
                    />
                  </span>
                ) : (
                  <span className="display text-xl leading-tight">{cliente.nome}</span>
                )}

                <span className="text-[10px] uppercase tracking-[0.18em] text-muted">{cliente.descricao}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
