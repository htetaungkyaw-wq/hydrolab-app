'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'
type ToastItem = { id: string; type: ToastType; message: string }

const ToastCtx = createContext<{ toast: (t: { type?: ToastType; message: string }) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const api = useMemo(() => {
    return {
      toast: ({ type = 'info', message }: { type?: ToastType; message: string }) => {
        const id = crypto.randomUUID()
        setItems((prev) => [...prev, { id, type, message }])
        setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3200)
      },
    }
  }, [])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[360px] max-w-[90vw] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              t.type === 'success'
                ? 'border-emerald-700/40 bg-emerald-950/80 text-emerald-100'
                : t.type === 'error'
                  ? 'border-rose-700/40 bg-rose-950/80 text-rose-100'
                  : 'border-slate-700/40 bg-slate-950/80 text-slate-100'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
