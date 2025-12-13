import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type Filter = {
  id: string
  name: string
  last_changed_at: string
  default_life_days: number
  life_days_override?: number | null
}

type System = {
  id: string
  name: string
  location: string
  installed_at: string
  filters: Filter[]
}

const systems: System[] = [
  {
    id: 'sys-1',
    name: 'Commercial RO Drinking Water Factory',
    location: 'Yangon',
    installed_at: '2023-06-01',
    filters: [
      { id: 'f1', name: 'Multimedia', last_changed_at: '2024-05-01', default_life_days: 180 },
      { id: 'f2', name: 'Softener', last_changed_at: '2024-03-15', default_life_days: 365 },
      { id: 'f3', name: 'RO Membrane', last_changed_at: '2024-01-10', default_life_days: 365, life_days_override: 300 },
    ],
  },
]

type FilterStatus = 'OK' | 'DUE_SOON' | 'OVERDUE'

function getFilterStatus(filter: Filter): { status: FilterStatus; daysLeft: number } {
  const today = new Date()
  const lastChanged = new Date(filter.last_changed_at)
  const life = filter.life_days_override ?? filter.default_life_days
  const daysUsed = Math.floor((today.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24))
  const daysLeft = life - daysUsed
  let status: FilterStatus = 'OK'
  if (daysLeft <= 0) status = 'OVERDUE'
  else if (daysLeft <= 14) status = 'DUE_SOON'
  return { status, daysLeft }
}

export default function PortalOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Systems</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {systems.map((system) => (
          <div key={system.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{system.name}</h3>
                <p className="text-sm text-slate-700">{system.location}</p>
                <p className="text-xs text-slate-500">Installed {formatDate(system.installed_at)}</p>
              </div>
              <Link className="text-sm font-medium text-brand-dark" href={`/portal/systems/${system.id}`}>
                View details
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {system.filters.map((filter) => {
                const { status, daysLeft } = getFilterStatus(filter)
                return (
                  <div key={filter.id} className="flex items-center justify-between rounded border border-slate-100 px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-900">{filter.name}</p>
                      <p className="text-xs text-slate-500">Last changed {formatDate(filter.last_changed_at)}</p>
                    </div>
                    <div className="text-right text-xs font-semibold">
                      <p className={status === 'OVERDUE' ? 'text-red-600' : status === 'DUE_SOON' ? 'text-amber-600' : 'text-green-700'}>
                        {status.replace('_', ' ')}
                      </p>
                      <p className="text-slate-700">{daysLeft} days left</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
