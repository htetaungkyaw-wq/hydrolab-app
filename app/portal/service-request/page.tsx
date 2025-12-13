'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

export default function ServiceRequestPage() {
  const [status, setStatus] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      subject: formData.get('subject'),
      description: formData.get('description'),
      status: 'open',
      system_id: formData.get('system_id'),
    }
    const { error } = await supabase.from('maintenance_tickets').insert(payload as any)
    if (error) setStatus('Failed to submit ticket. Please try again.')
    else {
      setStatus('Ticket submitted. Our engineers will get in touch.')
      event.currentTarget.reset()
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Request Service</h1>
      <form onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-semibold text-slate-900">System ID</label>
          <input name="system_id" required className="mt-1 w-full rounded border px-3 py-2" placeholder="sys-1" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900">Subject</label>
          <input name="subject" required className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900">Description</label>
          <textarea name="description" rows={4} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <button type="submit" className="rounded bg-brand-dark px-4 py-2 text-white">Submit</button>
        {status && <p className="text-sm text-brand-dark">{status}</p>}
      </form>
    </div>
  )
}
