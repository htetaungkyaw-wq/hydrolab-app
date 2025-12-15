import Link from 'next/link'

const patternSvg = encodeURIComponent(`
<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.05" />
    </linearGradient>
  </defs>
  <rect width="160" height="160" fill="url(#grad)" />
  <g stroke="#38bdf8" stroke-opacity="0.12" stroke-width="1">
    <circle cx="40" cy="40" r="30" fill="none" />
    <circle cx="120" cy="40" r="22" fill="none" />
    <circle cx="80" cy="120" r="36" fill="none" />
    <line x1="10" y1="10" x2="150" y2="150" />
    <line x1="150" y1="10" x2="10" y2="150" />
  </g>
</svg>
`)

export function HeroSample() {
  return (
    <section
      className="relative isolate min-h-screen overflow-hidden bg-[#0f172a]"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(2, 132, 199, 0.15)), url("data:image/svg+xml,${patternSvg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-950/60" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-[#0f172a]/70 to-[#0f172a]" aria-hidden />
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container max-w-5xl space-y-6 py-24 text-center sm:space-y-8">
          <div className="inline-flex items-center justify-center rounded-full border border-cyan-200/30 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-100/80">
            Mission Critical Water Systems
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            Resilient treatment built for the field. Engineered for the future.
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-100/80 sm:text-xl">
            HydroLab deploys rugged, modular water solutions for facilities that cannot afford downtime.
            We pair on-the-ground response teams with cloud-driven monitoring to keep every site online.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-[#38bdf8] px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:translate-y-[-1px] hover:bg-[#0ea5e9]"
            >
              Customer Login
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-[#38bdf8] px-6 py-3 text-base font-semibold text-[#38bdf8] transition hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
