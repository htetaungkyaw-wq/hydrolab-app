'use client'

import { clients } from '@/lib/content'
import { motion } from 'motion/react'

export function TrustedBy() {
  return (
    <section className="relative px-4">
      <div className="mx-auto max-w-6xl space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/80 p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Trusted by</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Partners and operators nationwide</h2>
          </div>
          <p className="max-w-md text-sm text-slate-200/80">National and global brands depend on HydroLab installations.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((client) => (
            <motion.div
              key={client}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm font-semibold text-slate-100 shadow"
            >
              {client}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
