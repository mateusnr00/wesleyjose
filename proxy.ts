import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Renova a sessão do Supabase a cada request e protege o painel.
 *
 * Esta é a única camada que consegue reescrever os cookies de sessão antes da
 * renderização. Sem ela, o token expira e o admin cai para o login no meio do
 * trabalho.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Sem configuração não há como autenticar ninguém. Responder 503 com o motivo
  // é mais útil que deixar o createServerClient estourar em um 500 opaco.
  if (!url || !anonKey) {
    return new NextResponse(
      "Painel indisponível: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente do projeto.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    )
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // getUser() revalida o token no servidor. Não trocar por getSession(), que
  // confia no cookie sem verificar e por isso não serve para autorizar.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"

  if (pathname.startsWith("/admin") && !isLogin && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
