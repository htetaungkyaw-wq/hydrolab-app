import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Database } from '@/types/supabase'

type TicketWithRelations = Database['public']['Tables']['maintenance_tickets']['Row'] & {
  customers: Pick<Database['public']['Tables']['customers']['Row'], 'name'> | null
  systems: Pick<Database['public']['Tables']['systems']['Row'], 'system_type'> | null
}

export default async function MaintenancePage() {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return <p className="text-sm text-slate-600">Unable to load maintenance tickets.</p>
  }
  const { data: tickets } = await supabase
    .from('maintenance_tickets')
    .select('id, subject, status, updated_at, customers(name), systems(system_type)')
    .order('updated_at', { ascending: false })
    .returns<TicketWithRelations[]>()
  const safeTickets = tickets ?? []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Maintenance Tickets</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        {safeTickets.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Subject</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">System</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{ticket.subject ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{ticket.customers?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{ticket.systems?.system_type ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{ticket.status ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(ticket.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-slate-600">No maintenance tickets found.</p>
        )}
      </div>
    </div>
  )
}
