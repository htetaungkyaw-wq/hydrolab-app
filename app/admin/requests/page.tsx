import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Database } from '@/types/supabase'

export default async function RequestsPage() {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return <p className="text-sm text-slate-600">Unable to load requests.</p>
  }
  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, phone, category, message, created_at')
    .order('created_at', { ascending: false })
    .returns<Database['public']['Tables']['leads']['Row'][]>()
  const safeLeads = leads ?? []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Site Survey Requests</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        {safeLeads.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Contact</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Message</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{lead.name ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{lead.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{lead.category ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{lead.message ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-slate-600">No site survey requests found.</p>
        )}
      </div>
    </div>
  )
}
