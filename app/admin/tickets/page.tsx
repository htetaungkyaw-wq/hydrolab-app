'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { DataTable, Column } from '@/components/admin/DataTable'
import { Button } from '@/components/admin/ui/button'
import { Modal } from '@/components/admin/ui/modal'
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import { Select } from '@/components/admin/ui/select'
import { useToast } from '@/components/admin/ui/toast'
import type { Database } from '@/types/supabase'

type Ticket = Database['public']['Tables']['maintenance_tickets']['Row']
type Customer = Database['public']['Tables']['customers']['Row']
type System = Database['public']['Tables']['systems']['Row']

const empty: Partial<Ticket> = { status: 'open', subject: '', description: '', customer_id: '', system_id: null }

export default function TicketsAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Ticket[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [systems, setSystems] = useState<System[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Ticket | null>(null)
  const [form, setForm] = useState<Partial<Ticket>>(empty)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Ticket | null>(null)

  const customerNameById = useMemo(() => new Map(customers.map((c) => [c.id, c.name])), [customers])

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const [c, s, t] = await Promise.all([
      supabase.from('customers').select('id,name').order('created_at', { ascending: false }),
      supabase.from('systems').select('id,customer_id,system_type,location').order('created_at', { ascending: false }),
      supabase.from('maintenance_tickets').select('*').order('created_at', { ascending: false }),
    ])
    if (c.error) toast({ type: 'error', message: c.error.message })
    if (s.error) toast({ type: 'error', message: s.error.message })
    if (t.error) toast({ type: 'error', message: t.error.message })
    setCustomers((c.data ?? []) as Customer[])
    setSystems((s.data ?? []) as System[])
    setRows((t.data ?? []) as Ticket[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<Ticket>[] = [
    { key: 'status', header: 'Status', render: (r) => r.status ?? '-' },
    { key: 'customer_id', header: 'Customer', render: (r) => customerNameById.get(r.customer_id ?? '') ?? '-' },
    { key: 'subject', header: 'Subject', render: (r) => r.subject ?? '-' },
    { key: 'created_at', header: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleString() : '-') },
    { key: 'updated_at', header: 'Updated', render: (r) => (r.updated_at ? new Date(r.updated_at).toLocaleString() : '-') },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setModalOpen(true)
  }
  function openEdit(r: Ticket) {
    setEditing(r)
    setForm({
      status: r.status ?? 'open',
      subject: r.subject ?? '',
      description: r.description ?? '',
      customer_id: r.customer_id ?? '',
      system_id: r.system_id ?? null,
    })
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    if (!form.customer_id) return toast({ type: 'error', message: 'Customer is required.' })
    if (!form.subject || !String(form.subject).trim()) return toast({ type: 'error', message: 'Subject is required.' })

    const payload = {
      status: form.status ? String(form.status) : null,
      subject: String(form.subject).trim(),
      description: form.description ? String(form.description).trim() : null,
      customer_id: String(form.customer_id),
      system_id: form.system_id ? String(form.system_id) : null,
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      const { error } = await supabase.from('maintenance_tickets').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Ticket updated.' })
    } else {
      const { error } = await supabase.from('maintenance_tickets').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Ticket created.' })
    }
    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('maintenance_tickets').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Ticket deleted.' })
    setToDelete(null)
    await refresh()
  }

  const systemsForCustomer = useMemo(() => {
    if (!form.customer_id) return []
    return systems.filter((x) => x.customer_id === form.customer_id)
  }, [systems, form.customer_id])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Tickets</h2>
          <p className="text-xs text-slate-400">Manage maintenance tickets.</p>
        </div>
        <Button onClick={openCreate}>Add Ticket</Button>
      </div>

      <DataTable rows={rows} columns={columns} isLoading={loading} searchKeys={['status', 'subject', 'description']} actions={(r) => (
        <div className="inline-flex items-center gap-2">
          <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
          <Button variant="danger" onClick={() => { setToDelete(r); setConfirmOpen(true) }}>Delete</Button>
        </div>
      )} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Ticket' : 'Add Ticket'} footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={save}>{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      }>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Status</label>
            <Select value={String(form.status ?? 'open')} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="closed">closed</option>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Customer *</label>
            <Select value={String(form.customer_id ?? '')} onChange={(e) => setForm((p) => ({ ...p, customer_id: e.target.value, system_id: null }))}>
              <option value="">Select customer…</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">System (optional)</label>
            <Select value={String(form.system_id ?? '')} onChange={(e) => setForm((p) => ({ ...p, system_id: e.target.value || null }))} disabled={!form.customer_id}>
              <option value="">No system</option>
              {systemsForCustomer.map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.system_type ?? 'System')} — {(s.location ?? '')}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Subject *</label>
            <Input value={String(form.subject ?? '')} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Description</label>
            <Textarea rows={4} value={String(form.description ?? '')} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} title="Delete ticket" message="Delete this ticket?" confirmText="Delete" onConfirm={removeConfirmed} onClose={() => setConfirmOpen(false)} />
    </div>
  )
}
