import { Hero } from '@/components/hero'
import { projects, products, clients } from '@/lib/content'

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="section">
        <div className="container grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Turnkey & custom water treatment</h2>
            <p className="text-slate-700">
              Mark Two Seven Co., Ltd. builds on more than 20 years of TAC Water Engineering expertise. We design reliable, long-life
              water plants and bespoke process water lines. Venus Water (Myanmar) Co., Ltd. distributes VENUS RO nationwide and
              advocates for water knowledge alongside medical practitioners and water treatment experts.
            </p>
          </div>
          <div className="rounded-lg border border-brand/30 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-brand-dark">Promise</p>
            <p className="text-slate-700">High-availability designs, local support, and transparent lifecycle monitoring.</p>
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container space-y-6">
          <h3 className="text-2xl font-semibold">Recent Projects</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <div key={project.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <h4 className="font-semibold text-slate-900">{project.title}</h4>
                <p className="text-sm text-slate-700">{project.description}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-brand-dark">{project.flow_rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container space-y-4">
          <h3 className="text-2xl font-semibold">Signature Products</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="font-semibold text-slate-900">{product.title}</h4>
                <p className="text-sm text-slate-700">{product.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container space-y-4">
          <h3 className="text-2xl font-semibold">Trusted By</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {clients.map((client) => (
              <div key={client} className="rounded border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm font-semibold">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
