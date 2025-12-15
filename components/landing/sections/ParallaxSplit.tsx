'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { usePrefersReducedMotion } from '../utilities/usePrefersReducedMotion'

export function ParallaxSplit() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const prefersReducedMotion = usePrefersReducedMotion()

  const textY = useTransform(scrollYProgress, [0, 1], [30, prefersReducedMotion ? 0 : -40])
  const cardY = useTransform(scrollYProgress, [0, 1], [10, prefersReducedMotion ? 0 : 60])

  return (
    <section ref={sectionRef} className="relative px-4">
      <div className="mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-lg lg:grid-cols-2">
        <motion.div style={{ y: textY }} className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-200/80">Mission Control</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Design-build-maintain for every drop</h2>
          <p className="text-lg text-slate-200/90">
            Mark Two Seven Co., Ltd. pairs reliable engineering with on-the-ground support. Each plant is designed for high availability,
            modular upgrades, and transparent lifecycle monitoring so your team always knows the state of the water line.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['High-availability designs', 'Redundant stages and conservative loading keep quality steady.'],
              ['Lifecycle monitoring', 'Panel telemetry links to responsive local support teams.'],
            ].map(([title, description]) => (
              <motion.div
                key={title}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-base font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-200/80">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: cardY }}
          className="relative flex items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900/60 via-sky-900/30 to-slate-950"
        >
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            {[
              ['Start-to-finish EPC', 'Integrated fabrication and commissioning minimize downtime.'],
              ['Nationwide support', 'Local crews keep plants running across Myanmar.'],
              ['Training & consultation', 'Operators learn with us to keep quality predictable.'],
            ].map(([title, description]) => (
              <motion.div
                key={title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true, amount: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-sm text-slate-200/75">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
