import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Q1', installs: 8, tickets: 5 },
  { name: 'Q2', installs: 12, tickets: 7 },
  { name: 'Q3', installs: 15, tickets: 6 },
  { name: 'Q4', installs: 10, tickets: 4 },
]

export default function AdminHome() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Quarterly Installs & Tickets</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
          <li>Active customers: 42</li>
          <li>Systems under AMC: 65</li>
          <li>Open maintenance tickets: 6</li>
          <li>Filters due soon: 12</li>
        </ul>
      </div>
    </div>
  )
}
