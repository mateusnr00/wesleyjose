import Link from "next/link"
import { createProperty } from "@/app/admin/actions"
import { PropertyForm } from "@/components/admin/PropertyForm"

export const metadata = { title: "Novo imóvel" }

export default function NewPropertyPage() {
  return (
    <>
      <Link href="/admin" className="text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite">
        ← Voltar
      </Link>

      <h1 className="display mt-6 text-3xl">Novo imóvel</h1>
      <p className="mt-2 text-[13px] text-muted">
        Nome e bairro são obrigatórios. O resto pode ser preenchido depois.
      </p>

      <PropertyForm action={createProperty} submitLabel="Criar imóvel" />
    </>
  )
}
