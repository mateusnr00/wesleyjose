import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 *
 * A sessão vive em cookie. Em Server Components o Next não permite escrever
 * cookies, então `setAll` falha silenciosamente ali — o middleware é quem
 * renova a sessão, e é por isso que ele precisa existir.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Chamado de um Server Component: o middleware cuida da renovação.
          }
        },
      },
    },
  )
}
