import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Database } from '@/types/supabase'

type FilterStatus = 'OK' | 'DUE_SOON' | 'OVERDUE'

type SystemWithFilters = Database['public']['Tables']['systems']['Row'] & {
  system_filters: (Database['public']['Tables']['system_filters']['Row'] & {
    filter_templates: Database['public']['Tables']['filter_templates']['Row'] | null
  })[]
}

function getFilterStatus(filter: SystemWithFilters['system_filters'][number]): {
  status: FilterStatus
  daysLeft: number
} {
  const life =
    filter.life_days_override ?? filter.filter_templates?.default_life_days ?? 0
  if (!filter.last_changed_at || !life) {
    return { status: 'OVERDUE', daysLeft: 0 }
  }

  const today = new Date()
  const lastChanged = new Date(filter.last_changed_at)
  const daysUsed = Math.floor(
    (today.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24)
  )
  const daysLeft = life - daysUsed

  let status: FilterStatus = 'OK'
  if (daysLeft <= 0) status = 'OVERDUE'
  else if (daysLeft <= 14) status = 'DUE_SOON'

  return { status, daysLeft: Math.max(daysLeft, 0) }
}

export default async function PortalOverview() {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return <p className="text-sm text-slate-600">Unable to load portal data.</p>
  }
  const { data: systems, error } = await supabase
    .from('systems')
    .select(
      'id, system_type, location, installed_at, system_filters(id, life_days_override, last_changed_at, filter_templates(name, default_life_days))'
    )
    .order('created_at', { ascending: false })
    .returns<SystemWithFilters[]>()

  if (error) {
    return (
      <p className="text-sm text-red-700">
        Unable to load systems at this time: {error.message}
      </p>
    )
  }
  const safeSystems = systems ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Systems</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {safeSystems.length > 0 ? (
          safeSystems.map((system) => (
            <div
              key={system.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {system.system_type ?? 'System'}
                  </h3>
                  <p className="text-sm text-slate-700">{system.location ?? '—'}</p>
                  <p className="text-xs text-slate-500">
                    Installed {formatDate(system.installed_at)}
                  </p>
                </div>
                <Link
                  className="text-sm font-medium text-brand-dark"
                  href={`/portal/systems/${system.id}`}
                >
                  View details
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {system.system_filters?.length ? (
                  system.system_filters.map((filter) => {
                    const { status, daysLeft } = getFilterStatus(filter)
                    const colorClass =
                      status === 'OVERDUE'
                        ? 'text-red-600'
                        : status === 'DUE_SOON'
                          ? 'text-amber-600'
                          : 'text-green-700'

                    return (
                      <div
                        key={filter.id}
                        className="flex items-center justify-between rounded border border-slate-100 px-3 py-2"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {filter.filter_templates?.name ?? 'Filter'}
                          </p>
                          <p className="text-xs text-slate-500">
                            Last changed {formatDate(filter.last_changed_at)}
                          </p>
                        </div>
                        <div className="text-right text-xs font-semibold">
                          <p className={colorClass}>{status.replace('_', ' ')}</p>
                          <p className="text-slate-700">{daysLeft} days left</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-slate-600">No filters found.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No systems available.</p>
        )}
      </div>
    </div>
  )
}
