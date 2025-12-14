"use client"

import { useEffect, useState } from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Counts = {
  customers: number
  systems: number
  openTickets: number
  filtersDue: number
}

type FilterRecord = Database['public']['Tables']['system_filters']['Row'] & {
  filter_templates: Database['public']['Tables']['filter_templates']['Row'] | null
}

export default function AdminHome() {
  const [counts, setCounts] = useState<Counts>({
    customers: 0,
    systems: 0,
    openTickets: 0,
    filtersDue: 0,
  })
  const [chartData, setChartData] = useState<{ name: string; installs: number; tickets: number }[]>([
    { name: 'Totals', installs: 0, tickets: 0 },
  ])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    if (!supabase) {
      console.warn('Supabase client is not configured for admin dashboard.')
      return
    }

    const fetchCounts = async () => {
      const [{ count: customers }, { count: systems }, { count: openTickets }] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('systems').select('*', { count: 'exact', head: true }),
        supabase
          .from('maintenance_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open'),
      ])

      const { data: filters } = await supabase
        .from('system_filters')
        .select('id, last_changed_at, life_days_override, filter_templates(default_life_days)')

      const today = new Date()
      const filtersDue =
        filters?.filter((filter: FilterRecord) => {
          const life =
            filter.life_days_override ?? filter.filter_templates?.default_life_days ?? 0
          if (!filter.last_changed_at || !life) return false

          const lastChanged = new Date(filter.last_changed_at)
          const daysUsed = Math.floor(
            (today.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24)
          )
          const daysLeft = life - daysUsed
          return daysLeft <= 14
        }).length ?? 0

      setCounts({
        customers: customers ?? 0,
        systems: systems ?? 0,
        openTickets: openTickets ?? 0,
        filtersDue,
      })
      setChartData([{ name: 'Totals', installs: systems ?? 0, tickets: openTickets ?? 0 }])
    }

    fetchCounts()
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Installs & Tickets</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="installs" fill="#0ea5e9" />
              <Bar dataKey="tickets" fill="#0369a1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">At a glance</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>Active customers: {counts.customers}</li>
          <li>Systems under AMC: {counts.systems}</li>
          <li>Open maintenance tickets: {counts.openTickets}</li>
          <li>Filters due soon: {counts.filtersDue}</li>
        </ul>
      </div>
    </div>
  )
}
