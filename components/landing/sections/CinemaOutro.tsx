'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

export function CinemaOutro() {
  return (
    <section className="relative px-4">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-cyan-400/10 to-slate-900/80 p-10 text-center backdrop-blur">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-100/80">Ready when you are</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Plan your next water milestone</h2>
          <p className="text-lg text-slate-100/80">
            Schedule a site survey or log into the portal to see how HydroLab keeps every drop accountable.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/login"
              className="w-full rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Go to Portal
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Contact Engineering
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
