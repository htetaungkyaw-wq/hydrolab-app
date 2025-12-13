import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function SystemsPage() {
  const supabase = createSupabaseServerClient()
  const { data: systems } = await supabase
    .from('systems')
    .select('id, system_type, flow_rate_lph, location, installed_at, customers(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Systems</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        {systems && systems.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Flow Rate</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Installed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {systems.map((system) => (
                <tr key={system.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {system.customers?.name ?? 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{system.system_type ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {system.flow_rate_lph ? `${system.flow_rate_lph} LPH` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{system.location ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(system.installed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-slate-600">No systems found.</p>
        )}
      </div>
    </div>
  )
}
