'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

import { HeroCinematic } from './sections/HeroCinematic'
import { ParallaxSplit } from './sections/ParallaxSplit'
import { CinematicStory } from './sections/CinematicStory'
import { ProjectShowcase } from './sections/ProjectShowcase'
import { ProductShowcase } from './sections/ProductShowcase'
import { TrustedBy } from './sections/TrustedBy'
import { CinemaOutro } from './sections/CinemaOutro'

export function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.2 })

  return (
    <div
      ref={scrollRef}
      className="relative overflow-hidden bg-slate-950 text-slate-100"
      style={{
        backgroundImage:
          'radial-gradient(circle at 10% 20%, rgba(56,189,248,0.12) 0, transparent 30%), radial-gradient(circle at 90% 10%, rgba(14,165,233,0.1) 0, transparent 25%), radial-gradient(circle at 80% 70%, rgba(12,74,110,0.18) 0, transparent 28%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(124,58,237,0.2),transparent_40%)] opacity-60 mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent,rgba(14,165,233,0.06))]" />
      <motion.div
        aria-hidden
        className="fixed left-4 top-28 hidden h-2/3 w-[3px] origin-top rounded-full bg-slate-700/70 md:block"
        style={{ scaleY: progress }}
      />

      <div className="relative z-10 space-y-24 pb-20">
        <HeroCinematic />
        <ParallaxSplit />
        <CinematicStory />
        <ProjectShowcase />
        <ProductShowcase />
        <TrustedBy />
        <CinemaOutro />
      </div>
    </div>
  )
}

export default LandingPage
