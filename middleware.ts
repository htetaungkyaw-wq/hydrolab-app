import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname
  const protect = path.startsWith('/admin') || path.startsWith('/portal')
  if (protect && !session) {
    const redirect = req.nextUrl.clone()
    redirect.pathname = '/'
    return NextResponse.redirect(redirect)
  }

  if (session && path.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      const redirect = req.nextUrl.clone()
      redirect.pathname = '/'
      return NextResponse.redirect(redirect)
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
}
