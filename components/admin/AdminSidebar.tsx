import Link from 'next/link'
import { AdminNavItem } from './AdminShell'

export function AdminSidebar({ items }: { items: AdminNavItem[] }) {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-800 lg:bg-slate-950/60 lg:backdrop-blur">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="text-sm font-semibold tracking-wide text-slate-200">HydroLab</div>
        <div className="text-xs text-slate-400">Admin Console</div>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 hover:text-white"
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-slate-800 text-xs text-slate-500">
        RLS-protected • Supabase
      </div>
    </aside>
  )
}
