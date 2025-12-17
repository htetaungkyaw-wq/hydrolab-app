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

type Project = Database['public']['Tables']['projects']['Row']
type Media = Database['public']['Tables']['media_assets']['Row']
type ProjectPhoto = Database['public']['Tables']['project_photos']['Row']

const empty: Partial<Project> = { title: '', category: '', description: '', flow_rate_lph: null, solutions: null }

export default function ProjectsAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<Partial<Project>>(empty)
  const [solutionsText, setSolutionsText] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Project | null>(null)

  // photos modal state
  const [photosOpen, setPhotosOpen] = useState(false)
  const [photosProject, setPhotosProject] = useState<Project | null>(null)
  const [projectPhotos, setProjectPhotos] = useState<(ProjectPhoto & { media?: Media | null })[]>([])
  const [availableMedia, setAvailableMedia] = useState<Media[]>([])
  const [attachAssetId, setAttachAssetId] = useState<string>('')

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) toast({ type: 'error', message: error.message })
    setRows((data ?? []) as Project[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<Project>[] = [
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category', render: (r) => r.category ?? '-' },
    { key: 'flow_rate_lph', header: 'Flow (LPH)', render: (r) => (r.flow_rate_lph ?? '-') as any },
    { key: 'created_at', header: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleString() : '-') },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setSolutionsText('')
    setModalOpen(true)
  }
  function openEdit(r: Project) {
    setEditing(r)
    setForm({
      title: r.title ?? '',
      category: r.category ?? '',
      description: r.description ?? '',
      flow_rate_lph: r.flow_rate_lph ?? null,
      solutions: r.solutions ?? null,
    })
    setSolutionsText(r.solutions ? JSON.stringify(r.solutions, null, 2) : '')
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    if (!form.title || !String(form.title).trim()) {
      toast({ type: 'error', message: 'Title is required.' })
      return
    }

    let solutions: any = null
    if (solutionsText.trim()) {
      try {
        solutions = JSON.parse(solutionsText)
      } catch {
        toast({ type: 'error', message: 'Solutions must be valid JSON.' })
        return
      }
    }

    const payload = {
      title: String(form.title).trim(),
      category: form.category ? String(form.category).trim() : null,
      description: form.description ? String(form.description).trim() : null,
      flow_rate_lph:
        form.flow_rate_lph === null || form.flow_rate_lph === undefined || form.flow_rate_lph === ''
          ? null
          : Number(form.flow_rate_lph),
      solutions,
    }

    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Project updated.' })
    } else {
      const { error } = await supabase.from('projects').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Project created.' })
    }

    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('projects').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Project deleted.' })
    setToDelete(null)
    await refresh()
  }

  async function openPhotos(r: Project) {
    if (!supabase) return
    setPhotosProject(r)
    setPhotosOpen(true)
    setAttachAssetId('')

    const [{ data: media, error: mediaErr }, { data: photos, error: photosErr }] = await Promise.all([
      supabase.from('media_assets').select('*').eq('kind', 'project').order('created_at', { ascending: false }),
      supabase.from('project_photos').select('*').eq('project_id', r.id),
    ])
    if (mediaErr) toast({ type: 'error', message: mediaErr.message })
    if (photosErr) toast({ type: 'error', message: photosErr.message })
    setAvailableMedia((media ?? []) as Media[])

    // Build photo list with media metadata
    const photoRows = (photos ?? []) as ProjectPhoto[]
    const mediaMap = new Map<string, Media>()
    for (const m of (media ?? []) as Media[]) mediaMap.set(m.id, m)
    setProjectPhotos(photoRows.map((p) => ({ ...p, media: mediaMap.get(p.asset_id) ?? null })))
  }

  async function attach() {
    if (!supabase || !photosProject || !attachAssetId) return
    const { error } = await supabase.from('project_photos').insert({ project_id: photosProject.id, asset_id: attachAssetId })
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Photo attached.' })
    await openPhotos(photosProject)
  }

  async function detach(photoId: string) {
    if (!supabase || !photosProject) return
    const { error } = await supabase.from('project_photos').delete().eq('id', photoId)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Photo detached.' })
    await openPhotos(photosProject)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Projects</h2>
          <p className="text-xs text-slate-400">Manage public project showcase content.</p>
        </div>
        <Button onClick={openCreate}>Add Project</Button>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        isLoading={loading}
        searchKeys={['title', 'category', 'description']}
        actions={(r) => (
          <div className="inline-flex items-center gap-2">
            <Button variant="ghost" onClick={() => openPhotos(r)}>Photos</Button>
            <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
            <Button variant="danger" onClick={() => { setToDelete(r); setConfirmOpen(true) }}>Delete</Button>
          </div>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Project' : 'Add Project'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Title *</label>
            <Input value={String(form.title ?? '')} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Category</label>
            <Input value={String(form.category ?? '')} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Flow Rate (LPH)</label>
            <Input
              type="number"
              value={form.flow_rate_lph === null || form.flow_rate_lph === undefined ? '' : String(form.flow_rate_lph)}
              onChange={(e) => setForm((p) => ({ ...p, flow_rate_lph: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Description</label>
            <Textarea rows={3} value={String(form.description ?? '')} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Solutions (JSON)</label>
            <Textarea rows={8} value={solutionsText} onChange={(e) => setSolutionsText(e.target.value)} placeholder='Example: [{"stage":"Sediment","detail":"..."}]' />
            <p className="mt-1 text-[11px] text-slate-500">Leave empty for null. Must be valid JSON if provided.</p>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete project"
        message="Delete this project? Related project_photos will also be deleted (cascade)."
        confirmText="Delete"
        onConfirm={removeConfirmed}
        onClose={() => setConfirmOpen(false)}
      />

      <Modal
        open={photosOpen}
        onClose={() => setPhotosOpen(false)}
        title={photosProject ? `Manage Photos: ${photosProject.title}` : 'Manage Photos'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPhotosOpen(false)}>Close</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="text-xs text-slate-400 mb-2">Attach a media asset (kind=project)</div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={attachAssetId} onChange={(e) => setAttachAssetId(e.target.value)}>
                <option value="">Select media…</option>
                {availableMedia.map((m) => (
                  <option key={m.id} value={m.id}>
                    {(m.title ?? 'Untitled')} — {m.bucket ?? ''}/{m.path ?? ''}
                  </option>
                ))}
              </Select>
              <Button onClick={attach} disabled={!attachAssetId}>Attach</Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">Attached photos</div>
            {projectPhotos.length === 0 ? (
              <div className="text-sm text-slate-400">No photos attached yet.</div>
            ) : (
              <div className="space-y-2">
                {projectPhotos.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="min-w-0">
                      <div className="text-sm text-slate-100 truncate">{p.media?.title ?? 'Untitled'}</div>
                      <div className="text-xs text-slate-500 truncate">{p.media?.bucket ?? ''}/{p.media?.path ?? ''}</div>
                    </div>
                    <Button variant="danger" onClick={() => detach(p.id)}>Detach</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
