import { systemsMock } from '@/lib/mock'
import { formatDate } from '@/lib/utils'

export default function SystemsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Systems</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
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
            {systemsMock.map((system) => (
              <tr key={system.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{system.customer}</td>
                <td className="px-4 py-3 text-slate-700">{system.type}</td>
                <td className="px-4 py-3 text-slate-700">{system.flowRate}</td>
                <td className="px-4 py-3 text-slate-700">{system.location}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(system.installedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
