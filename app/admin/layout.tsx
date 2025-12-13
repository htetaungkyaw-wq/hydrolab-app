import Link from 'next/link'

const adminLinks = [
  { href: '/admin', label: 'KPIs' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/systems', label: 'Systems' },
  { href: '/admin/maintenance', label: 'Maintenance' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/requests', label: 'Requests' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-bold text-brand-dark">HydroLab Admin</div>
          <nav className="flex gap-4 text-sm font-medium text-slate-700">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand-dark">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
