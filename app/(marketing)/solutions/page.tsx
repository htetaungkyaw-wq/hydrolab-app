const solutions = [
  'Residential drinking water and polishing',
  'Commercial RO drinking water factories',
  'Industrial boiler feed and process water',
  'F&B quality management and CIP support',
  'Healthcare and laboratory-grade treatment',
  'Municipal and community-scale safe water',
  'Desalination and brackish water recovery',
  'Training, consultation, and lifecycle planning',
]

export default function SolutionsPage() {
  return (
    <section className="section">
      <div className="container space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Solutions</h1>
        <p className="text-slate-700">Holistic engineering, operations training, and data-backed maintenance.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {solutions.map((solution) => (
            <div key={solution} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-slate-900">{solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
