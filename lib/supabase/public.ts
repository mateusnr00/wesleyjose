import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente anônimo, sem cookies, para as páginas públicas.
 *
 * Ler a sessão via cookies() forçaria toda página a virar dinâmica. O site
 * público não depende de quem está logado, então usamos a chave anônima
 * direto e as páginas seguem estáticas, revalidadas pelo painel ao salvar.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  )
}
