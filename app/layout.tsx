import './globals.css'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'HydroLab | Just Keep Hydrated',
  description: 'Water treatment solutions by HydroLab',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-slate-50 text-slate-900')}>
        {children}
      </body>
    </html>
  )
}
