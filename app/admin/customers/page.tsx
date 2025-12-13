import { customersMock } from '@/lib/mock'

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Contact</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customersMock.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                <td className="px-4 py-3 text-slate-700">
                  {customer.phone}
                  <br />
                  {customer.email}
                </td>
                <td className="px-4 py-3 text-slate-700">{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
