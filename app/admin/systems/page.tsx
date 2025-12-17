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

type System = Database['public']['Tables']['systems']['Row']
type Customer = Database['public']['Tables']['customers']['Row']

const emptySystem: Partial<System> = {
  customer_id: '',
  system_type: '',
  flow_rate_lph: null,
  location: '',
  installed_at: null,
  notes: '',
}

export default function SystemsAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const [systems, setSystems] = useState<System[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<System | null>(null)
  const [form, setForm] = useState<Partial<System>>(emptySystem)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<System | null>(null)

  const customerNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of customers) map.set(c.id, c.name)
    return map
  }, [customers])

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const [{ data: custData, error: custErr }, { data: sysData, error: sysErr }] = await Promise.all([
      supabase.from('customers').select('id,name').order('created_at', { ascending: false }),
      supabase.from('systems').select('*').order('created_at', { ascending: false }),
    ])
    if (custErr) toast({ type: 'error', message: custErr.message })
    if (sysErr) toast({ type: 'error', message: sysErr.message })
    setCustomers((custData ?? []) as Customer[])
    setSystems((sysData ?? []) as System[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<System & { customer_name?: string }>[] = [
    { key: 'customer_id', header: 'Customer', render: (r) => customerNameById.get(r.customer_id ?? '') ?? '-' },
    { key: 'system_type', header: 'Type', render: (r) => r.system_type ?? '-' },
    { key: 'flow_rate_lph', header: 'Flow (LPH)', render: (r) => (r.flow_rate_lph ?? '-') as any },
    { key: 'location', header: 'Location', render: (r) => r.location ?? '-' },
    { key: 'installed_at', header: 'Installed', render: (r) => (r.installed_at ? String(r.installed_at) : '-') },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...emptySystem })
    setModalOpen(true)
  }

  function openEdit(row: System) {
    setEditing(row)
    setForm({
      customer_id: row.customer_id ?? '',
      system_type: row.system_type ?? '',
      flow_rate_lph: row.flow_rate_lph ?? null,
      location: row.location ?? '',
      installed_at: row.installed_at ?? null,
      notes: row.notes ?? '',
    })
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    if (!form.customer_id) {
      toast({ type: 'error', message: 'Customer is required.' })
      return
    }
    const payload = {
      customer_id: String(form.customer_id),
      system_type: form.system_type ? String(form.system_type).trim() : null,
      flow_rate_lph: form.flow_rate_lph === null || form.flow_rate_lph === undefined ? null : Number(form.flow_rate_lph),
      location: form.location ? String(form.location).trim() : null,
      installed_at: form.installed_at ? String(form.installed_at) : null,
      notes: form.notes ? String(form.notes).trim() : null,
    }

    if (editing) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error Supabase types misinfer the update payload.
      const { error } = await supabase.from('systems').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'System updated.' })
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error Supabase types misinfer the insert payload.
      const { error } = await supabase.from('systems').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'System created.' })
    }
    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('systems').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'System deleted.' })
    setToDelete(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Systems</h2>
          <p className="text-xs text-slate-400">Manage installed water filtration systems.</p>
        </div>
        <Button onClick={openCreate}>Add System</Button>
      </div>

      <DataTable
        rows={systems as any}
        columns={columns as any}
        isLoading={loading}
        searchKeys={['system_type', 'location', 'notes'] as any}
        actions={(r: any) => (
          <div className="inline-flex items-center gap-2">
            <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
            <Button
              variant="danger"
              onClick={() => {
                setToDelete(r)
                setConfirmOpen(true)
              }}
            >
              Delete
            </Button>
          </div>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit System' : 'Add System'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Customer *</label>
            <Select
              value={String(form.customer_id ?? '')}
              onChange={(e) => setForm((p) => ({ ...p, customer_id: e.target.value }))}
            >
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400">System Type</label>
            <Input value={String(form.system_type ?? '')} onChange={(e) => setForm((p) => ({ ...p, system_type: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Flow Rate (LPH)</label>
            <Input
              type="number"
              value={form.flow_rate_lph === null || form.flow_rate_lph === undefined ? '' : String(form.flow_rate_lph)}
              onChange={(e) =>
                setForm((p) => ({ ...p, flow_rate_lph: e.target.value === '' ? null : Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Location</label>
            <Input value={String(form.location ?? '')} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Installed At</label>
            <Input type="date" value={form.installed_at ? String(form.installed_at) : ''} onChange={(e) => setForm((p) => ({ ...p, installed_at: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Notes</label>
            <Textarea rows={3} value={String(form.notes ?? '')} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete system"
        message="Delete this system? Related filters and logs may also be deleted (cascade)."
        confirmText="Delete"
        onConfirm={removeConfirmed}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}
