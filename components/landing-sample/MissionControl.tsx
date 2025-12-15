const checkItems = [
  'Continuous remote diagnostics with on-call engineers.',
  'Redundant trains and bypass options to prevent outages.',
  'Documented SOPs for every site and every cartridge.',
  'Performance reports that translate to uptime and savings.',
]

export function MissionControl() {
  return (
    <section className="section bg-[#0f172a] text-slate-100">
      <div className="container">
        <div className="rounded-2xl border border-white/5 bg-gray-900/50 p-8 shadow-2xl backdrop-blur">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Mission Control</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Reliability you can measure</h2>
            <p className="max-w-3xl text-slate-200/80">
              Our engineers track every site through a central dashboard—optimizing flow, regeneration, and
              consumables so your teams stay focused on operations.
            </p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {checkItems.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#0ea5e9] text-sm font-semibold text-slate-950">
                    •
                  </span>
                  <span className="text-sm text-slate-100/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
