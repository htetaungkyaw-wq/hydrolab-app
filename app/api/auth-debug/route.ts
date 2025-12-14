import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({
      ok: false,
      hasUser: false,
      userId: null,
      message: 'Supabase client not configured',
    })
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.warn('[auth-debug] getUser error: %s', error.message)
  }

  return NextResponse.json({
    ok: true,
    hasUser: Boolean(user),
    userId: user?.id ?? null,
  })
}
