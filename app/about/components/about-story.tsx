'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const geist = 'font-[family-name:var(--font-geist)]'

const PARAS = [
  'ARRVL brings bold digital ideas to life through motion, interaction, and engineering. Brands partner with us when digital needs to do more than function or look good.',
  'We are a tight-knit team of obsessive craftspeople. Designers, engineers, and motion specialists who push ideas past the expected to create clarity, meaning, and impact.',
  'We become part of your team. No management layers, no distance. You work directly with the people who design and build, from day one to launch.',
]

const FACTS = [
  { v: '2018', l: 'Independent since' },
  { v: '4', l: 'Disciplines, one roof' },
  { v: '1', l: 'Team, zero layers' },
  { v: '100%', l: 'Direct collaboration' },
]

export function AboutStory() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-story-fade]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 72%' },
        }
      )
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="bg-[#e9e9e9] text-[#0b0b0b]">
      <div className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p data-story-fade className={`mb-8 text-[12px] font-medium uppercase tracking-[0.14em] text-[#0b0b0b]/55 ${geist}`} style={{ opacity: 0 }}>
              Who we are
            </p>
            <div className="space-y-6">
              {PARAS.map((p, i) => (
                <p
                  key={i}
                  data-story-fade
                  className={`max-w-[640px] leading-[1.55] text-[#0b0b0b]/75 ${geist} ${i === 0 ? 'text-[clamp(18px,1.5vw,22px)] text-[#0b0b0b]' : 'text-[15px]'}`}
                  style={{ opacity: 0 }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-4 lg:col-start-9 lg:grid-cols-1 lg:gap-y-9">
            {FACTS.map((f) => (
              <div key={f.l} data-story-fade style={{ opacity: 0 }}>
                <p
                  className={`font-semibold uppercase leading-none tracking-[-0.03em] text-[#0b0b0b] ${geist}`}
                  style={{ fontSize: 'clamp(40px, 4.5vw, 64px)' }}
                >
                  {f.v}
                </p>
                <p className={`mt-3 text-[12px] uppercase tracking-[0.08em] text-[#0b0b0b]/55 ${geist}`}>
                  {f.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
