import Link from 'next/link'

export function Hero() {
  return (
    <section className="section bg-gradient-to-r from-brand/10 via-white to-brand/10">
      <div className="container grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">Just Keep Hydrated</p>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Holistic water treatment for every industry</h1>
          <p className="text-lg text-slate-700">
            HydroLab designs, builds, and maintains resilient water systems across Myanmar—from residential drinking water to
            mission-critical industrial and healthcare applications.
          </p>
          <div className="flex gap-3">
            <Link className="rounded bg-brand-dark px-4 py-2 text-white shadow" href="/contact">
              Request Site Survey
            </Link>
            <Link className="rounded border border-brand-dark px-4 py-2 text-brand-dark" href="/projects">
              View Projects
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Industries we serve</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
            {['Residential','Commercial','Industrial','F&B','Healthcare/Lab','Municipal/Community','Desalination','Training','Consultation'].map((item) => (
              <li key={item} className="rounded border border-slate-200 px-3 py-2">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
