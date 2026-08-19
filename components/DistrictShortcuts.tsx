import Image from "next/image"
import Link from "next/link"
import { Reveal, RevealGroup } from "./Reveal"
import { placeholderImage, type Property } from "@/lib/properties"

/**
 * Atalhos por bairro, montados a partir do que existe no catálogo.
 *
 * Quem procura alto padrão em Goiânia não pensa "residência de 600 m²", pensa
 * "Marista" ou "Jardim Goiás". Estes atalhos entram nesse vocabulário e ainda
 * geram URLs indexáveis por bairro.
 */
export function DistrictShortcuts({ properties }: { properties: Property[] }) {
  // Um card por bairro, ilustrado pelo imóvel mais caro dali — é o que melhor
  // representa o endereço.
  const byDistrict = new Map<string, { image: string | null; count: number }>()

  for (const property of properties) {
    const current = byDistrict.get(property.district)
    if (!current) {
      byDistrict.set(property.district, { image: property.image, count: 1 })
      continue
    }
    current.count += 1
    if (!current.image) current.image = property.image
  }

  const districts = [...byDistrict.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)

  if (districts.length < 2) return null

  return (
    <section className="pb-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Por endereço</p>
              <h2 className="display mt-6 max-w-md text-[1.75rem] lg:text-[2.25rem]">
                Onde você quer <em>morar</em>?
              </h2>
            </div>
            <Link
              href="/imoveis"
              className="tap underline-grow text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-graphite"
            >
              Ver todos os bairros
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RevealGroup variant="up" step={80}>
            {districts.map(([district, info]) => (
              <Link
                key={district}
                href={`/imoveis?bairro=${encodeURIComponent(district)}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-graphite sm:aspect-[3/2]"
              >
                <Image
                  src={info.image || placeholderImage}
                  alt=""
                  fill
                  unoptimized={!info.image}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/25 to-transparent transition-colors duration-500 group-hover:from-graphite/90" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="display block text-lg leading-tight text-cream">{district}</span>
                  <span className="mt-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-cream/70">
                    {info.count} {info.count === 1 ? "imóvel" : "imóveis"}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
