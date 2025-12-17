import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'

export type AdminNavItem = { href: string; label: string }

const NAV: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/systems', label: 'Systems' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/tickets', label: 'Tickets' },
  { href: '/admin/logs', label: 'Logs' },
  { href: '/admin/filter-templates', label: 'Filter Templates' },
  { href: '/admin/system-filters', label: 'System Filters' },
  { href: '/admin/requests', label: 'Leads' },
]

export function AdminShell({
  children,
  title,
  searchSlot,
}: {
  children: React.ReactNode
  title?: string
  searchSlot?: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex">
        <AdminSidebar items={NAV} />
        <div className="flex-1 min-w-0">
          <AdminTopbar title={title} searchSlot={searchSlot} />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
