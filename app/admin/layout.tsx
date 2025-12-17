import { AdminShell } from '@/components/admin/AdminShell'
import { AdminProviders } from '@/components/admin/AdminProviders'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <AdminShell title="HydroLab Admin">{children}</AdminShell>
    </AdminProviders>
  )
}
