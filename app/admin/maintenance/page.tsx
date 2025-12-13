import { ticketsMock } from '@/lib/mock'
import { formatDate } from '@/lib/utils'

export default function MaintenancePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Maintenance Tickets</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
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
            {ticketsMock.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{ticket.subject}</td>
                <td className="px-4 py-3 text-slate-700">{ticket.customer}</td>
                <td className="px-4 py-3 text-slate-700">{ticket.system}</td>
                <td className="px-4 py-3 text-slate-700">{ticket.status}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(ticket.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
