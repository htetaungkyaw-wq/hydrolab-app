'use client'

import { Suspense, FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = useMemo(() => {
    const nextParam = searchParams.get('next')?.trim()

    if (!nextParam) return '/admin'
    if (!nextParam.startsWith('/') || nextParam.startsWith('//')) return '/admin'

    return nextParam
  }, [searchParams])
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!supabase) {
      setError('Supabase is not configured for this environment.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  const supabaseConfigured = Boolean(supabase)
  const envHasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const envHasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in with your email and password to continue.
        </p>

        {!supabase && (
          <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Supabase environment variables are missing. Please contact an
            administrator.
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-dark focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-dark focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-brand-dark px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-6 space-y-1 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <p className="font-semibold">Auth debug</p>
            <p>hostname: {hostname || 'unknown'}</p>
            <p>supabase client present: {supabaseConfigured ? 'yes' : 'no'}</p>
            <p>env NEXT_PUBLIC_SUPABASE_URL set: {envHasUrl ? 'yes' : 'no'}</p>
            <p>env NEXT_PUBLIC_SUPABASE_ANON_KEY set: {envHasAnonKey ? 'yes' : 'no'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
