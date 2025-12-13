import { clients } from '@/lib/content'

export default function ClientsPage() {
  return (
    <section className="section">
      <div className="container space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {clients.map((client) => (
            <div key={client} className="rounded border border-slate-200 bg-white px-3 py-4 text-center text-sm font-semibold">
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
