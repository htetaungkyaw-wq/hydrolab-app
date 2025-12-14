import { createBrowserClient, type SupabaseClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

let hasLoggedMissingEnv = false

export function createSupabaseBrowserClient(): SupabaseClient<Database> | null {
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

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
