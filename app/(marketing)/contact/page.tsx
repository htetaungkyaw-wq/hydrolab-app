'use client'

import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

const leadCategories = ['Residential', 'Commercial', 'Industrial', 'Healthcare', 'Other']

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null)
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setStatus('Supabase is not configured. Please add environment variables.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const payload: Database['public']['Tables']['leads']['Insert'] = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      location: formData.get('location') as string,
      category: formData.get('category') as string,
      message: formData.get('message') as string,
      created_at: new Date().toISOString(),
    }
    const { error } = await (supabase as SupabaseClient<Database>).from('leads').insert(payload)
    if (error) {
      setStatus('Unable to save request. Please try again.')
    } else {
      setStatus('Request received. Our team will call you to schedule a site survey.')
      event.currentTarget.reset()
    }
  }

  return (
    <section className="section">
      <div className="container grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Request Site Survey</h1>
          <p className="text-slate-700">
            Tell us about your water challenge. We respond within one business day to book an assessment.
          </p>
          <p className="text-slate-700">Offices: Insein Township & Mayangone Township, Yangon</p>
          <p className="text-slate-700">Phones: 09 250 000 465 / 09 795 289 705</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-sm font-semibold text-slate-900">Name</label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded border px-3 py-2"
              disabled={!supabaseConfigured}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Phone</label>
              <input
                name="phone"
                required
                className="mt-1 w-full rounded border px-3 py-2"
                disabled={!supabaseConfigured}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Email</label>
              <input
                name="email"
                type="email"
                className="mt-1 w-full rounded border px-3 py-2"
                disabled={!supabaseConfigured}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Location</label>
            <input
              name="location"
              className="mt-1 w-full rounded border px-3 py-2"
              disabled={!supabaseConfigured}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Category</label>
            <select
              name="category"
              className="mt-1 w-full rounded border px-3 py-2"
              disabled={!supabaseConfigured}
            >
              {leadCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Message</label>
            <textarea
              name="message"
              rows={4}
              className="mt-1 w-full rounded border px-3 py-2"
              disabled={!supabaseConfigured}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-brand-dark px-4 py-2 text-white"
            disabled={!supabaseConfigured}
          >
            Submit
          </button>
          <p className="text-sm text-slate-700">
            {supabaseConfigured
              ? 'We will save your request securely and reach out within one business day.'
              : 'Supabase is not configured. Add environment variables to enable submissions.'}
          </p>
          {status && <p className="text-sm text-brand-dark">{status}</p>}
        </form>
      </div>
    </section>
  )
}
