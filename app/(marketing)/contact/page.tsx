'use client'

import { useState } from 'react'
import Link from 'next/link'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

const contactInfo = [
  { label: 'Phone', value: '+95 9 250 000 465 / +95 9 795 289 705' },
  { label: 'Offices', value: 'Insein Township & Mayangone Township, Yangon' },
  { label: 'Email', value: 'hello@hydrolab.example.com' },
]

const leadCategories = ['Residential', 'Commercial', 'Industrial', 'Healthcare', 'Other']

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null)
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const client = createSupabaseBrowserClient()
    if (!client) {
      setStatus('Supabase is not configured. Please add environment variables.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      location: formData.get('location') as string,
      category: formData.get('category') as string,
      message: formData.get('message') as string,
      created_at: new Date().toISOString(),
    } satisfies Database['public']['Tables']['leads']['Insert']

    const { error } = await client.from('leads').insert(payload as any)
    if (error) {
      setStatus('Unable to save request. Please try again.')
    } else {
      setStatus('Request received. Our team will call you to schedule a site survey.')
      event.currentTarget.reset()
    }
  }

  return (
    <section className="min-h-screen bg-[#0f172a] py-16 text-slate-100">
      <div className="container grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Contact Engineering</p>
            <h1 className="text-4xl font-semibold text-white">Request a Site Conversation</h1>
            <p className="max-w-2xl text-slate-200/80">
              Tell us about your water reliability goals. Our engineering team will schedule a survey and outline the
              fastest path to production-ready treatment.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Submit a survey request</h2>
            <p className="mt-1 text-sm text-slate-200/80">
              We save your request securely and respond within one business day.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-100/90">
                  Name
                  <input
                    name="name"
                    required
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-400 focus:border-[#38bdf8] focus:outline-none"
                    disabled={!supabaseConfigured}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-100/90">
                  Phone
                  <input
                    name="phone"
                    required
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-400 focus:border-[#38bdf8] focus:outline-none"
                    disabled={!supabaseConfigured}
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-100/90">
                  Email
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-400 focus:border-[#38bdf8] focus:outline-none"
                    disabled={!supabaseConfigured}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-100/90">
                  Location
                  <input
                    name="location"
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-400 focus:border-[#38bdf8] focus:outline-none"
                    disabled={!supabaseConfigured}
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm font-medium text-slate-100/90">
                Category
                <select
                  name="category"
                  className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-white focus:border-[#38bdf8] focus:outline-none"
                  disabled={!supabaseConfigured}
                >
                  {leadCategories.map((item) => (
                    <option key={item} className="bg-slate-900 text-white">
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-100/90">
                Message
                <textarea
                  name="message"
                  rows={4}
                  className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-400 focus:border-[#38bdf8] focus:outline-none"
                  disabled={!supabaseConfigured}
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-[#38bdf8] px-4 py-3 text-sm font-semibold text-slate-950 shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-500"
                disabled={!supabaseConfigured}
              >
                Submit request
              </button>

              <p className="text-sm text-slate-100/80">
                {supabaseConfigured
                  ? 'We will save your request securely and reach out within one business day.'
                  : 'Supabase is not configured. Add environment variables to enable submissions.'}
              </p>
              {status && <p className="text-sm text-[#38bdf8]">{status}</p>}
            </form>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold text-white">Reach us directly</h2>
          <ul className="space-y-3 text-sm text-slate-100/80">
            {contactInfo.map((item) => (
              <li key={item.label} className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.18em] text-[#38bdf8]">{item.label}</span>
                <span className="font-medium text-white/90">{item.value}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
            <h3 className="text-lg font-semibold text-white">Prefer the portal?</h3>
            <p className="mt-1 text-sm text-slate-100/80">
              Portal users can submit a service ticket or request an upgrade directly from their dashboard.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/portal"
                className="rounded-full bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-slate-950 shadow-md transition hover:-translate-y-0.5"
              >
                Go to Portal
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-[#38bdf8] px-5 py-3 text-sm font-semibold text-[#38bdf8] transition hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
              >
                See Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
