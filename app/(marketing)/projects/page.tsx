import { projects } from '@/lib/content'

export default function ProjectsPage() {
  return (
    <section className="min-h-screen bg-[#0f172a] py-16 text-slate-100">
      <div className="container space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Projects</p>
          <h1 className="text-4xl font-semibold text-white">Proven deployments across industries</h1>
          <p className="max-w-3xl text-slate-200/80">
            From hospitality and healthcare to heavy industry, HydroLab designs resilient treatment trains that keep
            critical operations running.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-[#38bdf8]/50 hover:shadow-cyan-500/10 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">{project.flow_rate}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-100/80">{project.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
