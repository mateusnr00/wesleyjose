import Link from "next/link"
import { notFound } from "next/navigation"
import { saveBlock } from "@/app/admin/content-actions"
import { ContentForm } from "@/components/admin/ContentForm"
import { blockSchema, blocks, type BlockKey } from "@/lib/content-schema"
import { getBlockForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const bloco = blocks[key as BlockKey]
  return { title: bloco ? bloco.label : "Conteúdo" }
}

export default async function BlockEditor({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { key } = await params
  const busca = await searchParams
  if (!(key in blocks)) notFound()

  const chave = key as BlockKey
  const bloco = blockSchema(chave)
  const valores = await getBlockForAdmin(chave)
  const action = saveBlock.bind(null, chave)

  return (
    <>
      <Link href="/admin/conteudo" className="tap text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite">
        ← Conteúdo do site
      </Link>

      <h1 className="display mt-6 text-3xl">{bloco.label}</h1>
      <p className="mt-2 text-[13px] text-muted">{bloco.group}</p>

      {busca.salvo && (
        <p role="status" className="mt-8 border-l-2 border-gold bg-cream-deep/60 px-5 py-3 text-[13px]">
          Alterações salvas e publicadas no site.
        </p>
      )}

      <ContentForm
        action={action}
        fields={bloco.fields}
        values={valores}
        submitLabel="Salvar"
        cancelHref="/admin/conteudo"
      />
    </>
  )
}
