export function Footer() {
  return (
    <footer className="border-t bg-white py-8 text-sm text-slate-600">
      <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} HydroLab. Just Keep Hydrated.</p>
        <p className="text-slate-500">Offices: Insein Township & Mayangone Township, Yangon · 09 250 000 465 / 09 795 289 705</p>
      </div>
    </footer>
  )
}
