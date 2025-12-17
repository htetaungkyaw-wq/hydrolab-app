'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { DataTable, Column } from '@/components/admin/DataTable'
import { Button } from '@/components/admin/ui/button'
import { Modal } from '@/components/admin/ui/modal'
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog'
import { Input } from '@/components/admin/ui/input'
import { useToast } from '@/components/admin/ui/toast'
import type { Database } from '@/types/supabase'

type Template = Database['public']['Tables']['filter_templates']['Row']

const empty: Partial<Template> = { name: '', default_life_days: 180, stage_order: 1 }

export default function FilterTemplatesAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Template | null>(null)
  const [form, setForm] = useState<Partial<Template>>(empty)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Template | null>(null)

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('filter_templates').select('*').order('stage_order', { ascending: true })
    if (error) toast({ type: 'error', message: error.message })
    setRows((data ?? []) as Template[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<Template>[] = [
    { key: 'stage_order', header: 'Order', render: (r) => (r.stage_order ?? '-') as any },
    { key: 'name', header: 'Name' },
    { key: 'default_life_days', header: 'Default Life (days)', render: (r) => (r.default_life_days ?? '-') as any },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setModalOpen(true)
  }
  function openEdit(r: Template) {
    setEditing(r)
    setForm({ name: r.name ?? '', default_life_days: r.default_life_days ?? 180, stage_order: r.stage_order ?? 1 })
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    if (!form.name || !String(form.name).trim()) return toast({ type: 'error', message: 'Name is required.' })
    const payload = {
      name: String(form.name).trim(),
      default_life_days: form.default_life_days === null || form.default_life_days === undefined || form.default_life_days === '' ? null : Number(form.default_life_days),
      stage_order: form.stage_order === null || form.stage_order === undefined || form.stage_order === '' ? null : Number(form.stage_order),
    }
    if (editing) {
      const { error } = await supabase.from('filter_templates').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Template updated.' })
    } else {
      const { error } = await supabase.from('filter_templates').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Template created.' })
    }
    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('filter_templates').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Template deleted.' })
    setToDelete(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Filter Templates</h2>
          <p className="text-xs text-slate-400">Define stages and default replacement lifetimes.</p>
        </div>
        <Button onClick={openCreate}>Add Template</Button>
      </div>

      <DataTable rows={rows} columns={columns} isLoading={loading} searchKeys={['name']} actions={(r) => (
        <div className="inline-flex items-center gap-2">
          <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
          <Button variant="danger" onClick={() => { setToDelete(r); setConfirmOpen(true) }}>Delete</Button>
        </div>
      )} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Template' : 'Add Template'} footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={save}>{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      }>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Name *</label>
            <Input value={String(form.name ?? '')} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Order</label>
            <Input type="number" value={form.stage_order === null || form.stage_order === undefined ? '' : String(form.stage_order)} onChange={(e) => setForm((p) => ({ ...p, stage_order: e.target.value }))} />
          </div>
          <div className="sm:col-span-3">
            <label className="text-xs text-slate-400">Default Life (days)</label>
            <Input type="number" value={form.default_life_days === null || form.default_life_days === undefined ? '' : String(form.default_life_days)} onChange={(e) => setForm((p) => ({ ...p, default_life_days: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} title="Delete template" message="Delete this template? It may fail if referenced by system_filters." confirmText="Delete" onConfirm={removeConfirmed} onClose={() => setConfirmOpen(false)} />
    </div>
  )
}
