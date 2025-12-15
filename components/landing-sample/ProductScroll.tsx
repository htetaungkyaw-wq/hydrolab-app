import { products, type Product } from '@/lib/content'

export function ProductScroll() {
  return (
    <section className="section bg-[#0f172a] text-slate-100">
      <div className="container space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">Products</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Built for harsh conditions</h2>
          <p className="max-w-3xl text-slate-200/80">
            Pre-engineered systems that install quickly, perform reliably, and adapt to changing loads without
            long shutdowns.
          </p>
        </div>
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex min-w-full gap-4">
            {products.map((product: Product) => {
              const label = product.capacity ?? product.range ?? product.category ?? 'HydroLab System'
              return (
                <article
                  key={product.title}
                  className="min-w-[260px] flex-1 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">{label}</div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{product.title}</h3>
                  <p className="mt-2 text-sm text-slate-100/80">{product.detail}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
