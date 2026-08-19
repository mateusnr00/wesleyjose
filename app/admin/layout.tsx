import Link from "next/link"
import { signOut } from "./actions"
import { createClient } from "@/lib/supabase/server"
import { site } from "@/lib/site"

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // A tela de login usa este layout mas ainda não tem sessão: nesse caso
  // renderizamos só o conteúdo, sem a barra do painel.
  if (!user) return <>{children}</>

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link href="/admin" className="display text-lg">
              {site.name}
            </Link>
            <span className="text-[9px] uppercase tracking-[0.22em] text-muted">Painel</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-graphite"
            >
              Ver site ↗
            </Link>

            <span className="hidden text-[11px] text-muted sm:inline">{user.email}</span>

            <form action={signOut}>
              <button
                type="submit"
                className="text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-graphite"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
    </div>
  )
}
