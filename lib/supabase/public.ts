import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * Cliente anônimo, sem cookies, para as páginas públicas.
 *
 * Ler a sessão via cookies() forçaria toda página a virar dinâmica. O site
 * público não depende de quem está logado, então usamos a chave anônima
 * direto e as páginas seguem estáticas, revalidadas pelo painel ao salvar.
 *
 * Devolve `null` quando as variáveis não estão definidas, em vez de lançar:
 * um build sem configuração deve gerar um site vazio e avisar, não falhar.
 * Isso também impede que uma instabilidade do Supabase derrube o deploy.
 */
export function createPublicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null

  return createSupabaseClient(url, anonKey, { auth: { persistSession: false } })
}
