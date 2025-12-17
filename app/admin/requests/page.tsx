'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { DataTable, Column } from '@/components/admin/DataTable'
import { useToast } from '@/components/admin/ui/toast'
import type { Database } from '@/types/supabase'

type Lead = Database['public']['Tables']['leads']['Row']

export default function LeadsAdminPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [rows, setRows] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    if (!supabase) {
      toast({ type: 'error', message: 'Missing Supabase env vars.' })
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (error) toast({ type: 'error', message: error.message })
    setRows((data ?? []) as Lead[])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: Column<Lead>[] = [
    { key: 'created_at', header: 'Date', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleString() : '-') },
    { key: 'name', header: 'Name', render: (r) => r.name ?? '-' },
    { key: 'phone', header: 'Phone', render: (r) => r.phone ?? '-' },
    { key: 'location', header: 'Location', render: (r) => r.location ?? '-' },
    { key: 'category', header: 'Category', render: (r) => r.category ?? '-' },
    { key: 'message', header: 'Message', render: (r) => (r.message ? <span className="line-clamp-2">{r.message}</span> : '-') },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-100">Leads</h2>
        <p className="text-xs text-slate-400">Read-only inbox from public lead form.</p>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        isLoading={loading}
        searchKeys={['name', 'phone', 'email', 'location', 'category', 'message']}
      />
    </div>
  )
}
