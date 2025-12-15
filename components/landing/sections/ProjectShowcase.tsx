'use client'

import { projects } from '@/lib/content'
import { motion } from 'motion/react'

import { usePrefersReducedMotion } from '../utilities/usePrefersReducedMotion'

export function ProjectShowcase() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section id="projects" className="relative px-4">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Recent projects</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Engineered to scale with demand</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-200/80">
            From desalination to boiler feed and healthcare sterilization, each install is tuned for uptime, safety, and quality.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.98 }}
              transition={{ duration: 0.45, delay: index * 0.03 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-400/10 to-transparent" aria-hidden />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-sky-100/80">{project.flow_rate}</p>
                <p className="text-lg font-semibold text-white">{project.title}</p>
                <p className="text-sm text-slate-200/80">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
