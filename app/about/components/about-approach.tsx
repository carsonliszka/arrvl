'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const geist = 'font-[family-name:var(--font-geist)]'

const STEPS = [
  {
    n: '01',
    title: 'Strategy',
    body: 'Every project starts with understanding how people decide. We map the journey, find where attention slips, and shape a direction that makes the next step feel obvious.',
  },
  {
    n: '02',
    title: 'Creative',
    body: 'Art direction, brand identity, and interface design that carries a point of view. One visual system, applied with intent across every surface.',
  },
  {
    n: '03',
    title: 'Technology',
    body: 'Clean, scalable front-end. WebGL, shaders, and web apps engineered for speed and built to last, so the experience holds up under real traffic.',
  },
  {
    n: '04',
    title: 'Production',
    body: 'Motion, 3D, and scroll-driven interaction that brings the work to life, then launch support that keeps it sharp long after it ships.',
  },
]

export function AboutApproach() {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-app-word]',
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        '[data-app-row]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 64%' },
        }
      )
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="bg-[#0b0b0b] text-white">
      <div className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className={`mb-6 text-[12px] font-medium uppercase tracking-[0.14em] text-white/40 ${geist}`}>
              Approach
            </p>
            <h2
              className={`font-semibold uppercase text-white ${geist}`}
              style={{ fontSize: 'clamp(40px, 6vw, 92px)', letterSpacing: '-0.05em', lineHeight: '0.82em' }}
            >
              {['How we', 'work.'].map((w) => (
                <span key={w} className="block overflow-hidden">
                  <span data-app-word className="inline-block will-change-transform">
                    {w}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-white/12">
              {STEPS.map((s, i) => {
                const isOpen = open === i
                return (
                  <div key={s.title} data-app-row className="border-b border-white/12" style={{ opacity: 0 }}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center gap-6 py-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className={`text-[13px] font-medium tabular-nums text-white/45 ${geist}`}>{s.n}</span>
                      <span className={`flex-1 text-[clamp(18px,1.8vw,24px)] font-medium uppercase tracking-[-0.02em] text-white ${geist}`}>
                        {s.title}
                      </span>
                      <span className="relative h-3 w-3 shrink-0">
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/60" />
                        <span
                          className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/60 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                        />
                      </span>
                    </button>
                    <div
                      className="grid transition-all duration-500 ease-out"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                    >
                      <div className="overflow-hidden">
                        <p className={`max-w-[600px] pb-7 pl-[2.6rem] text-[14px] leading-[1.6] text-white/60 ${geist}`}>
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
