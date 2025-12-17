'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { DataTable, Column } from '@/components/admin/DataTable'
import { Button } from '@/components/admin/ui/button'
import { Modal } from '@/components/admin/ui/modal'
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog'
import { Input } from '@/components/admin/ui/input'
import { Select } from '@/components/admin/ui/select'
import { useToast } from '@/components/admin/ui/toast'
import type { Database } from '@/types/supabase'

type SystemFilter = Database['public']['Tables']['system_filters']['Row']
type System = Database['public']['Tables']['systems']['Row']
type Template = Database['public']['Tables']['filter_templates']['Row']
type Customer = Database['public']['Tables']['customers']['Row']

const empty: Partial<SystemFilter> = {
  system_id: '',
  template_id: '',
  life_days_override: null,
  last_changed_at: null,
}

export default function SystemFiltersAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<SystemFilter[]>([])
  const [systems, setSystems] = useState<System[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SystemFilter | null>(null)
  const [form, setForm] = useState<Partial<SystemFilter>>(empty)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<SystemFilter | null>(null)

  const customerNameById = useMemo(() => new Map(customers.map((c) => [c.id, c.name])), [customers])
  const templateNameById = useMemo(() => new Map(templates.map((t) => [t.id, t.name])), [templates])

  const systemLabel = (id: string) => {
    const s = systems.find((x) => x.id === id)
    if (!s) return id
    const cname = s.customer_id ? customerNameById.get(s.customer_id) : null
    return `${cname ? cname + ' • ' : ''}${s.system_type ?? 'System'} • ${s.location ?? ''}`.trim()
  }

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const [c, s, t, f] = await Promise.all([
      supabase.from('customers').select('id,name'),
      supabase.from('systems').select('id,customer_id,system_type,location'),
      supabase.from('filter_templates').select('id,name').order('stage_order', { ascending: true }),
      supabase.from('system_filters').select('*').order('created_at', { ascending: false }),
    ])
    if (c.error) toast({ type: 'error', message: c.error.message })
    if (s.error) toast({ type: 'error', message: s.error.message })
    if (t.error) toast({ type: 'error', message: t.error.message })
    if (f.error) toast({ type: 'error', message: f.error.message })
    setCustomers((c.data ?? []) as Customer[])
    setSystems((s.data ?? []) as System[])
    setTemplates((t.data ?? []) as Template[])
    setRows((f.data ?? []) as SystemFilter[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<SystemFilter>[] = [
    { key: 'system_id', header: 'System', render: (r) => (r.system_id ? systemLabel(r.system_id) : '-') },
    { key: 'template_id', header: 'Template', render: (r) => templateNameById.get(r.template_id ?? '') ?? '-' },
    { key: 'life_days_override', header: 'Life Override', render: (r) => (r.life_days_override ?? '-') as any },
    { key: 'last_changed_at', header: 'Last Changed', render: (r) => (r.last_changed_at ? String(r.last_changed_at) : '-') },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setModalOpen(true)
  }
  function openEdit(r: SystemFilter) {
    setEditing(r)
    setForm({
      system_id: r.system_id ?? '',
      template_id: r.template_id ?? '',
      life_days_override: r.life_days_override ?? null,
      last_changed_at: r.last_changed_at ?? null,
    })
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    if (!form.system_id) return toast({ type: 'error', message: 'System is required.' })
    if (!form.template_id) return toast({ type: 'error', message: 'Template is required.' })

    const payload = {
      system_id: String(form.system_id),
      template_id: String(form.template_id),
      life_days_override:
        form.life_days_override === null || form.life_days_override === undefined || form.life_days_override === ''
          ? null
          : Number(form.life_days_override),
      last_changed_at: form.last_changed_at ? String(form.last_changed_at) : null,
    }

    if (editing) {
      const { error } = await supabase.from('system_filters').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'System filter updated.' })
    } else {
      const { error } = await supabase.from('system_filters').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'System filter created.' })
    }

    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('system_filters').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'System filter deleted.' })
    setToDelete(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">System Filters</h2>
          <p className="text-xs text-slate-400">Assign filter stages to each system.</p>
        </div>
        <Button onClick={openCreate}>Add System Filter</Button>
      </div>

      <DataTable rows={rows} columns={columns} isLoading={loading} searchKeys={['system_id', 'template_id']} actions={(r) => (
        <div className="inline-flex items-center gap-2">
          <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
          <Button variant="danger" onClick={() => { setToDelete(r); setConfirmOpen(true) }}>Delete</Button>
        </div>
      )} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit System Filter' : 'Add System Filter'} footer={
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
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Template *</label>
            <Select value={String(form.template_id ?? '')} onChange={(e) => setForm((p) => ({ ...p, template_id: e.target.value }))}>
              <option value="">Select template…</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Life Override (days)</label>
            <Input type="number" value={form.life_days_override === null || form.life_days_override === undefined ? '' : String(form.life_days_override)} onChange={(e) => setForm((p) => ({ ...p, life_days_override: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Last Changed At</label>
            <Input type="date" value={form.last_changed_at ? String(form.last_changed_at) : ''} onChange={(e) => setForm((p) => ({ ...p, last_changed_at: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} title="Delete system filter" message="Delete this system filter?" confirmText="Delete" onConfirm={removeConfirmed} onClose={() => setConfirmOpen(false)} />
    </div>
  )
}
