import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: no logic between createServerClient and getClaims — this is the
  // only call that refreshes an expired session on the response cookies.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const url = request.nextUrl
  if (url.pathname.startsWith("/admin") && !user) {
    const redirectUrl = url.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("next", url.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
