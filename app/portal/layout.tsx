import Link from 'next/link'

const portalLinks = [
  { href: '/portal', label: 'Overview' },
  { href: '/portal/service-request', label: 'Service Request' },
  { href: '/portal/reports', label: 'Reports' },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-bold text-brand-dark">HydroLab Portal</div>
          <nav className="flex gap-4 text-sm font-medium text-slate-700">
            {portalLinks.map((link) => (
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
