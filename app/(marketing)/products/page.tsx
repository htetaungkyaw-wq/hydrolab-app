import { products } from '@/lib/content'

export default function ProductsPage() {
  return (
    <section className="section">
      <div className="container space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <p className="text-slate-700">Standardized trains you can deploy quickly or customize.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <div key={product.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">{product.title}</h3>
              <p className="text-sm text-slate-700">{product.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
