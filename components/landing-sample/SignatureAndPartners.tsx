import { clients } from '@/lib/content'

const signatureBlocks = [
  {
    title: 'UF Systems',
    detail: 'High-throughput ultrafiltration trains that remove turbidity and organics while protecting RO membranes.',
  },
  {
    title: 'IR Series',
    detail: 'Tiered iron removal systems (IR1/IR2/IR3) tailored to dissolved iron load, flow rate, and space.',
  },
]

export function SignatureAndPartners() {
  return (
    <section className="section bg-[#0f172a] text-slate-100">
      <div className="container space-y-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Signature Products</p>
          <div className="grid gap-4 md:grid-cols-2">
            {signatureBlocks.map((block) => (
              <div key={block.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
                <h3 className="text-2xl font-semibold text-white">{block.title}</h3>
                <p className="mt-2 text-sm text-slate-100/80">{block.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Trusted Partners</p>
          <div className="flex flex-wrap gap-3">
            {clients.map((client) => (
              <div
                key={client}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0ea5e9]/20 text-[#38bdf8]">
                  <span>{client.charAt(0)}</span>
                </div>
                <span>{client}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
