import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/admin/LoginForm"
import { getSiteContent, siteData } from "@/lib/content"

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  const site = siteData(await getSiteContent())

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow before:hidden">{site.name}</p>
        <h1 className="display mt-4 text-3xl">Painel de imóveis</h1>
        <p className="mt-3 text-[13px] text-muted">Acesso restrito à equipe.</p>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
