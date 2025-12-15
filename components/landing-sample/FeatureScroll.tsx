const features = [
  {
    title: '20+ Years',
    detail: 'Designing bespoke treatment trains backed by decades of field data.',
  },
  {
    title: '24/7 Response',
    detail: 'Monitoring, maintenance, and rapid on-site support—day or night.',
  },
  {
    title: 'Nationwide',
    detail: 'Deploying mobile teams and spares across every major city.',
  },
  {
    title: 'Modular',
    detail: 'Expandable skids and cartridges that scale without shutdowns.',
  },
]

export function FeatureScroll() {
  return (
    <section className="relative z-10 -mt-24 bg-gradient-to-b from-transparent to-[#0f172a] pb-8">
      <div className="container">
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex min-w-full gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="min-w-[220px] flex-1 rounded-2xl border border-[#38bdf8]/20 bg-slate-800/50 p-5 text-white shadow-xl backdrop-blur"
              >
                <div className="text-sm font-semibold uppercase tracking-widest text-[#38bdf8]">
                  {feature.title}
                </div>
                <p className="mt-3 text-sm text-slate-100/80">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
