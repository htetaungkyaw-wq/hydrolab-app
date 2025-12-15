import Link from 'next/link'

export function CtaBanner() {
  return (
    <section className="section bg-[#0f172a]">
      <div className="container">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] p-[1px] shadow-2xl">
          <div className="flex flex-col gap-6 rounded-3xl bg-slate-950/80 px-8 py-10 text-slate-100 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold sm:text-3xl">Ready for always-on water?</h3>
              <p className="text-sm text-slate-100/80">
                Move faster with a partner who designs, deploys, and sustains mission-critical treatment systems.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/portal"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-md transition hover:-translate-y-0.5"
              >
                Go to Portal
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white"
              >
                Contact Engineering
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
