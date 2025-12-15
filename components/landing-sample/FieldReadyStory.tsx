const steps = [
  {
    title: 'Assess',
    detail: 'Rapid site survey, water profiling, and risk scoring for every asset.',
  },
  {
    title: 'Deploy',
    detail: 'Prefabricated modules and trained crews deliver production-ready systems fast.',
  },
  {
    title: 'Sustain',
    detail: 'Remote monitoring, predictive maintenance, and on-demand spares keep flows steady.',
  },
]

export function FieldReadyStory() {
  return (
    <section className="section bg-[#0f172a] text-slate-100">
      <div className="container space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Field-Ready Story</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">From survey to uptime</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-lg backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0ea5e9] text-lg font-bold text-slate-950">
                {index + 1}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-100/80">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
