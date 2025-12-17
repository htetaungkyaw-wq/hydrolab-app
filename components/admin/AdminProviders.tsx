'use client'

import React from 'react'
import { ToastProvider } from './ui/toast'

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
