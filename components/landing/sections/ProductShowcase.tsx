'use client'

import { products } from '@/lib/content'
import { motion } from 'motion/react'

import { usePrefersReducedMotion } from '../utilities/usePrefersReducedMotion'

export function ProductShowcase() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative px-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Signature products</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Trusted filtration backbones</h2>
          </div>
          <p className="max-w-lg text-sm text-slate-200/80">
            Ultra-filtration and iron removal systems tuned for Myanmar&apos;s diverse feedwater conditions.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 40 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5"
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/15 via-cyan-300/10 to-transparent blur-2xl" />
              </div>
              <p className="text-lg font-semibold text-white">{product.title}</p>
              <p className="mt-2 text-sm text-slate-200/80">{product.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
