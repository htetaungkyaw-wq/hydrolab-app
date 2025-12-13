import { leadsMock } from '@/lib/mock-leads'
import { formatDate } from '@/lib/utils'

export default function RequestsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Site Survey Requests</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
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
            {leadsMock.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                <td className="px-4 py-3 text-slate-700">{lead.phone}</td>
                <td className="px-4 py-3 text-slate-700">{lead.category}</td>
                <td className="px-4 py-3 text-slate-700">{lead.message}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
