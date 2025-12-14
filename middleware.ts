import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const bypassAuth =
    process.env.DEV_BYPASS_AUTH === 'true' && process.env.NODE_ENV !== 'production'

  if (bypassAuth) {
    return res
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing; skipping auth enforcement.')
    return res
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) =>
          res.cookies.set(cookie.name, cookie.value, cookie.options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname
  const protect = path.startsWith('/admin') || path.startsWith('/portal')

  if (protect && !user) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('next', path + req.nextUrl.search)

    const redirectResponse = NextResponse.redirect(redirectUrl)
    res.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie)
    )
    return redirectResponse
  }

  if (user && path.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const redirect = req.nextUrl.clone()
      redirect.pathname = '/'

      const redirectResponse = NextResponse.redirect(redirect)
      res.cookies.getAll().forEach((cookie) =>
        redirectResponse.cookies.set(cookie)
      )
      return redirectResponse
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
}
