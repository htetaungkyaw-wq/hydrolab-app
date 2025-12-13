import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

const systems = [
  {
    id: 'sys-1',
    name: 'Commercial RO Drinking Water Factory',
    location: 'Yangon',
    installed_at: '2023-06-01',
    alerts: ['Check RO membrane pressure differential', 'Schedule softener resin inspection'],
    maintenance: [
      { date: '2024-05-01', summary: 'Replaced multimedia media and sanitized pre-treatment' },
      { date: '2024-03-10', summary: 'Changed cartridge filters and calibrated flowmeters' },
    ],
  },
]

export default function SystemDetail({ params }: { params: { id: string } }) {
  const system = systems.find((s) => s.id === params.id)
  if (!system) return notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{system.name}</h1>
        <p className="text-slate-700">{system.location}</p>
        <p className="text-xs text-slate-500">Installed {formatDate(system.installed_at)}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Alerts</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {system.alerts.map((alert) => (
              <li key={alert} className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                {alert}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Maintenance</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {system.maintenance.map((log) => (
              <li key={log.date} className="rounded border border-slate-100 px-3 py-2">
                <p className="font-medium text-slate-900">{formatDate(log.date)}</p>
                <p>{log.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
