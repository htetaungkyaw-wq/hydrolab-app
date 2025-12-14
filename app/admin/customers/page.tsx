import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function CustomersPage() {
  const supabase = createSupabaseServerClient()
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, phone, email, address')
    .order('name', { ascending: true })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        {customers && customers.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Contact</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {customer.phone ?? '—'}
                    <br />
                    {customer.email ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{customer.address ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-slate-600">No customers found.</p>
        )}
      </div>
    </div>
  )
}
