'use client'

import * as React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const base =
  'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500/60 disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary: 'bg-sky-600 text-white hover:bg-sky-500',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
