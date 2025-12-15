import Link from 'next/link'

const contactInfo = [
  { label: 'Phone', value: '+95 9 250 000 465 / +95 9 795 289 705' },
  { label: 'Offices', value: 'Insein Township & Mayangone Township, Yangon' },
  { label: 'Email', value: 'hello@hydrolab.example.com' },
]

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-[#0f172a] py-16 text-slate-100">
      <div className="container max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Contact Engineering</p>
          <h1 className="text-4xl font-semibold text-white">Request a Site Conversation</h1>
          <p className="max-w-2xl text-slate-200/80">
            Tell us about your water reliability goals. Our engineering team will schedule a survey and outline the
            fastest path to production-ready treatment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Reach us directly</h2>
            <ul className="space-y-3 text-sm text-slate-100/80">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#38bdf8]">{item.label}</span>
                  <span className="font-medium text-white/90">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Prefer the portal?</h2>
            <p className="mt-2 text-sm text-slate-100/80">
              Portal users can submit a service ticket or request an upgrade directly from their dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/portal"
                className="rounded-full bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-slate-950 shadow-md transition hover:-translate-y-0.5"
              >
                Go to Portal
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-[#38bdf8] px-5 py-3 text-sm font-semibold text-[#38bdf8] transition hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
              >
                See Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
