import { projects } from '@/lib/content'

export default function ProjectsPage() {
  return (
    <section className="section">
      <div className="container space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <div key={project.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">{project.title}</h3>
              <p className="text-sm text-slate-700">{project.description}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-brand-dark">{project.flow_rate}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
