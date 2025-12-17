'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type TicketInsert = Pick<
  Database['public']['Tables']['maintenance_tickets']['Insert'],
  'subject' | 'description' | 'status' | 'system_id'
>

export default function ServiceRequestPage() {
  const [status, setStatus] = useState<string | null>(null)
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setStatus('Supabase is not configured. Please add environment variables.')
      return
    }
    const formData = new FormData(formElement)
    const systemId = formData.get('system_id')
    const subject = formData.get('subject')
    const description = formData.get('description')

    if (typeof systemId !== 'string' || !systemId.trim()) {
      setStatus('Please provide a system ID.')
      return
    }

    if (typeof subject !== 'string' || !subject.trim()) {
      setStatus('Please provide a subject for your request.')
      return
    }

    const payload: TicketInsert = {
      subject: subject.trim(),
      description:
        typeof description === 'string' && description.trim().length > 0
          ? description.trim()
          : null,
      status: 'open',
      system_id: systemId.trim(),
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error Supabase types misinfer the insert payload.
    const { error } = await supabase.from('maintenance_tickets').insert(payload)
    if (error) {
      setStatus(`Failed to submit ticket: ${error.message}`)
      return
    }

    setStatus('Ticket submitted. Our engineers will get in touch.')
    formElement.reset()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Request Service</h1>
      <form
        onSubmit={submit}
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-sm font-semibold text-slate-900">System ID</label>
          <input
            name="system_id"
            required
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="sys-1"
            disabled={!supabaseConfigured}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900">Subject</label>
          <input
            name="subject"
            required
            className="mt-1 w-full rounded border px-3 py-2"
            disabled={!supabaseConfigured}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900">Description</label>
          <textarea
            name="description"
            rows={4}
            className="mt-1 w-full rounded border px-3 py-2"
            disabled={!supabaseConfigured}
          />
        </div>
        <button
          type="submit"
          className="rounded bg-brand-dark px-4 py-2 text-white"
          disabled={!supabaseConfigured}
        >
          Submit
        </button>
        <p className="text-sm text-slate-700">
          {supabaseConfigured
            ? 'Submit a ticket and our engineers will follow up.'
            : 'Supabase is not configured. Add environment variables to enable submissions.'}
        </p>
        {status && <p className="text-sm text-brand-dark">{status}</p>}
      </form>
    </div>
  )
}
