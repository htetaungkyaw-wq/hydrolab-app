'use client'

import { motion } from 'motion/react'

import { usePrefersReducedMotion } from '../utilities/usePrefersReducedMotion'

const pillars = [
  {
    title: 'Assess & model',
    copy: 'We survey water sources, model demand, and right-size trains for resilience and easier expansion.',
  },
  {
    title: 'Engineer & build',
    copy: 'Fabrication and commissioning teams coordinate directly with your operators to ensure adoption.',
  },
  {
    title: 'Monitor & refine',
    copy: 'Lifecycle telemetry, retraining, and consumables support keep quality predictable year-round.',
  },
]

export function CinematicStory() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative px-4">
      <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/90 p-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Field-ready story</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Built for the realities of Myanmar infrastructure</h2>
          <p className="max-w-2xl text-lg text-slate-200/90">
            Power fluctuations, mixed feedwater, and fast timelines are our everyday. We design so your operations team stays calm
            when demand spikes and quality needs to hold.
          </p>
        </div>

        <div className="space-y-4">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 60 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.4 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-transparent blur-2xl" />
              </div>
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-sky-100/80">Step {index + 1}</p>
                  <p className="text-xl font-semibold text-white">{pillar.title}</p>
                  <p className="text-sm text-slate-200/80">{pillar.copy}</p>
                </div>
                <motion.div
                  animate={{ scale: prefersReducedMotion ? 1 : [1, 1.08, 1] }}
                  transition={{ duration: prefersReducedMotion ? 0 : 6, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                  className="mt-1 h-12 w-12 rounded-full bg-gradient-to-br from-sky-400/60 to-cyan-300/40 text-center text-lg font-bold text-slate-900 shadow-lg shadow-sky-500/30"
                >
                  <div className="flex h-full items-center justify-center">0{index + 1}</div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
