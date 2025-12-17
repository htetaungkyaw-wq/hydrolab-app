import { AdminSignOutButton } from './AdminSignOutButton'

export function AdminTopbar({
  title,
  searchSlot,
}: {
  title?: string
  searchSlot?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-slate-100 truncate">
            {title ?? 'Admin'}
          </h1>
        </div>
        {searchSlot ? <div className="hidden md:block">{searchSlot}</div> : null}
        <AdminSignOutButton />
      </div>
    </header>
  )
}
