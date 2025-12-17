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

type Media = Database['public']['Tables']['media_assets']['Row']
type Kind = 'project' | 'product' | 'client_logo'

const empty: Partial<Media> = { kind: 'project', title: '', bucket: '', path: '' }

export default function MediaAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Media | null>(null)
  const [form, setForm] = useState<Partial<Media>>(empty)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Media | null>(null)

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false })
    if (error) toast({ type: 'error', message: error.message })
    setRows((data ?? []) as Media[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<Media>[] = [
    { key: 'kind', header: 'Kind' },
    { key: 'title', header: 'Title', render: (r) => r.title ?? '-' },
    { key: 'bucket', header: 'Bucket', render: (r) => r.bucket ?? '-' },
    { key: 'path', header: 'Path', render: (r) => r.path ?? '-' },
    { key: 'created_at', header: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleString() : '-') },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setModalOpen(true)
  }
  function openEdit(r: Media) {
    setEditing(r)
    setForm({ kind: r.kind as any, title: r.title ?? '', bucket: r.bucket ?? '', path: r.path ?? '' })
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    const payload = {
      kind: String(form.kind ?? 'project') as Kind,
      title: form.title ? String(form.title).trim() : null,
      bucket: form.bucket ? String(form.bucket).trim() : null,
      path: form.path ? String(form.path).trim() : null,
    }
    if (editing) {
      const { error } = await supabase.from('media_assets').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Media updated.' })
    } else {
      const { error } = await supabase.from('media_assets').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Media created.' })
    }
    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('media_assets').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Media deleted.' })
    setToDelete(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Media</h2>
          <p className="text-xs text-slate-400">Manage media asset metadata (bucket/path).</p>
        </div>
        <Button onClick={openCreate}>Add Media</Button>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        isLoading={loading}
        searchKeys={['kind', 'title', 'bucket', 'path']}
        actions={(r) => (
          <div className="inline-flex items-center gap-2">
            <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
            <Button variant="danger" onClick={() => { setToDelete(r); setConfirmOpen(true) }}>Delete</Button>
          </div>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Media Asset' : 'Add Media Asset'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Kind</label>
            <Select value={String(form.kind ?? 'project')} onChange={(e) => setForm((p) => ({ ...p, kind: e.target.value as any }))}>
              <option value="project">project</option>
              <option value="product">product</option>
              <option value="client_logo">client_logo</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Title</label>
            <Input value={String(form.title ?? '')} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Bucket</label>
            <Input value={String(form.bucket ?? '')} onChange={(e) => setForm((p) => ({ ...p, bucket: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Path</label>
            <Input value={String(form.path ?? '')} onChange={(e) => setForm((p) => ({ ...p, path: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete media asset"
        message="Delete this media asset? If attached to projects it may fail due to FK constraints."
        confirmText="Delete"
        onConfirm={removeConfirmed}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}
