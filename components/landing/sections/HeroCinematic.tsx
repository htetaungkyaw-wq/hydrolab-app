'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { usePrefersReducedMotion } from '../utilities/usePrefersReducedMotion'

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const prefersReducedMotion = usePrefersReducedMotion()

  const y = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -80])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 60])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 50])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/70 to-slate-950 px-4 pb-16 pt-24 sm:pt-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.12),transparent_45%)]" />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/10 via-cyan-400/10 to-transparent blur-3xl"
        style={{ y: glowY }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
        <motion.div style={{ y }} className="space-y-6 lg:w-3/5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300/80">Just Keep Hydrated</p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Holistic water treatment engineered with cinematic precision
          </h1>
          <p className="max-w-2xl text-lg text-slate-200/90">
            HydroLab blends two decades of TAC Water Engineering expertise with modern monitoring to keep Myanmar&apos;s water systems
            resilient—across residential towers, life sciences, and mission-critical industry.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
            >
              Customer Login
            </Link>
            <Link
              href="#projects"
              className="rounded-full border border-sky-200/50 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:-translate-y-0.5 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
            >
              Explore Projects
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm text-slate-300 sm:grid-cols-4">
            {[['20+ yrs', 'Field Expertise'], ['24/7', 'Monitoring Ready'], ['Nationwide', 'Support'], ['Modular', 'Upgrades']].map(
              ([title, subtitle]) => (
                <div key={title} className="space-y-1 rounded-lg border border-white/5 bg-white/5 p-3">
                  <p className="text-base font-semibold text-white">{title}</p>
                  <p className="text-xs uppercase tracking-wide text-sky-100/70">{subtitle}</p>
                </div>
              ),
            )}
          </div>
        </motion.div>

        <motion.div style={{ y: cardY }} className="relative lg:w-2/5">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-white/0 to-white/5 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-200/80">Industries we serve</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-100/90">
              {[
                'Residential',
                'Commercial',
                'Industrial',
                'F&B',
                'Healthcare/Lab',
                'Municipal/Community',
                'Desalination',
                'Training',
                'Consultation',
              ].map((item) => (
                <motion.div
                  key={item}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, delay: 0.03 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
