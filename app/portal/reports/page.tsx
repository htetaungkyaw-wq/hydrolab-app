import Link from 'next/link'

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
      <p className="text-slate-700">Download a PDF snapshot of your system including filters and maintenance logs.</p>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">Demo system</p>
        <Link className="text-brand-dark underline" href="/api/reports/system/sys-1">
          Download PDF
        </Link>
      </div>
    </div>
  )
}
