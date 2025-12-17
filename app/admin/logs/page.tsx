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

type Log = Database['public']['Tables']['maintenance_logs']['Row']
type System = Database['public']['Tables']['systems']['Row']
type Customer = Database['public']['Tables']['customers']['Row']

const empty: Partial<Log> = { system_id: '', performed_at: null, summary: '', technician_name: '', next_due_at: null }

export default function LogsAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Log[]>([])
  const [systems, setSystems] = useState<System[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Log | null>(null)
  const [form, setForm] = useState<Partial<Log>>(empty)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Log | null>(null)

  const customerNameById = useMemo(() => new Map(customers.map((c) => [c.id, c.name])), [customers])

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const [c, s, l] = await Promise.all([
      supabase.from('customers').select('id,name'),
      supabase.from('systems').select('id,customer_id,system_type,location'),
      supabase.from('maintenance_logs').select('*').order('performed_at', { ascending: false }),
    ])
    if (c.error) toast({ type: 'error', message: c.error.message })
    if (s.error) toast({ type: 'error', message: s.error.message })
    if (l.error) toast({ type: 'error', message: l.error.message })
    setCustomers((c.data ?? []) as Customer[])
    setSystems((s.data ?? []) as System[])
    setRows((l.data ?? []) as Log[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const systemLabel = (sysId: string | null) => {
    if (!sysId) return '-'
    const s = systems.find((x) => x.id === sysId)
    if (!s) return sysId
    const cname = s.customer_id ? customerNameById.get(s.customer_id) : null
    return `${cname ? cname + ' • ' : ''}${s.system_type ?? 'System'} • ${s.location ?? ''}`.trim()
  }

  const columns: Column<Log>[] = [
    { key: 'performed_at', header: 'Performed', render: (r) => (r.performed_at ? String(r.performed_at) : '-') },
    { key: 'system_id', header: 'System', render: (r) => systemLabel(r.system_id ?? null) },
    { key: 'technician_name', header: 'Technician', render: (r) => r.technician_name ?? '-' },
    { key: 'summary', header: 'Summary', render: (r) => (r.summary ? <span className="line-clamp-2">{r.summary}</span> : '-') },
    { key: 'next_due_at', header: 'Next Due', render: (r) => (r.next_due_at ? String(r.next_due_at) : '-') },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setModalOpen(true)
  }
  function openEdit(r: Log) {
    setEditing(r)
    setForm({
      system_id: r.system_id ?? '',
      performed_at: r.performed_at ?? null,
      summary: r.summary ?? '',
      technician_name: r.technician_name ?? '',
      next_due_at: r.next_due_at ?? null,
    })
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    if (!form.system_id) return toast({ type: 'error', message: 'System is required.' })
    const payload = {
      system_id: String(form.system_id),
      performed_at: form.performed_at ? String(form.performed_at) : null,
      summary: form.summary ? String(form.summary).trim() : null,
      technician_name: form.technician_name ? String(form.technician_name).trim() : null,
      next_due_at: form.next_due_at ? String(form.next_due_at) : null,
    }
    if (editing) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error Supabase types misinfer the update payload.
      const { error } = await supabase.from('maintenance_logs').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Log updated.' })
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error Supabase types misinfer the insert payload.
      const { error } = await supabase.from('maintenance_logs').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Log created.' })
    }
    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('maintenance_logs').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Log deleted.' })
    setToDelete(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Maintenance Logs</h2>
          <p className="text-xs text-slate-400">Record service visits and next due dates.</p>
        </div>
        <Button onClick={openCreate}>Add Log</Button>
      </div>

      <DataTable rows={rows} columns={columns} isLoading={loading} searchKeys={['summary', 'technician_name']} actions={(r) => (
        <div className="inline-flex items-center gap-2">
          <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
          <Button variant="danger" onClick={() => { setToDelete(r); setConfirmOpen(true) }}>Delete</Button>
        </div>
      )} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Log' : 'Add Log'} footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={save}>{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      }>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">System *</label>
            <Select value={String(form.system_id ?? '')} onChange={(e) => setForm((p) => ({ ...p, system_id: e.target.value }))}>
              <option value="">Select system…</option>
              {systems.map((s) => (
                <option key={s.id} value={s.id}>
                  {systemLabel(s.id)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Performed At</label>
            <Input type="date" value={form.performed_at ? String(form.performed_at) : ''} onChange={(e) => setForm((p) => ({ ...p, performed_at: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Next Due At</label>
            <Input type="date" value={form.next_due_at ? String(form.next_due_at) : ''} onChange={(e) => setForm((p) => ({ ...p, next_due_at: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Technician</label>
            <Input value={String(form.technician_name ?? '')} onChange={(e) => setForm((p) => ({ ...p, technician_name: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Summary</label>
            <Textarea rows={4} value={String(form.summary ?? '')} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} title="Delete log" message="Delete this log?" confirmText="Delete" onConfirm={removeConfirmed} onClose={() => setConfirmOpen(false)} />
    </div>
  )
}
