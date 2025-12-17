'use client'

import React, { useMemo, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export type Column<T> = {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
}

export function DataTable<T extends Record<string, any>>({
  title,
  rows,
  columns,
  isLoading,
  searchKeys = [],
  actions,
}: {
  title?: string
  rows: T[]
  columns: Column<T>[]
  isLoading?: boolean
  searchKeys?: (keyof T)[]
  actions?: (row: T) => React.ReactNode
}) {
  const [q, setQ] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!q.trim() || searchKeys.length === 0) return rows
    const needle = q.toLowerCase()
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(needle)),
    )
  }, [q, rows, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage, pageSize])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {title ? <h2 className="text-sm font-semibold text-slate-100">{title}</h2> : null}
          <p className="text-xs text-slate-400">{filtered.length} records</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {searchKeys.length ? (
            <div className="w-full sm:w-72">
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Search..." />
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-2 text-xs text-slate-100"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}/page</option>
              ))}
            </select>
            <div className="text-xs text-slate-400">
              Page {safePage} / {totalPages}
            </div>
            <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>
              Prev
            </Button>
            <Button variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/40 text-xs text-slate-300">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-4 py-3 font-medium">
                    {c.header}
                  </th>
                ))}
                {actions ? <th className="px-4 py-3 text-right font-medium">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-6 text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-slate-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                pageRows.map((r, idx) => (
                  <tr key={r.id ?? idx} className="hover:bg-slate-900/30">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 align-top text-slate-100">
                        {c.render ? c.render(r) : String(r[c.key] ?? '')}
                      </td>
                    ))}
                    {actions ? <td className="px-4 py-3 text-right">{actions(r)}</td> : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
