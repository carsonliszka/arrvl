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

const STATS = [
  {
    v: '24+',
    align: 'lg:self-end',
    label: (
      <>
        Projects <span className="text-[#0b0b0b]">shipped</span> with measurable{' '}
        <span className="text-[#0b0b0b]">conversion lift</span>
      </>
    ),
  },
  {
    v: '3.2s',
    align: 'lg:self-start',
    label: (
      <>
        Average time to first <span className="text-[#0b0b0b]">meaningful action</span> on our sites
      </>
    ),
  },
  {
    v: '89%',
    align: 'lg:self-end',
    label: (
      <>
        Of clients come from <span className="text-[#0b0b0b]">direct referrals</span>
      </>
    ),
  },
]

function Stat({ s }: { s: (typeof STATS)[number] }) {
  return (
    <div className={`max-w-[260px] ${s.align}`}>
      <p
        className={`font-semibold uppercase leading-none tracking-[-0.03em] text-[#0b0b0b] ${geist}`}
        style={{ fontSize: 'clamp(44px,4vw,68px)' }}
      >
        {s.v}
      </p>
      <p className={`mt-3 text-[11px] uppercase leading-[1.5] tracking-[0.06em] text-[#0b0b0b]/55 ${geist}`}>
        {s.label}
      </p>
    </div>
  )
}

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
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-16">
          {/* who we are */}
          <div className="lg:col-span-6">
            <p data-story-fade className={`mb-8 text-[12px] font-medium uppercase tracking-[0.14em] text-[#0b0b0b]/55 ${geist}`} style={{ opacity: 0 }}>
              Who we are
            </p>
            <div className="space-y-6">
              {PARAS.map((p, i) => (
                <p
                  key={i}
                  data-story-fade
                  className={`max-w-[560px] leading-[1.55] text-[#0b0b0b]/75 ${geist} ${i === 0 ? 'text-[clamp(18px,1.5vw,22px)] text-[#0b0b0b]' : 'text-[15px]'}`}
                  style={{ opacity: 0 }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* by the numbers — staggered stats + dots */}
          <div data-story-fade className="lg:col-span-5 lg:col-start-8" style={{ opacity: 0 }}>
            <p className={`mb-10 text-[12px] font-medium uppercase tracking-[0.14em] text-[#0b0b0b]/55 ${geist}`}>
              By the numbers
            </p>
            <div className="flex flex-col gap-9">
              <span aria-hidden className="hidden h-2 w-2 rounded-full bg-[#0b0b0b]/40 lg:block lg:self-end" />
              <Stat s={STATS[0]} />
              <span aria-hidden className="hidden h-2 w-2 rounded-full bg-[#0b0b0b]/40 lg:block lg:self-start" />
              <Stat s={STATS[1]} />
              <span aria-hidden className="hidden h-2 w-2 rounded-full bg-[#0b0b0b]/40 lg:block lg:self-end" />
              <Stat s={STATS[2]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
