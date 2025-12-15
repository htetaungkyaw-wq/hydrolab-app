import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let hasLoggedMissingEnv = false

export function createSupabaseBrowserClient(): SupabaseClient<Database, 'public'> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== 'production' && !hasLoggedMissingEnv) {
      console.warn(
        'Supabase environment variables are not configured for the browser client.'
      )
      hasLoggedMissingEnv = true
    }
    return null
  }

  return createBrowserClient<Database, 'public'>(
    supabaseUrl,
    supabaseAnonKey
  )
}
