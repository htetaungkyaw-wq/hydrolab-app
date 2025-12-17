'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { DataTable, Column } from '@/components/admin/DataTable'
import { Button } from '@/components/admin/ui/button'
import { Modal } from '@/components/admin/ui/modal'
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import { useToast } from '@/components/admin/ui/toast'
import type { Database } from '@/types/supabase'

type Customer = Database['public']['Tables']['customers']['Row']

const emptyCustomer: Partial<Customer> = {
  name: '',
  phone: '',
  email: '',
  address: '',
  township: '',
}

export default function CustomersAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<Partial<Customer>>(emptyCustomer)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Customer | null>(null)

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    if (error) toast({ type: 'error', message: error.message })
    setRows((data ?? []) as Customer[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone', render: (r) => r.phone ?? '-' },
    { key: 'email', header: 'Email', render: (r) => r.email ?? '-' },
    { key: 'township', header: 'Township', render: (r) => r.township ?? '-' },
    { key: 'created_at', header: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleString() : '-') },
  ]

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyCustomer })
    setModalOpen(true)
  }

  function openEdit(row: Customer) {
    setEditing(row)
    setForm({
      name: row.name ?? '',
      phone: row.phone ?? '',
      email: row.email ?? '',
      address: row.address ?? '',
      township: row.township ?? '',
    })
    setModalOpen(true)
  }

  async function save() {
    if (!supabase) return
    if (!form.name || !String(form.name).trim()) {
      toast({ type: 'error', message: 'Name is required.' })
      return
    }
    const payload = {
      name: String(form.name).trim(),
      phone: form.phone ? String(form.phone).trim() : null,
      email: form.email ? String(form.email).trim() : null,
      address: form.address ? String(form.address).trim() : null,
      township: form.township ? String(form.township).trim() : null,
    }

    if (editing) {
      const { error } = await supabase.from('customers').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Customer updated.' })
    } else {
      const { error } = await supabase.from('customers').insert(payload)
      if (error) toast({ type: 'error', message: error.message })
      else toast({ type: 'success', message: 'Customer created.' })
    }
    setModalOpen(false)
    await refresh()
  }

  async function removeConfirmed() {
    if (!supabase || !toDelete) return
    const { error } = await supabase.from('customers').delete().eq('id', toDelete.id)
    if (error) toast({ type: 'error', message: error.message })
    else toast({ type: 'success', message: 'Customer deleted.' })
    setToDelete(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Customers</h2>
          <p className="text-xs text-slate-400">Create, edit, and manage customers.</p>
        </div>
        <Button onClick={openCreate}>Add Customer</Button>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        isLoading={loading}
        searchKeys={['name', 'phone', 'email', 'township']}
        actions={(r) => (
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
        title={editing ? 'Edit Customer' : 'Add Customer'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Name *</label>
            <Input value={String(form.name ?? '')} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Phone</label>
            <Input value={String(form.phone ?? '')} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <Input value={String(form.email ?? '')} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Township</label>
            <Input value={String(form.township ?? '')} onChange={(e) => setForm((p) => ({ ...p, township: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400">Address</label>
            <Textarea rows={3} value={String(form.address ?? '')} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete customer"
        message={toDelete ? `Delete ${toDelete.name}? This will also delete related systems (if cascade).` : 'Delete this customer?'}
        confirmText="Delete"
        onConfirm={removeConfirmed}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}
