import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'HydroLab | Just Keep Hydrated',
  description: 'Water treatment solutions by HydroLab',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-slate-50 text-slate-900 antialiased', poppins.className)}>
        {children}
      </body>
    </html>
  )
}
